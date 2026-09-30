import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../../../utils/auth"
import { YOUNOYA_TOOLKITS_MODULE } from "../../../../../modules/younoya-toolkits"
import { liveProduct, presentOffer } from "../../../../../modules/younoya-astro/offers"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Sign in to open saved recommendations" })
  const service = req.scope.resolve(YOUNOYA_TOOLKITS_MODULE) as any
  const [saved] = await service.listToolkits({ id: req.params.id, customer_id: customerId, type: "gift-guide" })
  if (!saved) return res.status(404).json({ message: "Recommendation not found" })
  const items = await service.listToolkitItems({ toolkit_id: saved.id }, { order: { display_order: "ASC" } })
  const offers: any[] = []
  const channel = (req as any).publishable_key_context?.sales_channel_ids?.[0]
  for (const item of items) {
    const product = await liveProduct(req.scope, item.product_id, channel)
    if (product) offers.push(presentOffer(product))
  }
  const prices = saved.astro_snapshot?.prices ?? {}
  return res.json({ saved, offers, changed: offers.length !== items.length ||
    offers.some((offer) => prices[offer.id] !== offer.price) })
}
