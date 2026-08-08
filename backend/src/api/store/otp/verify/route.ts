import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_OTP_MODULE } from "../../../../modules/younoya-otp"
import { verifyOtp, isExpired } from "../../../../modules/younoya-otp/utils/otp"
import { Modules } from "@medusajs/framework/utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, otp, fullName } = req.body as {
    email?: string
    otp?: string
    fullName?: string
  }

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and code are required." })
  }

  const otpService = req.scope.resolve(YOUNOYA_OTP_MODULE) as any

  let challenge
  try {
    const challenges = await otpService.listOtpChallenges(
      {
        email: email.toLowerCase(),
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

  const isValid = verifyOtp(otp, challenge.salt, challenge.otp_hash)

  if (!isValid) {
    const newAttempts = challenge.attempts + 1
    await otpService.updateOtpChallenges({ id: challenge.id, attempts: newAttempts })
    const remaining = challenge.max_attempts - newAttempts
    return res.status(400).json({
      message: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    })
  }

  await otpService.updateOtpChallenges({
    id: challenge.id,
    status: "verified",
    consumed_at: new Date(),
  })

  const customerService = req.scope.resolve(Modules.CUSTOMER)
  let customer
  let isNewCustomer = false

  try {
    const customers = await customerService.listCustomers({ email: email.toLowerCase() })
    customer = customers?.[0]

    if (!customer) {
      isNewCustomer = true
      customer = await customerService.createCustomers({
        email: email.toLowerCase(),
        first_name: fullName?.split(" ")[0] || email.split("@")[0],
        last_name: fullName?.split(" ").slice(1).join(" ") || "",
      })
    }
  } catch (e) {
    console.error("Customer resolution error:", e)
  }

  return res.json({
    success: true,
    message: "Email verified successfully.",
    isNewCustomer,
    customer: customer
      ? {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
        }
      : { email: email.toLowerCase() },
  })
}
