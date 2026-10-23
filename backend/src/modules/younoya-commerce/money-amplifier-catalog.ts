import { Modules, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow, updateProductsWorkflow, createInventoryLevelsWorkflow } from '@medusajs/medusa/core-flows'
import { CommerceError, exclusive, transaction } from './db'
import { settings, settingsSchema, defaults } from './settings'

export const MONEY_AMPLIFIER = {
  handle: 'money-amplifier-protector-set',
  sku: 'YN-MONEY-AMPLIFIER-001',
  price: 7799,
  initialStock: 50
}

export const MONEY_AMPLIFIER_PARCEL = {
  name: 'Younoya Money Amplifier single set',
  maxUnits: 1,
  tareKg: 0,
  maxWeightKg: 0.70,
  lengthCm: 12.7,
  widthCm: 18.29,
  heightCm: 8.89
}

export async function initializeMoneyAmplifierStock(scope: any, product: any, locationId: string) {
  const inventory = scope.resolve(Modules.INVENTORY)
  const items = await inventory.listInventoryItems({ sku: MONEY_AMPLIFIER.sku })
  if (items.length !== 1) throw new CommerceError('Money Amplifier needs one linked inventory item; review the import before continuing.')
  const levels = await inventory.listInventoryLevels({ inventory_item_id: items[0].id })
  if (levels.length) return 'preserved'
  if (product.metadata?.money_amplifier_stock_initialized) throw new CommerceError('Initialized Money Amplifier inventory is missing; do not reset stock.')
  await createInventoryLevelsWorkflow(scope).run({
    input: {
      inventory_levels: [{
        inventory_item_id: items[0].id,
        location_id: locationId,
        stocked_quantity: MONEY_AMPLIFIER.initialStock,
      }]
    }
  })
  return 'initialized'
}

export async function prepareMoneyAmplifier(scope: any) {
  return exclusive('catalog:money-amplifier-protector-set', async () => {
    const state = (await settings()).draft
    if (state.catalogMoneyVersion !== 'inr-major-v2' || !state.stockLocationId || !state.salesChannelId) {
      throw new CommerceError('Configure the existing INR catalogue, stock location and storefront sales channel first.')
    }
    const products = scope.resolve(Modules.PRODUCT)
    let [product] = await products.listProducts({ handle: MONEY_AMPLIFIER.handle }, { relations: ['variants'] })
    const origin = (process.env.STOREFRONT_URL || 'https://younoya.com').replace(/\/$/, '')
    if (product && (product.metadata?.catalog_source !== 'younoya-money-amplifier-2026' || product.variants?.length !== 1 || product.variants[0].sku !== MONEY_AMPLIFIER.sku)) {
      throw new CommerceError('An unrelated catalogue record uses the Money Amplifier identity. Review before changing it.')
    }

    const metadata = {
      ...product?.metadata,
      catalog_source: 'younoya-money-amplifier-2026',
      product_kind: 'ritual-box',
      money_unit: 'inr-major-v2',
      hsn: '7116',
      hsn_approved: true,
      price_includes_gst: true,
      ritual_release_approved: true,
      gst_rate: 0,
      gst_rate_approved: true,
      packaging_approved: true,
      weight_grams: 400,
      weight_with_box_grams: 700,
      dimensions_inches: '5 x 7.2 x 3.5',
      care_instruction: 'Delicate item handle with care'
    }

    const content = {
      title: 'YOUNOYA Money Amplifier & Protector Set',
      handle: MONEY_AMPLIFIER.handle,
      subtitle: 'Curated crystal Kurma & Hamsa Evil Eye talisman',
      description: 'Whether you lack opportunities to earn money or face difficulties in saving and sustaining the money, this 2-in-1 combination curated by YOUNOYA has a unique combination of crystals that not only helps you earn more but also amplify and protect your wealth from evil nazar. Includes iridescent crystal Kurma, blue marbled Hamsa plate, sacred guidance, and velvet resting cushioning.',
      thumbnail: `${origin}/media/money-amplifier/hero-600.webp`,
      images: [
        { url: `${origin}/media/money-amplifier/hero-1200.webp` },
        { url: `${origin}/media/money-amplifier/altar-1200.webp` }
      ],
      metadata
    }

    if (!product) {
      const { result } = await createProductsWorkflow(scope).run({
        input: {
          products: [{
            ...content,
            status: ProductStatus.PUBLISHED,
            sales_channels: [{ id: state.salesChannelId }],
            options: [{ title: 'Edition', values: ['Standard'] }],
            variants: [{
              title: 'Standard',
              sku: MONEY_AMPLIFIER.sku,
              hs_code: '7116',
              manage_inventory: true,
              allow_backorder: false,
              options: { Edition: 'Standard' },
              prices: [{ amount: MONEY_AMPLIFIER.price, currency_code: 'inr' }]
            }]
          }]
        }
      })
      product = result[0]
    } else {
      await updateProductsWorkflow(scope).run({
        input: {
          products: [{
            id: product.id,
            status: ProductStatus.PUBLISHED,
            ...content
          }]
        }
      })
    }

    const inventory = await initializeMoneyAmplifierStock(scope, product, state.stockLocationId)
    await products.updateProducts(product.id, { metadata: { ...metadata, money_amplifier_stock_initialized: true } })

    // Register parcel in launch settings
    const variantId = product.variants?.[0]?.id
    if (variantId) {
      await transaction('commerce:settings', async client => {
        const row = (await client.query("select data from commerce_setting where id='launch' for update")).rows[0]
        if (row?.data) {
          const current = { ...defaults, ...row.data }
          const configured = settingsSchema.parse({
            ...current,
            variants: [...current.variants.filter((v: any) => v.id !== variantId), { id: variantId, packedUnitKg: 0.70, hsn: '7116' }],
            parcels: [...current.parcels.filter((p: any) => p.name !== MONEY_AMPLIFIER_PARCEL.name), { ...MONEY_AMPLIFIER_PARCEL, variantIds: [variantId] }]
          })
          await client.query("update commerce_setting set data=$1,updated_at=now() where id='launch'", [JSON.stringify(configured)])
        }
      })
    }

    return {
      productId: product.id,
      inventory,
      price: MONEY_AMPLIFIER.price,
      purchaseApproved: true
    }
  })
}
