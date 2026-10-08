import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { INTENTIONS } from "../../../../modules/younoya-astro/gift-guide"
import matrix from "../../../../modules/younoya-astro/data/matrix.json"
import { storefrontSalesChannel } from "../../../../modules/younoya-astro/offers"

type Component = { variantId: string; quantity: number }
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max)

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: products } = await query.graph({ entity: "product", fields: ["id", "title", "handle", "status", "thumbnail",
    "description", "metadata", "variants.id", "variants.sku", "variants.prices.amount", "variants.prices.currency_code",
    ], pagination: { take: 250 } })
  const variantIds = products.flatMap((product: any) => product.variants?.map((variant: any) => variant.id) || [])
  const links = variantIds.length ? (await query.graph({ entity: "product_variant_inventory_items", filters: { variant_id: variantIds },
    fields: ["variant_id", "inventory_item_id", "required_quantity"] })).data : []
  return res.json({ products: products.map((product: any) => ({
    id: product.id, title: product.title, handle: product.handle, status: product.status,
    thumbnail: product.thumbnail, metadata: product.metadata,
    variant: product.variants?.[0] ? { id: product.variants[0].id, sku: product.variants[0].sku,
      price: product.variants[0].prices?.find((price: any) => price.currency_code === "inr")?.amount ?? null,
      inventoryItems: links.filter((link: any) => link.variant_id === product.variants[0].id) } : null,
  })) })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as Record<string, unknown>
  const title = clean(body.title, 100)
  const handle = clean(body.handle, 100).toLowerCase()
  const sku = clean(body.sku, 60).toUpperCase()
  const description = clean(body.description, 1200)
  const thumbnail = clean(body.thumbnail, 500)
  const price = Number(body.price)
  const intentions = Array.isArray(body.intentions) ? body.intentions.filter((value) => INTENTIONS.includes(value)) : []
  const keys = Array.isArray(body.matrixKeys) ? body.matrixKeys.filter((value) => typeof value === "string" && value in matrix) : []
  const components = Array.isArray(body.components) ? body.components as Component[] : []
  if (!title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle) || !sku || !description ||
      !/^https:\/\//.test(thumbnail) || !Number.isInteger(price) || price < 100 || !intentions.length ||
      components.length > 8 || components.some((item) => !item?.variantId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
    return res.status(400).json({ message: "Complete the title, handle, SKU, description, image, INR price and at least one intention." })
  }
  const service = req.scope.resolve(Modules.PRODUCT) as any
  if ((await service.listProducts({ handle }, { take: 1 })).length) return res.status(409).json({ message: "That handle already exists." })
  const salesChannelId = await storefrontSalesChannel(req.scope)
  const kit = new Map<string, number>()
  const contents: Array<{ title: string; quantity: number }> = []
  if (components.length) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
    for (const part of components) {
      const { data } = await query.graph({ entity: "variant", filters: { id: part.variantId },
        fields: ["id", "product.title", "manage_inventory"] })
      const variant = data[0]
      const links = variant ? (await query.graph({ entity: "product_variant_inventory_items", filters: { variant_id: variant.id },
        fields: ["inventory_item_id", "required_quantity"] })).data : []
      if (!variant?.manage_inventory || !links.length) return res.status(400).json({ message: "Each bundle component must be an inventory-managed variant." })
      contents.push({ title: variant.product?.title ?? "Included piece", quantity: part.quantity })
      for (const link of links) {
        const amount = Number(link.required_quantity || 1) * part.quantity
        kit.set(link.inventory_item_id, (kit.get(link.inventory_item_id) || 0) + amount)
      }
    }
  }
  const { result } = await createProductsWorkflow(req.scope).run({ input: { products: [{
    title, handle, description, thumbnail, images: [{ url: thumbnail }], status: ProductStatus.PUBLISHED,
    sales_channels: [{ id: salesChannelId }],
    metadata: { money_unit: "inr-major-v2", recommendation_only: true, gift_guide_approved: body.approved === true,
      gift_guide_intentions: intentions, gift_guide_matrix_keys: keys, gift_guide_components: contents,
      gift_guide_component_variants: components },
    options: [{ title: "Edition", values: ["Standard"] }],
    variants: [{ title: "Standard", sku, manage_inventory: true, allow_backorder: false,
      options: { Edition: "Standard" }, prices: [{ amount: price, currency_code: "inr" }],
      ...(kit.size ? { inventory_items: [...kit].map(([inventory_item_id, required_quantity]) => ({ inventory_item_id, required_quantity })) } : {}) }],
  }] } })
  return res.status(201).json({ id: result[0].id, message: "Offer created. It appears in results only when approved and in stock." })
}
