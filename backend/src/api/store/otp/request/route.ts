import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_OTP_MODULE } from "../../../../modules/younoya-otp"
import { generateOtp, hashOtp } from "../../../../modules/younoya-otp/utils/otp"
import { checkRateLimit } from "../../../../modules/younoya-otp/utils/rate-limit"
import nodemailer from "nodemailer"

const MOCK_OTP = "1234"

function normalizePhone(raw: string): string | null {
  const digits = String(raw || "").replace(/[^\d+]/g, "")
  if (/^\+?\d{10,15}$/.test(digits)) {
    // assume India when no country code
    if (digits.length === 10) return `+91${digits}`
    return digits.startsWith("+") ? digits : `+${digits}`
  }
  return null
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { phone, email } = req.body as { phone?: string; email?: string }

  const identifierType: "mobile" | "email" = phone ? "mobile" : "email"
  let identifier: string | null = null

  if (phone) {
    identifier = normalizePhone(phone)
    if (!identifier) {
      return res.status(400).json({ message: "Valid mobile number is required." })
    }
  } else if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    identifier = email.toLowerCase()
  } else {
    return res.status(400).json({ message: "A valid mobile number or email is required." })
  }

  const otpService = req.scope.resolve(YOUNOYA_OTP_MODULE) as any
  const clientIp = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1"
  const maxPerHour = parseInt(process.env.OTP_RATE_LIMIT_MAX_PER_HOUR || "10")

  const idLimit = await checkRateLimit(otpService, identifier, identifierType, maxPerHour)
  const ipLimit = await checkRateLimit(otpService, String(clientIp), "ip", maxPerHour * 2)

  if (!idLimit.allowed || !ipLimit.allowed) {
    return res.status(429).json({ message: "Too many requests. Please wait before trying again." })
  }

  const isMock = process.env.OTP_MODE === "mock"
  if (identifierType === "mobile" && !isMock) {
    return res.status(503).json({ message: "Mobile verification is not configured. Please use email." })
  }
  if (identifierType === "email" && !isMock && !process.env.SMTP_HOST) {
    return res.status(503).json({ message: "Email verification is temporarily unavailable." })
  }
  const rawOtp = isMock ? MOCK_OTP : generateOtp()
  const { hash, salt } = hashOtp(rawOtp)
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10")
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000)

  try {
    const pending = await otpService.listOtpChallenges({
      identifier,
      identifier_type: identifierType,
      status: "pending",
    })
    if (pending && pending.length > 0) {
      for (const p of pending) {
        await otpService.updateOtpChallenges({ id: p.id, status: "expired" })
      }
    }

    await otpService.createOtpChallenges({
      identifier,
      identifier_type: identifierType,
      otp_hash: hash,
      salt,
      expires_at: expiresAt,
      status: "pending",
      ip_address: String(clientIp),
    })
  } catch (e) {
    console.error("OTP storage failed:", e)
    return res.status(503).json({ message: "Verification is temporarily unavailable." })
  }

  let delivered = true
  if (identifierType === "email" && !isMock) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "1025"),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    })
    try {
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "YOUNOYA"}" <${process.env.SMTP_FROM_EMAIL || "noreply@younoya.com"}>`,
        to: identifier,
        subject: "Your YOUNOYA Verification Code",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px">
            <h2 style="color:#d4af37;text-align:center">YOUNOYA</h2>
            <p>Your 6-digit verification code is:</p>
            <div style="background:#f7f7f7;padding:15px;text-align:center;border-radius:6px;font-size:28px;font-weight:bold;letter-spacing:6px;color:#0b0e18;margin:20px 0">
              ${rawOtp}
            </div>
            <p style="font-size:14px;color:#666">Valid for <strong>${expiryMinutes} minutes</strong>. Do not share.</p>
          </div>
        `,
      })
    } catch (e) {
      delivered = false
      console.error("Failed to send OTP email:", e)
    }
  }

  if (!delivered) return res.status(503).json({ message: "Could not send the code. Please try again shortly." })
  return res.json({
    success: true,
    identifier_type: identifierType,
    message:
      identifierType === "mobile"
        ? isMock
          ? "Mock mode: use code 1234."
          : "Code sent to your mobile."
        : "If this email is valid, you will receive a verification code shortly.",
    ...(isMock ? { mock_otp: MOCK_OTP } : {}),
  })
}
