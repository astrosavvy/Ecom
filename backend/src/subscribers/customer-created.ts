import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import nodemailer from "nodemailer"

export default async function customerCreatedHandler({ event, container }: SubscriberArgs<any>) {
  const customer = event.data
  const customerEmail = customer?.email || "customer@example.com"
  const firstName = customer?.first_name || "Valued Customer"

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "1025"),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  })

  const welcomeHtml = `
    <div style="font-family:Arial,sans-serif;max-width:550px;margin:0 auto;padding:24px;border:1px solid #e0e0e0;border-radius:12px;background:#fff">
      <div style="text-align:center;margin-bottom:20px">
        <h1 style="color:#d9631e;margin:0;font-size:28px">YOUNOYA</h1>
        <p style="color:#666;font-size:14px;margin-top:4px">Sacred Astrology & Vedic Keepsakes</p>
      </div>

      <p style="font-size:16px;color:#333">Namaste ${firstName},</p>
      <p style="font-size:15px;color:#444;line-height:1.6">
        Welcome to YOUNOYA! Your account has been verified through zero-password email authentication. 
        You can now view your order history and saved delivery addresses anytime.
      </p>

      <div style="text-align:center;margin:28px 0">
        <a href="http://localhost:8000/account" style="background:#d9631e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">Go to Account Dashboard</a>
      </div>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:12px;color:#999;text-align:center">© 2026 YOUNOYA. All rights reserved.</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "YOUNOYA"}" <${process.env.SMTP_FROM_EMAIL || "noreply@younoya.com"}>`,
      to: customerEmail,
      subject: "Welcome to YOUNOYA!",
      html: welcomeHtml,
    })
    console.log(`✉️ Welcome email sent to customer: ${customerEmail}`)
  } catch (e) {
    console.error("Failed to send welcome email:", e)
  }
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
