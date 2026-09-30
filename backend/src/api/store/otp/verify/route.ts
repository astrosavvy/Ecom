import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { YOUNOYA_OTP_MODULE } from "../../../../modules/younoya-otp"
import { verifyOtp, isExpired } from "../../../../modules/younoya-otp/utils/otp"

const MOCK_OTP = "1234"

function normalizePhone(raw: string): string | null {
  const digits = String(raw || "").replace(/[^\d+]/g, "")
  if (/^\+?\d{10,15}$/.test(digits)) {
    if (digits.length === 10) return `+91${digits}`
    return digits.startsWith("+") ? digits : `+${digits}`
  }
  return null
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { phone, email, otp } = req.body as {
    phone?: string
    email?: string
    otp?: string
  }

  const identifierType: "mobile" | "email" = phone ? "mobile" : "email"
  let identifier: string | null = null

  if (phone) {
    identifier = normalizePhone(phone)
  } else if (email) {
    identifier = email.toLowerCase()
  }

  if (!identifier || !otp) {
    return res.status(400).json({ message: "Identifier and code are required." })
  }

  const otpService = req.scope.resolve(YOUNOYA_OTP_MODULE) as any

  let challenge
  try {
    const challenges = await otpService.listOtpChallenges(
      {
        identifier,
        identifier_type: identifierType,
        status: "pending",
      },
      { order: { created_at: "DESC" }, take: 1 }
    )
    challenge = challenges?.[0]
  } catch (e) {
    // fallback if table is not yet generated
  }

  if (!challenge) {
    return res.status(400).json({ message: "Invalid or expired code. Request a new one." })
  }

  if (isExpired(challenge.expires_at)) {
    await otpService.updateOtpChallenges({ id: challenge.id, status: "expired" })
    return res.status(400).json({ message: "Code expired. Request a new one." })
  }

  if (challenge.attempts >= challenge.max_attempts) {
    await otpService.updateOtpChallenges({ id: challenge.id, status: "rate_limited" })
    return res.status(400).json({ message: "Too many attempts. Request a new code." })
  }

  const isMock = process.env.OTP_MODE === "mock"
  const isValid =
    (isMock && otp === MOCK_OTP) || verifyOtp(otp, challenge.salt, challenge.otp_hash)

  if (!isValid) {
    const newAttempts = challenge.attempts + 1
    await otpService.updateOtpChallenges({ id: challenge.id, attempts: newAttempts })
    const remaining = challenge.max_attempts - newAttempts
    return res.status(400).json({
      message: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    })
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Login is temporarily unavailable." })
  }

  await otpService.updateOtpChallenges({
    id: challenge.id,
    status: "verified",
    consumed_at: new Date(),
  })

  // short-lived single-purpose ticket; exchanged for a Medusa customer JWT at
  // /auth/customer/younoya-mobile-otp
  const ticket = jwt.sign(
    {
      purpose: "otp-login",
      identifier,
      identifier_type: identifierType,
      jti: crypto.randomBytes(16).toString("hex"),
    },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  )

  return res.json({
    success: true,
    ticket,
    identifier,
    identifier_type: identifierType,
  })
}
