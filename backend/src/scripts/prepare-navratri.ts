import { ExecArgs, IPricingModuleService, ITaxModuleService } from '@medusajs/framework/types'
import { Modules, ProductStatus } from '@medusajs/framework/utils'
import { createProductsWorkflow, updateProductsWorkflow, createRegionsWorkflow, createTaxRegionsWorkflow } from '@medusajs/medusa/core-flows'
import { database, closeDatabase, CommerceError } from '../modules/younoya-commerce/db'
import { settings } from '../modules/younoya-commerce/settings'
import { storefrontSalesChannel } from '../modules/younoya-astro/offers'
import specification from '../modules/younoya-commerce/navratri.json'

export default async function prepare({container}: ExecArgs) {
  const logger = container.resolve('logger')
  try {
    if(process.env.COMMERCE_LIVE_ENABLED === 'true') throw new CommerceError('Keep checkout disabled while preparing the catalogue')
    const state=await settings()
    if(state.draft.catalogMoneyVersion !== 'inr-major-v2') throw new CommerceError('Run the reviewed money migration first')
    const productModule=container.resolve(Modules.PRODUCT) as any
    const pricing=container.resolve(Modules.PRICING) as IPricingModuleService
    const tax=container.resolve(Modules.TAX) as ITaxModuleService
    const regions=await (container.resolve(Modules.REGION) as any).listRegions({}, {relations:['countries']})
    const india=regions.filter((r:any)=>r.currency_code==='inr' && r.countries?.some((c:any)=>c.iso_2==='in'))
    if(!india.length){
      if(regions.some((r:any)=>r.countries?.some((c:any)=>c.iso_2==='in')))throw new CommerceError('India belongs to a non-INR region; owner review required')
      const {result}=await createRegionsWorkflow(container).run({input:{regions:[{name:'India',currency_code:'inr',countries:['in'],payment_providers:['pp_system_default']}]}})
      india.push(...result)
    }
    const source=specification.product
    let [product]=await productModule.listProducts({handle:source.handle},{relations:['variants']})
    if(product && (product.metadata?.catalog_source !== 'younoya-navratri-2026' || product.variants?.[0]?.sku !== source.sku))
      throw new CommerceError('Existing Navratri record is not owned by this import; review before changing')
    const origin=process.env.STOREFRONT_URL || 'https://younoya.com'
    const metadata={...product?.metadata,catalog_source:'younoya-navratri-2026',product_kind:'ritual-box',money_unit:'inr-major-v2',
      navratri_days:specification.days, gst_rate:18, price_includes_gst:true,navratri_release_approved:product?.metadata?.navratri_release_approved === true}
    const content={title:source.name,handle:source.handle,subtitle:source.subtitle,description:source.intentionStory,
      thumbnail:origin+source.cardImage,images:source.galleryImages.map(url=>({url:origin+url})),metadata}
    if(!product) {
      const {result}=await createProductsWorkflow(container).run({input:{products:[{...content,status:ProductStatus.DRAFT,
        sales_channels:[{id:await storefrontSalesChannel(container)}],options:[{title:'Edition',values:['Standard']}],
        variants:[{title:'Standard',sku:source.sku,manage_inventory:true,allow_backorder:false,options:{Edition:'Standard'},prices:[{amount:1499,currency_code:'inr'}]}]}]}})
      product=result[0]
    } else await updateProductsWorkflow(container).run({input:{products:[{id:product.id,...content}]}})
    // Currency preference applies to prices without a region rule. Preserve the old brooch tax basis
    // using region-specific prices before enabling inclusive pricing for the new base price.
    const before=await pricing.listPricePreferences({})
    const currency=before.find((p:any)=>p.attribute==='currency_code' && p.value==='inr')
    const sets=(await database().query(`select distinct l.price_set_id from product pr join product_variant v on v.product_id=pr.id and v.deleted_at is null
      join product_variant_price_set l on l.variant_id=v.id and l.deleted_at is null where pr.deleted_at is null and pr.id<>$1`,[product.id])).rows
    for(const region of india) {
      const preference=before.find((p:any)=>p.attribute==='region_id' && p.value===region.id)
      const calculations=await pricing.calculatePrices({id:sets.map((s:any)=>s.price_set_id)},{context:{currency_code:'inr',region_id:region.id}})
      const desired=preference?.is_tax_inclusive ?? currency?.is_tax_inclusive ?? false
      for(const calculated of calculations) {
        if(calculated.calculated_amount == null) throw new CommerceError('Every existing INR product needs a valid price')
        if(calculated.is_calculated_price_tax_inclusive !== desired) throw new CommerceError('Mixed existing tax bases require owner review')
        const existing=await pricing.listPrices({price_set_id:[calculated.id],currency_code:'inr'},{relations:['price_rules']})
        const regional=existing.find((p:any)=>p.price_rules?.some((r:any)=>r.attribute==='region_id' && r.value===region.id))
        if(!regional) await pricing.addPrices({priceSetId:calculated.id,prices:[{currency_code:'inr',amount:calculated.calculated_amount,rules:{region_id:region.id}}]})
      }
      if(!preference) await pricing.createPricePreferences({attribute:'region_id',value:region.id,is_tax_inclusive:desired})
    }
    if(currency) await pricing.updatePricePreferences(currency.id,{is_tax_inclusive:true})
    else await pricing.createPricePreferences({attribute:'currency_code',value:'inr',is_tax_inclusive:true})
    let taxRegions=await tax.listTaxRegions({country_code:'in'})
    if(!taxRegions.length){const {result}=await createTaxRegionsWorkflow(container).run({input:[{country_code:'in',provider_id:'tp_system'}]});taxRegions=result}
    for(const region of taxRegions) {
      const code='YOUNOYA-NAVRATRI-18'
      const [existing]=await tax.listTaxRates({tax_region_id:region.id,code},{relations:['rules']})
      if(!existing) await tax.createTaxRates({tax_region_id:region.id,name:'Navratri box GST',code,rate:18,is_default:false,rules:[{reference:'product',reference_id:product.id}]})
      else {
        const rules=await tax.listTaxRateRules({tax_rate_id:existing.id})
        if(Number(existing.rate)!==18 || !rules.some(r=>r.reference==='product' && r.reference_id===product.id))throw new CommerceError('Navratri tax rule was edited; review required')
      }
    }
    await database().query(`insert into commerce_setting(id,data) values ('navratri:tax-basis-v1',$1) on conflict(id) do nothing`,[JSON.stringify({status:'applied',before,at:new Date().toISOString()})])
    logger.info(`Navratri prepared: ${product.id}. Draft status and inventory are preserved; no stock or release approval was invented.`)
  } finally { await closeDatabase() }
}
