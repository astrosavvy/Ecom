import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { availableOffers, inrPrice, presentOffer } from "../../../../../modules/younoya-astro/offers"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data } = await query.graph({ entity: "product", filters: { handle: req.params.handle, status: ["published"] },
    fields: ["id", "handle", "title", "description", "thumbnail", "metadata", "variants.id",
      "variants.manage_inventory", "variants.allow_backorder", "variants.prices.amount", "variants.prices.currency_code"] })
  const product = data[0]
  if (!product || product.metadata?.recommendation_only !== true || product.metadata?.gift_guide_approved !== true || !inrPrice(product)) {
    return res.status(404).json({ message: "This edition is not available" })
  }
  const channel = (req as any).publishable_key_context?.sales_channel_ids?.[0]
  const available = (await availableOffers(req.scope, [product], channel)).length > 0
  return res.json({ offer: { ...presentOffer(product), description: product.description, available } })
}
