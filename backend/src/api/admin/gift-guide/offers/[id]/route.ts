import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createLinksWorkflow, dismissLinksWorkflow, updateLinksWorkflow,
  updateProductsWorkflow, updateProductVariantsWorkflow } from "@medusajs/medusa/core-flows"
import { INTENTIONS } from "../../../../../modules/younoya-astro/gift-guide"
import matrix from "../../../../../modules/younoya-astro/data/matrix.json"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body ?? {}) as Record<string, any>
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data } = await query.graph({ entity: "product", filters: { id: req.params.id },
    fields: ["id", "title", "handle", "metadata", "variants.id"] })
  const product = data[0]
  if (!product || product.metadata?.recommendation_only !== true) return res.status(404).json({ message: "Private offer not found" })
  const variant = product.variants?.[0]
  const title = String(body.title ?? "").trim().slice(0, 100)
  const description = String(body.description ?? "").trim().slice(0, 1200)
  const thumbnail = String(body.thumbnail ?? "").trim().slice(0, 500)
  const price = Number(body.price)
  const intentions = Array.isArray(body.intentions) ? body.intentions.filter((value: any) => INTENTIONS.includes(value)) : []
  const keys = Array.isArray(body.matrixKeys) ? body.matrixKeys.filter((value: any) => typeof value === "string" && value in matrix) : []
  const components = Array.isArray(body.components) ? body.components : []
  if (!variant || !title || !description || !/^https:\/\//.test(thumbnail) || !Number.isInteger(price) || price < 100 ||
      !intentions.length || components.length > 8 || components.some((item: any) => !item.variantId || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
    return res.status(400).json({ message: "Complete the offer details, image, price, intentions and valid components." })
  }
  if (product.metadata?.gift_guide_component_variants?.length && !components.length) {
    return res.status(400).json({ message: "A set needs at least one component. Create a separate single-piece offer instead." })
  }
  const kit = new Map<string, number>()
  const contents: Array<{ title: string; quantity: number }> = []
  for (const part of components) {
    if (part.variantId === variant.id) return res.status(400).json({ message: "A set cannot contain itself." })
    const { data } = await query.graph({ entity: "variant", filters: { id: part.variantId },
      fields: ["id", "product.title", "manage_inventory"] })
    const component = data[0]
    const links = component ? (await query.graph({ entity: "product_variant_inventory_items", filters: { variant_id: component.id },
      fields: ["inventory_item_id", "required_quantity"] })).data : []
    if (!component?.manage_inventory || !links.length) return res.status(400).json({ message: "Each component needs tracked inventory." })
    contents.push({ title: component.product?.title ?? "Included piece", quantity: part.quantity })
    for (const link of links) {
      const id = link.inventory_item_id
      kit.set(id, (kit.get(id) || 0) + Number(link.required_quantity || 1) * part.quantity)
    }
  }
  const { data: previousLinks } = await query.graph({ entity: "product_variant_inventory_items", filters: { variant_id: variant.id },
    fields: ["inventory_item_id", "required_quantity"] })
  const old = new Map(previousLinks.map((item: any) => [item.inventory_item_id, item.required_quantity]))
  const link = (inventory_item_id: string, required_quantity?: number) => ({
    [Modules.PRODUCT]: { variant_id: variant.id }, [Modules.INVENTORY]: { inventory_item_id },
    ...(required_quantity ? { data: { required_quantity } } : {}),
  })
  for (const [id, quantity] of kit) {
    if (!old.has(id)) await createLinksWorkflow(req.scope).run({ input: [link(id, quantity)] })
    else if (old.get(id) !== quantity) await updateLinksWorkflow(req.scope).run({ input: [link(id, quantity)] })
  }
  for (const id of old.keys()) if (!kit.has(String(id))) {
    await dismissLinksWorkflow(req.scope).run({ input: [link(String(id))] })
  }
  await updateProductsWorkflow(req.scope).run({ input: { products: [{ id: product.id,
    title, description, thumbnail, images: [{ url: thumbnail }], metadata: { ...product.metadata,
      gift_guide_approved: body.approved === true, gift_guide_intentions: intentions,
      gift_guide_matrix_keys: keys, gift_guide_components: contents,
      gift_guide_component_variants: components } }] } })
  await updateProductVariantsWorkflow(req.scope).run({ input: { product_variants: [{ id: variant.id,
    manage_inventory: true, allow_backorder: false, prices: [{ amount: price * 100, currency_code: "inr" }] }] } })
  return res.json({ id: product.id, message: "Offer updated. Recommendation availability follows the component stock." })
}
