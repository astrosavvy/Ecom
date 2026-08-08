import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_OTP_MODULE } from "../../../../modules/younoya-otp"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email?: string }

  if (!email) {
    return res.status(400).json({ message: "Email is required." })
  }

  const otpService = req.scope.resolve(YOUNOYA_OTP_MODULE) as any
  const cooldownSeconds = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || "60")

  try {
    const recentChallenges = await otpService.listOtpChallenges(
      { email: email.toLowerCase() },
      { order: { created_at: "DESC" }, take: 1 }
    )

    if (recentChallenges && recentChallenges.length > 0) {
      const lastSent = new Date(recentChallenges[0].created_at)
      const elapsed = (Date.now() - lastSent.getTime()) / 1000
      if (elapsed < cooldownSeconds) {
        const wait = Math.ceil(cooldownSeconds - elapsed)
        return res.status(429).json({ message: `Please wait ${wait} seconds before requesting a new code.` })
      }
    }
  } catch (e) {
    // fallback
  }

  return res.json({ success: true, message: "Code resend initiated." })
}
