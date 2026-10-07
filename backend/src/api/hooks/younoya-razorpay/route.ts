import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"
import { verifyWebhook } from "../../../modules/younoya-commerce/razorpay"
import { enqueue } from "../../../modules/younoya-commerce/db"
export async function POST(req: MedusaRequest<any>, res: MedusaResponse) {
  const raw = (req as any).rawBody
  if (!verifyWebhook(raw,String(req.headers["x-razorpay-signature"] || ""))) return res.status(401).json({ message: "Invalid webhook signature" })
  const event = req.body
  const payment = event.payload?.payment?.entity
  if (!/^pay_[a-zA-Z0-9]+$/.test(payment?.id || "") || !["payment.captured","payment.authorized","payment.failed"].includes(event.event)) return res.json({ received: true })
  try {
    const key = crypto.createHash("sha256").update(raw).digest("hex")
    await enqueue("payment_event",`webhook:${key}`,{ paymentId: payment.id,event:event.event,payloadHash:key,
      providerEventId:String(req.headers["x-razorpay-event-id"] || "").slice(0,150),receivedAt:new Date().toISOString() },`gateway:${payment.order_id}`)
    return res.json({ received: true })
  } catch { return res.status(503).json({ message: "Webhook storage unavailable; retry delivery" }) }
}
