import { Modules, ProductStatus, ContainerRegistrationKeys, getVariantAvailability } from '@medusajs/framework/utils'
import { CommerceError, exclusive, transaction } from './db'
import { defaults, settings, settingsSchema, requireLive } from './settings'
import { KALASH, prepareKalash } from './kalash-catalog'

export const KALASH_PARCEL = { name:'Younoya Kalash single gift set',maxUnits:1,tareKg:0,maxWeightKg:2.5,
  lengthCm:35.56,widthCm:35.56,heightCm:12.7 }
export const KALASH_TAX_CODE = 'YOUNOYA-KALASH-0'

export function withKalashParcel(input: any, variantId: string) {
  const parcel = input.parcels.find((p: any) => p.name === KALASH_PARCEL.name)
  if (parcel && (parcel.variantIds.length !== 1 || parcel.variantIds[0] !== variantId))
    throw new CommerceError('The Kalash parcel name belongs to another selection; review it before release.')
  return settingsSchema.parse({ ...input,
    variants:[...input.variants.filter((v: any) => v.id !== variantId),{id:variantId,packedUnitKg:2.5,hsn:'7116'}],
    parcels:[...input.parcels.filter((p: any) => p.name !== KALASH_PARCEL.name),{...KALASH_PARCEL,variantIds:[variantId]}],
  })
}

export async function ensureKalashTax(scope: any, productId: string) {
  const tax = scope.resolve(Modules.TAX)
  const regions = await tax.listTaxRegions({country_code:'in'})
  if (!regions.some((r: any) => !r.parent_id)) throw new CommerceError('The existing India tax region is required.')
  const ownRates = await tax.listTaxRates({code:KALASH_TAX_CODE},{relations:['rules']})
  if (ownRates.some((rate: any) => (rate.rules || []).some((r: any) => r.reference !== 'product' || r.reference_id !== productId)))
    throw new CommerceError('The Kalash tax code affects another selection; review before changing it.')
  const ownIds = new Set(ownRates.map((r: any) => r.id))
  const rules = await tax.listTaxRateRules({reference:'product',reference_id:productId})
  if (rules.some((r: any) => !ownIds.has(r.tax_rate_id)))
    throw new CommerceError('An existing Kalash tax override needs review before release.')
  for (const region of regions) {
    const matches = ownRates.filter((r: any) => r.tax_region_id === region.id)
    if (matches.length > 1) throw new CommerceError('Duplicate Kalash tax rates need review.')
    const data = {name:'Kalash owner-confirmed zero rate',code:KALASH_TAX_CODE,rate:0,is_default:false,is_combinable:false}
    if (matches[0]) {
      if (!(matches[0].rules || []).some((r: any) => r.reference === 'product' && r.reference_id === productId))
        throw new CommerceError('The Kalash tax rate is missing its product restriction.')
      await tax.updateTaxRates(matches[0].id,data)
    } else await tax.createTaxRates({...data,tax_region_id:region.id,rules:[{reference:'product',reference_id:productId}]})
  }
}

// This explicit owner-approved release is separate from the inventory-preserving import.
export async function releaseKalash(scope: any) {
  await prepareKalash(scope)
  return exclusive('catalog:diwali-wealth-kalash',async () => {
    await requireLive()
    const products = scope.resolve(Modules.PRODUCT)
    const [product] = await products.listProducts({handle:KALASH.handle},{relations:['variants']})
    const state = (await settings()).draft
    const variant = product?.variants?.[0]
    if (product?.metadata?.catalog_source !== 'younoya-kalash-2026' || product.variants.length !== 1 ||
      variant?.sku !== KALASH.sku || !variant.manage_inventory || variant.allow_backorder)
      throw new CommerceError('Kalash identity, inventory management or sales-channel linkage needs review.')
    const query = scope.resolve(ContainerRegistrationKeys.QUERY)
    const {data} = await query.graph({entity:'product',filters:{id:product.id},fields:['id','sales_channels.id','variants.id','variants.prices.amount','variants.prices.currency_code']})
    if (!data[0]?.sales_channels?.some((s: any) => s.id === state.salesChannelId))
      throw new CommerceError('Kalash is not linked to the storefront sales channel.')
    if (Number(data[0]?.variants?.find((v: any) => v.id === variant.id)?.prices?.find((p: any) => p.currency_code === 'inr')?.amount) !== KALASH.price)
      throw new CommerceError('Kalash must retain its confirmed 5599 INR price.')
    const stock = await getVariantAvailability(query,{variant_ids:[variant.id],sales_channel_id:state.salesChannelId})
    const availableQuantity = Number(stock[variant.id]?.availability ?? 0)
    if (!Number.isFinite(availableQuantity) || availableQuantity <= 0)
      throw new CommerceError('Kalash has no available inventory; release does not restock it.')
    await products.updateProducts(product.id,{metadata:{...product.metadata,ritual_release_approved:false}})
    await ensureKalashTax(scope,product.id)
    const taxLines = await scope.resolve(Modules.TAX).getTaxLines([
      {id:'kalash-release-check',product_id:product.id,unit_price:KALASH.price,quantity:1},
    ],{address:{country_code:'in'}})
    if (!taxLines.length || taxLines.some((line: any) => Number(line.rate) !== 0) ||
      !taxLines.some((line: any) => line.code === KALASH_TAX_CODE))
      throw new CommerceError('Kalash tax calculation did not resolve to the approved zero rate.')
    await transaction('commerce:settings',async client => {
      const row = (await client.query("select data from commerce_setting where id='launch' for update")).rows[0]
      if (!row) throw new CommerceError('Launch settings are missing.')
      const configured = withKalashParcel({...defaults,...row.data},variant.id)
      await client.query("update commerce_setting set data=$1,updated_at=now() where id='launch'",[JSON.stringify(configured)])
    })
    await products.updateProductVariants(variant.id,{hs_code:'7116'})
    await requireLive()
    await products.updateProducts(product.id,{status:ProductStatus.PUBLISHED,metadata:{...product.metadata,
      gst_rate:0,gst_rate_approved:true,packaging_approved:true,ritual_release_approved:true,
      gst_approval_source:'Owner confirmation, 2026-10-18',packaging_approval_source:'Owner confirmation, 2026-10-18',
      packed_weight_kg:2.5,packed_dimensions_cm:{length:35.56,width:35.56,height:12.7}}})
    return {productId:product.id,variantId:variant.id,status:'published',price:KALASH.price,gstRate:0,
      availableQuantity,parcel:{...KALASH_PARCEL,weightKg:2.5}}
  })
}
