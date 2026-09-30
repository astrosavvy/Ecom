import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import brooches from "../../../../modules/younoya-astro/data/brooches.json"
import { storefrontSalesChannel } from "../../../../modules/younoya-astro/offers"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const products = req.scope.resolve(Modules.PRODUCT) as any
  const origin = process.env.STOREFRONT_URL || "https://younoya.com"
  const salesChannelId = await storefrontSalesChannel(req.scope)
  const created: string[] = []
  for (const piece of brooches) {
    const existing = await products.listProducts({ handle: piece.handle }, { take: 1 })
    if (existing.length) continue
    const { result } = await createProductsWorkflow(req.scope).run({ input: { products: [{
      title: piece.title, handle: piece.handle, subtitle: piece.subtitle,
      description: piece.description, status: ProductStatus.PUBLISHED,
      thumbnail: `${origin}${piece.thumbnail}`,
      images: piece.images.map((url) => ({ url: `${origin}${url}` })),
      metadata: { gift_guide_intentions: [piece.intention], gift_guide_approved: true,
        catalog_source: "younoya-brooch-2026", element: piece.element },
      sales_channels: [{ id: salesChannelId }],
      options: [{ title: "Edition", values: ["Standard"] }],
      variants: [{ title: "Standard", sku: `YN-${piece.handle.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
        manage_inventory: true, allow_backorder: false, options: { Edition: "Standard" },
        prices: [{ amount: piece.price * 100, currency_code: "inr" }] }],
    }] } })
    created.push(result[0].id)
  }
  return res.json({ created, count: created.length,
    message: "Imported pieces require stock at an active location before they can be recommended or ordered." })
}
