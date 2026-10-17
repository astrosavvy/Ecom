import { ContainerRegistrationKeys, getVariantAvailability } from '@medusajs/framework/utils'
import { CommerceError } from './db'
import { publicSettings, settings } from './settings'
import { storefrontSalesChannel } from '../younoya-astro/offers'

export const RITUAL_PRODUCTS: Record<string,{ sku:string, price:number }> = {
  'navratri-shringaar-box':{ sku:'YN-NAVRATRI-9D-001',price:1499 },
  'diwali-wealth-kalash':{ sku:'YN-DIWALI-KALASH-001',price:5599 },
}
export function ritualReleased(product: any) {
  if (!product || product.status !== 'published') return false
  const metadata = product.metadata || {}
  if (metadata.gift_guide_approved === false) return false
  const ritual = RITUAL_PRODUCTS[product.handle]
  if (!ritual && metadata.product_kind !== 'ritual-box') return true
  if (!ritual) return false
  const approved = metadata.ritual_release_approved === true ||
    (product.handle === 'navratri-shringaar-box' && metadata.navratri_release_approved === true)
  if (!approved) return false
  return product.handle !== 'diwali-wealth-kalash' || (metadata.gst_rate_approved === true &&
    typeof metadata.gst_rate === 'number' && metadata.gst_rate >= 0 && metadata.gst_rate <= 100 && metadata.packaging_approved === true)
}
export async function requireReleasedItems(scope: any, items: any[]) {
  const ids = [...new Set(items.map(item => item.variant_id || item.variant?.id))]
  const { data } = await scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity:'product_variant',
    filters:{ id:ids },fields:['id','product.handle','product.status','product.metadata'] })
  if (!ids.length || ids.some(id => !ritualReleased(data.find((v: any) => v.id === id)?.product)))
    throw new CommerceError('One of these pieces is not available to order yet. Your bag is saved.',409)
}
export async function ritualAvailability(scope: any, handle: string) {
  const spec = RITUAL_PRODUCTS[handle]
  if (!spec) throw new CommerceError('Product not found',404)
  const unavailable = { purchasable:false,availableQuantity:0,price:spec.price,currency:'INR' }
  if (!(await publicSettings()).checkoutEnabled) return unavailable
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const channel = await storefrontSalesChannel(scope)
  const { data } = await query.graph({ entity:'product',filters:{handle,status:'published',sales_channels:{id:channel}},
    fields:['id','handle','status','metadata','variants.id','variants.sku','variants.manage_inventory','variants.allow_backorder','variants.prices.amount','variants.prices.currency_code'] })
  const product = data[0], variant = product?.variants?.[0]
  if (!ritualReleased(product) || !variant?.manage_inventory || variant.allow_backorder || variant.sku !== spec.sku ||
    Number(variant.prices?.find((p: any) => p.currency_code === 'inr')?.amount) !== spec.price) return unavailable
  if (handle === 'diwali-wealth-kalash') {
    const state = (await settings()).draft
    if (!state.variants.some(v => v.id === variant.id && v.hsn === '7116') ||
      !state.parcels.some(p => p.variantIds.includes(variant.id))) return unavailable
  }
  const stock = await getVariantAvailability(query,{variant_ids:[variant.id],sales_channel_id:channel})
  const availableQuantity = Math.max(0,Math.floor(stock[variant.id]?.availability || 0))
  return { ...unavailable,purchasable:availableQuantity > 0,availableQuantity }
}
