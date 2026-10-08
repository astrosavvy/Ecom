import { ContainerRegistrationKeys, getVariantAvailability } from '@medusajs/framework/utils'
import { commerceRoute } from '../../utils/commerce'
import { publicSettings } from '../../../modules/younoya-commerce/settings'
import { storefrontSalesChannel } from '../../../modules/younoya-astro/offers'
export const GET = commerceRoute(async req => {
  const config = await publicSettings()
  const unavailable = { purchasable: false, availableQuantity: 0, price: 1499, currency: 'INR' }
  if (!config.checkoutEnabled) return unavailable
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const salesChannel = await storefrontSalesChannel(req.scope)
  const { data } = await query.graph({ entity:'product',filters:{ handle:'navratri-shringaar-box',status:'published',sales_channels:{id:salesChannel} },
    fields:['id','metadata','variants.id','variants.sku','variants.manage_inventory','variants.allow_backorder','variants.prices.amount','variants.prices.currency_code'] })
  const product = data[0], variant = product?.variants?.[0]
  if (product?.metadata?.navratri_release_approved !== true || !variant?.manage_inventory || variant.allow_backorder || variant.sku !== 'YN-NAVRATRI-9D-001' ||
      Number(variant.prices?.find((p: any) => p.currency_code === 'inr')?.amount) !== 1499) return unavailable
  const stock = await getVariantAvailability(query,{variant_ids:[variant.id],sales_channel_id:salesChannel})
  const availableQuantity = Math.max(0,Math.floor(stock[variant.id]?.availability || 0))
  return { ...unavailable,purchasable:availableQuantity > 0,availableQuantity }
})
