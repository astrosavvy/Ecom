import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { publicSettings } from "../../../../modules/younoya-commerce/settings"

export async function GET(_req: MedusaRequest, res: MedusaResponse) {
  try {
    const config = await publicSettings()
    return res.json({ razorpayKeyId: config.checkoutEnabled ? process.env.RAZORPAY_KEY_ID : null,
      checkoutEnabled: config.checkoutEnabled, policyRevision: config.policyRevision, currency: "INR", country: "IN" })
  } catch { return res.status(503).json({ message: "Checkout configuration is unavailable" }) }
}
