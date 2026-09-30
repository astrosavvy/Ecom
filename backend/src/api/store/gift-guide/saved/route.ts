import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../../utils/auth"
import { YOUNOYA_TOOLKITS_MODULE } from "../../../../modules/younoya-toolkits"
import { verifyRecommendation } from "../../../../modules/younoya-astro/gift-guide-token"
import { liveProduct, presentOffer } from "../../../../modules/younoya-astro/offers"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Sign in to see saved recommendations" })
  const service = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const toolkits = await service.listToolkits({ customer_id: customerId, type: "gift-guide" }, { order: { created_at: "DESC" } })
  return res.json({ saved: toolkits })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Sign in to save this recommendation" })
  try {
    const snapshot = verifyRecommendation((req.body as any)?.token)
    const channel = (req as any).publishable_key_context?.sales_channel_ids?.[0]
    const offers = (await Promise.all(snapshot.offerIds.map((id) => liveProduct(req.scope, id, channel))))
      .filter(Boolean).map(presentOffer)
    if (!offers.length) return res.status(409).json({ message: "These pieces are currently unavailable. Please begin again." })
    const service = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
    const toolkit = await service.createToolkits({
      customer_id: customerId, type: "gift-guide", status: "generated",
      recipient_name: snapshot.name, recipient_relationship: snapshot.relation,
      occasion: snapshot.moment, intents: [snapshot.intention], personalised_explanation: snapshot.explanation,
      astro_snapshot: { method: snapshot.method, guide: snapshot.guide, setTitle: snapshot.setTitle,
        prices: snapshot.prices },
    })
    for (const [index, offer] of offers.entries()) {
      await service.createToolkitItems({ toolkit_id: toolkit.id, product_id: offer.id,
        product_handle: offer.handle, product_title: offer.title, role: index ? "supporting" : "main",
        display_order: index, score: 0 })
    }
    return res.status(201).json({ id: toolkit.id, offers })
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Could not save recommendation" })
  }
}
