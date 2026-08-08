import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import nodemailer from "nodemailer"

export default async function otpRequestedHandler({ event, container }: SubscriberArgs<{ email: string; otp: string }>) {
  const { email, otp } = event.data
  if (!email || !otp) return

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
          <p>Hello,</p>
          <p>Your 6-digit verification code is:</p>
          <div style="background:#f7f7f7;padding:15px;text-align:center;border-radius:6px;font-size:28px;font-weight:bold;letter-spacing:6px;color:#167a68;margin:20px 0">
            ${otp}
          </div>
          <p style="font-size:14px;color:#666">Valid for <strong>10 minutes</strong>. Do not share this code.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="font-size:12px;color:#999;text-align:center">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })
    console.log(`✉️ OTP subscriber email sent to ${email}`)
  } catch (e) {
    console.error("Failed to send OTP subscriber email:", e)
  }
}

export const config: SubscriberConfig = {
  event: "otp.requested",
}
