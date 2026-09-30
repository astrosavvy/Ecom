import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  return res.json({ razorpayKeyId: process.env.RAZORPAY_KEY_ID || null, currency: "INR", country: "IN" })
}
