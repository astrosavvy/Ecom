import { ContainerRegistrationKeys, getVariantAvailability, Modules } from "@medusajs/framework/utils"

export async function storefrontSalesChannel(scope: any) {
  const store = scope.resolve(Modules.STORE) as any
  const [current] = await store.listStores({}, { take: 1 })
  if (!current?.default_sales_channel_id) throw new Error("Default storefront sales channel is not configured")
  return current.default_sales_channel_id as string
}

export function inrPrice(product: any): number | null {
  const price = product.variants?.[0]?.prices?.find((entry: any) => entry.currency_code === "inr")
  return Number.isInteger(price?.amount) && price.amount > 0 ? price.amount : null
}

export async function availableOffers(scope: any, products: any[], salesChannelId?: string) {
  const managed = products.flatMap((product) => product.variants?.[0]?.manage_inventory ? [product.variants[0].id] : [])
  let availability: Record<string, { availability: number | null }> = {}
  if (managed.length && salesChannelId) {
    const query = scope.resolve(ContainerRegistrationKeys.QUERY) as any
    availability = await getVariantAvailability(query, { variant_ids: managed, sales_channel_id: salesChannelId })
  }
  return products.filter((product) => {
    const variant = product.variants?.[0]
    if (!variant?.id || !inrPrice(product)) return false
    return !variant.manage_inventory || variant.allow_backorder || (availability[variant.id]?.availability ?? 0) > 0
  })
}

export async function liveProduct(scope: any, id: string, salesChannelId?: string) {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data } = await query.graph({ entity: "product", filters: { id, status: ["published"],
      ...(salesChannelId ? { sales_channels: { id: salesChannelId } } : {}) },
    fields: ["id", "handle", "title", "thumbnail", "metadata", "variants.id", "variants.manage_inventory",
      "variants.allow_backorder", "variants.prices.amount", "variants.prices.currency_code"] })
  const product = data[0]
  if (!product) return null
  const md = product.metadata ?? {}
  if (md.gift_guide_approved === false) return null
  if (md.recommendation_only === true && md.gift_guide_approved !== true) return null
  return (await availableOffers(scope, [product], salesChannelId))[0] ?? null
}

export function presentOffer(product: any) {
  const variant = product.variants[0]
  return { id: product.id, variantId: variant.id, handle: product.handle,
    title: product.title, image: product.thumbnail ?? null, price: inrPrice(product), currency: "inr",
    privateOffer: product.metadata?.recommendation_only === true,
    components: Array.isArray(product.metadata?.gift_guide_components) ? product.metadata.gift_guide_components : [] }
}
