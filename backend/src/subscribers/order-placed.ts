import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import nodemailer from "nodemailer"

export default async function orderPlacedHandler({ event, container }: SubscriberArgs<any>) {
  const order = event.data
  const customerEmail = order?.email || order?.customer?.email || "customer@example.com"
  const adminEmail = process.env.SMTP_FROM_EMAIL || "support@younoya.com"
  const displayId = order?.display_id || order?.id || `ORD_${Date.now()}`
  const totalAmount = order?.total ? `₹${(order.total / 100).toFixed(0)}` : "₹1,099"

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "1025"),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  })

  // 1. Customer Email Template
  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:550px;margin:0 auto;padding:24px;border:1px solid #e0e0e0;border-radius:12px;background:#fff">
      <div style="text-align:center;margin-bottom:20px">
        <h1 style="color:#d9631e;margin:0;font-size:28px">YOUNOYA</h1>
        <p style="color:#666;font-size:14px;margin-top:4px">Order Confirmation & Sacred Blessings</p>
      </div>

      <p style="font-size:16px;color:#333">Hello,</p>
      <p style="font-size:15px;color:#444;line-height:1.6">
        Thank you for your order! We have received your order <strong>#${displayId}</strong>. 
        Your handcrafted Vedic Rakhi is being prepared with intention and sacred symbolism.
      </p>

      <div style="background:#f9f8f6;padding:16px;border-radius:8px;margin:20px 0;border:1px solid #eee">
        <h3 style="margin-top:0;color:#167a68">Order Details</h3>
        <p style="margin:4px 0;font-size:14px"><strong>Order ID:</strong> #${displayId}</p>
        <p style="margin:4px 0;font-size:14px"><strong>Payment Method:</strong> Razorpay (Online)</p>
        <p style="margin:4px 0;font-size:14px"><strong>Total Amount:</strong> <span style="color:#167a68;font-weight:bold">${totalAmount}</span></p>
      </div>

      <p style="font-size:14px;color:#666">If you have any questions, reach out to us at <a href="mailto:support@younoya.com" style="color:#d9631e">support@younoya.com</a> or WhatsApp <strong>+91 98200-12345</strong>.</p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:12px;color:#999;text-align:center">© 2026 YOUNOYA. All rights reserved.</p>
    </div>
  `

  // 2. Admin Notification Email Template
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:550px;margin:0 auto;padding:24px;border:1px solid #e0e0e0;border-radius:12px;background:#fff">
      <h2 style="color:#d9631e;margin-top:0">🚨 New Order Received!</h2>
      <p style="font-size:15px;color:#333">A new order has been placed on YOUNOYA.</p>

      <div style="background:#f4f4f4;padding:16px;border-radius:8px;margin:20px 0">
        <p style="margin:4px 0;font-size:14px"><strong>Order ID:</strong> #${displayId}</p>
        <p style="margin:4px 0;font-size:14px"><strong>Customer Email:</strong> ${customerEmail}</p>
        <p style="margin:4px 0;font-size:14px"><strong>Total Amount:</strong> ${totalAmount}</p>
        <p style="margin:4px 0;font-size:14px"><strong>Payment Provider:</strong> Razorpay</p>
      </div>

      <p style="font-size:14px;color:#666">Log into the Medusa Admin Dashboard at <a href="http://localhost:9000/app" style="color:#167a68">/app</a> to process fulfillment.</p>
    </div>
  `

  try {
    // Send to Customer
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "YOUNOYA"}" <${process.env.SMTP_FROM_EMAIL || "noreply@younoya.com"}>`,
      to: customerEmail,
      subject: `Order Confirmation #${displayId} — YOUNOYA`,
      html: customerHtml,
    })
    console.log(`✉️ Order confirmation email sent to customer: ${customerEmail}`)

    // Send to Admin
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "YOUNOYA System"}" <${process.env.SMTP_FROM_EMAIL || "noreply@younoya.com"}>`,
      to: adminEmail,
      subject: `🚨 [New Order] #${displayId} — YOUNOYA Admin`,
      html: adminHtml,
    })
    console.log(`✉️ Admin order notification email sent to: ${adminEmail}`)
  } catch (e) {
    console.error("Failed to send order placed emails:", e)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
