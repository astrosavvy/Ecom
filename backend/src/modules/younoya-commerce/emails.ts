import nodemailer from "nodemailer"
import { enqueue, CommerceError, orderPaise, rupees } from "./db"
import { readOrder } from "./orders"
import { settings, defaults } from "./settings"
export async function queueEmail(orderId: string, key: string, subject: string, text: string) {
  return enqueue("email",`email:${orderId}:${key}`,{ subject,text },orderId)
}
export async function sendOrderEmail(scope: any, operation: any) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM_EMAIL) throw new CommerceError("Order email delivery is not configured",503)
  const order = await readOrder(scope,operation.order_id)
  if (!order.email) throw new Error("Order email is missing")
  const s = await settings()
  const business = s.published || defaults
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", connectionTimeout: 10000, socketTimeout: 12000,
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}) })
  const body = `${operation.payload.text}\n\nOrder #${order.display_id || order.id}\n${order.items.map((i: any) => `${i.title} × ${i.quantity}`).join("\n")}\nTotal: INR ${rupees(orderPaise(order.total,order)).toFixed(2)}\n\nView your order: https://younoya.com/account/orders/${order.id}\n${business.supportEmail}\n${business.legalName}`
  try { await transporter.sendMail({ from: process.env.SMTP_FROM_EMAIL, replyTo: business.supportEmail, to: order.email,
    messageId: `<${operation.id}@younoya.com>`, subject: `${operation.payload.subject} · YOUNOYA #${order.display_id || order.id}`, text: body }) }
  finally { transporter.close() }
  return { sent: true }
}
