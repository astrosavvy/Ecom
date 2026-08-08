import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { YOUNOYA_OTP_MODULE } from "../../../../modules/younoya-otp"
import { generateOtp, hashOtp } from "../../../../modules/younoya-otp/utils/otp"
import { checkRateLimit } from "../../../../modules/younoya-otp/utils/rate-limit"
import nodemailer from "nodemailer"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email } = req.body as { email?: string }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Valid email is required." })
  }

  const otpService = req.scope.resolve(YOUNOYA_OTP_MODULE) as any
  const clientIp = req.ip || req.headers["x-forwarded-for"] || "127.0.0.1"
  const maxPerHour = parseInt(process.env.OTP_RATE_LIMIT_MAX_PER_HOUR || "10")

  const emailLimit = await checkRateLimit(otpService, email.toLowerCase(), "email", maxPerHour)
  const ipLimit = await checkRateLimit(otpService, String(clientIp), "ip", maxPerHour * 2)

  if (!emailLimit.allowed || !ipLimit.allowed) {
    return res.status(429).json({ message: "Too many requests. Please wait before trying again." })
  }

  const rawOtp = generateOtp()
  const { hash, salt } = hashOtp(rawOtp)
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10")
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000)

  try {
    const pending = await otpService.listOtpChallenges({
      email: email.toLowerCase(),
      status: "pending",
    })
    if (pending && pending.length > 0) {
      for (const p of pending) {
        await otpService.updateOtpChallenges({ id: p.id, status: "expired" })
      }
    }

    await otpService.createOtpChallenges({
      email: email.toLowerCase(),
      otp_hash: hash,
      salt,
      expires_at: expiresAt,
      status: "pending",
      ip_address: String(clientIp),
    })
  } catch (e) {
    console.error("OTP storage warning:", e)
  }

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
      to: email,
      subject: "Your YOUNOYA Verification Code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px">
          <h2 style="color:#d9631e;text-align:center">YOUNOYA</h2>
          <p>Your 6-digit verification code is:</p>
          <div style="background:#f7f7f7;padding:15px;text-align:center;border-radius:6px;font-size:28px;font-weight:bold;letter-spacing:6px;color:#167a68;margin:20px 0">
            ${rawOtp}
          </div>
          <p style="font-size:14px;color:#666">Valid for <strong>${expiryMinutes} minutes</strong>. Do not share.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="font-size:12px;color:#999;text-align:center">If you didn't request this, ignore this email.</p>
        </div>
      `,
    })
  } catch (e) {
    console.error("Failed to send OTP email:", e)
  }

  return res.json({
    success: true,
    message: "If this email is valid, you will receive a verification code shortly.",
  })
}
