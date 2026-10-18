import { Modules, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow, updateProductsWorkflow, createInventoryLevelsWorkflow } from '@medusajs/medusa/core-flows'
import { CommerceError, exclusive } from './db'
import { settings } from './settings'

export const KALASH = { handle:'diwali-wealth-kalash',sku:'YN-DIWALI-KALASH-001',price:5599,initialStock:50 }
export const KALASH_GALLERY = ['hero','detail','ritual','single-woman','two-women','boxed-set']
export const KALASH_PACKAGING = ['YOUNOYA gift box','Red potli labelled "11 sacred pooja samagri"','Envelope with pooja vidhi, Pooja mahurat and Pooja mantra']
export async function initializeKalashStock(scope: any, product: any, locationId: string) {
  const inventory = scope.resolve(Modules.INVENTORY)
  const items = await inventory.listInventoryItems({sku:KALASH.sku})
  if (items.length !== 1) throw new CommerceError('Kalash needs one linked inventory item; review the import before continuing.')
  const levels = await inventory.listInventoryLevels({inventory_item_id:items[0].id})
  if (levels.length) return 'preserved'
  if (product.metadata?.kalash_stock_initialized) throw new CommerceError('Initialized Kalash inventory is missing; do not reset stock.')
  await createInventoryLevelsWorkflow(scope).run({input:{inventory_levels:[{
    inventory_item_id:items[0].id,location_id:locationId,stocked_quantity:KALASH.initialStock,
  }]}})
  return 'initialized'
}
export async function prepareKalash(scope: any) {
  return exclusive('catalog:diwali-wealth-kalash',async () => {
    const state = (await settings()).draft
    if (state.catalogMoneyVersion !== 'inr-major-v2' || !state.stockLocationId || !state.salesChannelId)
      throw new CommerceError('Configure the existing INR catalogue, stock location and storefront sales channel first.')
    const products = scope.resolve(Modules.PRODUCT)
    let [product] = await products.listProducts({handle:KALASH.handle},{relations:['variants']})
    const origin = (process.env.STOREFRONT_URL || 'https://younoya.com').replace(/\/$/,'')
    if (product && (product.metadata?.catalog_source !== 'younoya-kalash-2026' || product.variants?.length !== 1 || product.variants[0].sku !== KALASH.sku))
      throw new CommerceError('An unrelated catalogue record uses the Kalash identity. Review before changing it.')
    const metadata = {...product?.metadata,catalog_source:'younoya-kalash-2026',product_kind:'ritual-box',money_unit:'inr-major-v2',hsn:'7116',
      hsn_approved:true,price_includes_gst:true,ritual_release_approved:product?.metadata?.ritual_release_approved === true,
      gst_rate:product?.metadata?.gst_rate ?? null,gst_rate_approved:product?.metadata?.gst_rate_approved === true,
      packaging_approved:product?.metadata?.packaging_approved === true,
      contents:['Gomti chakra','Kamal gatta','Kaudiyan','Rose quartz crystals','Citrine crystals','Coins'],included_packaging:KALASH_PACKAGING}
    const content = {title:'YOUNOYA Diwali Wealth Kalash',handle:KALASH.handle,subtitle:'A considered ritual for prosperity',
      description:'A textured Kalash with Gomti chakra, kamal gatta, kaudiyan, rose quartz crystals, citrine crystals and coins, for meaningful Diwali rituals and devotional gifting. Includes the YOUNOYA gift box, a red potli labelled "11 sacred pooja samagri", and an envelope containing pooja vidhi, Pooja mahurat and Pooja mantra.',
      thumbnail:`${origin}/media/kalash/hero-600.webp`,
      images:KALASH_GALLERY.map(id => ({url:`${origin}/media/kalash/${id}-1200.webp`})),metadata}
    if (!product) {
      const {result} = await createProductsWorkflow(scope).run({input:{products:[{...content,status:ProductStatus.DRAFT,
        sales_channels:[{id:state.salesChannelId}],options:[{title:'Edition',values:['Standard']}],
        variants:[{title:'Standard',sku:KALASH.sku,hs_code:'7116',manage_inventory:true,allow_backorder:false,
          options:{Edition:'Standard'},prices:[{amount:KALASH.price,currency_code:'inr'}]}]}]}})
      product = result[0]
    } else await updateProductsWorkflow(scope).run({input:{products:[{id:product.id,...content}]}})
    const inventory = await initializeKalashStock(scope,product,state.stockLocationId)
    await products.updateProducts(product.id,{metadata:{...metadata,kalash_stock_initialized:true}})
    return {productId:product.id,inventory,price:KALASH.price,purchaseApproved:metadata.ritual_release_approved}
  })
}
