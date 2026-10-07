import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import nodemailer from "nodemailer"
import { publicSettings } from "../modules/younoya-commerce/settings"

export default async function customerCreatedHandler({ event, container }: SubscriberArgs<{ id: string }>) {
  // Events contain an identifier, not a complete customer. Phone-only accounts need no welcome email.
  if (!event.data.id || !process.env.SMTP_HOST || !process.env.SMTP_FROM_EMAIL) return
  const customer = await container.resolve(Modules.CUSTOMER).retrieveCustomer(event.data.id)
  if (!customer.email) return
  const { business } = await publicSettings()
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === "true",
    connectionTimeout: 10000, socketTimeout: 12000,
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } } : {}),
  })
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM_EMAIL, replyTo: business.supportEmail, to: customer.email,
      messageId: `<welcome-${customer.id}@younoya.com>`, subject: "Welcome to Younoya",
      text: `Welcome${customer.first_name ? `, ${customer.first_name}` : ""}.\n\nYour Younoya account is ready. Explore the collection and return to your saved recommendations and orders.\n\nOrders: https://younoya.com/account/orders\nSupport: ${business.supportEmail}\n${business.legalName}`,
    })
  } catch {
    // An uncertain SMTP outcome is not automatically replayed; never log the recipient or provider response.
    container.resolve("logger").warn("Welcome email delivery could not be confirmed.")
  } finally { transporter.close() }
}
export const config: SubscriberConfig = { event: "customer.created" }
