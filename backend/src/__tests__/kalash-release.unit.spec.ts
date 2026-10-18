import path from 'path'
import { ContainerRegistrationKeys, Modules, getVariantAvailability } from '@medusajs/framework/utils'
jest.mock('@medusajs/framework/utils',() => ({...jest.requireActual('@medusajs/framework/utils'),getVariantAvailability:jest.fn()}))
jest.mock('../modules/younoya-commerce/kalash-catalog',() => ({...jest.requireActual('../modules/younoya-commerce/kalash-catalog'),prepareKalash:jest.fn()}))
jest.mock('../modules/younoya-commerce/settings',() => ({...jest.requireActual('../modules/younoya-commerce/settings'),settings:jest.fn(),requireLive:jest.fn()}))
jest.mock('../modules/younoya-commerce/db',() => ({...jest.requireActual('../modules/younoya-commerce/db'),exclusive:jest.fn(async (_key,run) => run()),transaction:jest.fn()}))
import { defaults, settings, requireLive } from '../modules/younoya-commerce/settings'
import { transaction, toPaise } from '../modules/younoya-commerce/db'
import { releaseKalash, ensureKalashTax, withKalashParcel, KALASH_TAX_CODE } from '../modules/younoya-commerce/kalash-release'
import { pack } from '../modules/younoya-commerce/packing'
import { orderPayload } from '../modules/younoya-commerce/shipping-operations'
import { ritualReleased } from '../modules/younoya-commerce/ritual-products'
const TaxService = require(path.join(path.dirname(require.resolve('@medusajs/tax')),'services/tax-module-service.js')).default
const Provider = require(path.join(path.dirname(require.resolve('@medusajs/tax')),'providers/system.js')).default

const navParcel={name:'Navratri',variantIds:['v_nav'],maxUnits:1,tareKg:0,maxWeightKg:.7,lengthCm:33.02,widthCm:22.86,heightCm:8.89}
const state={...defaults,packagingReviewed:true,stockLocationId:'sloc',salesChannelId:'sc',variants:[{id:'v_nav',packedUnitKg:.7,hsn:'62149090'}],parcels:[navParcel]}
let rates:any[],rules:any[],product:any,available:number
const tax={listTaxRegions:jest.fn(),listTaxRates:jest.fn(),listTaxRateRules:jest.fn(),createTaxRates:jest.fn(),updateTaxRates:jest.fn(),getTaxLines:jest.fn()}
const products={listProducts:jest.fn(),updateProducts:jest.fn(),updateProductVariants:jest.fn()}
const query={graph:jest.fn()}
const scope={resolve:(key:string) => ({[Modules.TAX]:tax,[Modules.PRODUCT]:products,[ContainerRegistrationKeys.QUERY]:query})[key]}
beforeEach(()=>{
  jest.clearAllMocks();rates=[];rules=[];available=50
  product={id:'p_kalash',status:'draft',metadata:{catalog_source:'younoya-kalash-2026',kalash_stock_initialized:true},variants:[{id:'v_kalash',sku:'YN-DIWALI-KALASH-001',manage_inventory:true,allow_backorder:false}]}
  tax.listTaxRegions.mockResolvedValue([{id:'txr_in',parent_id:null},{id:'txr_dl',parent_id:'txr_in'}])
  tax.listTaxRates.mockImplementation(async()=>rates)
  tax.listTaxRateRules.mockImplementation(async()=>rules)
  tax.getTaxLines.mockResolvedValue([{rate:0,code:KALASH_TAX_CODE}])
  tax.createTaxRates.mockImplementation(async data=>{const rate={id:`rate_${rates.length}`, ...data};rates.push(rate);rules.push({tax_rate_id:rate.id,reference:'product',reference_id:'p_kalash'});return rate})
  ;(settings as jest.Mock).mockResolvedValue({draft:state})
  ;(requireLive as jest.Mock).mockResolvedValue({draft:state})
  products.listProducts.mockImplementation(async()=>[product])
  products.updateProducts.mockImplementation(async(id,data)=>{expect(id).toBe('p_kalash');product={...product,...data};return product})
  query.graph.mockResolvedValue({data:[{id:'p_kalash',sales_channels:[{id:'sc'}],variants:[{id:'v_kalash',prices:[{amount:5599,currency_code:'inr'}]}]}]})
  ;(getVariantAvailability as jest.Mock).mockImplementation(async()=>({v_kalash:{availability:available}}))
  ;(transaction as jest.Mock).mockImplementation(async(_key,run)=>run({query:jest.fn(async sql=>({rows:sql.startsWith('select')?[{data:state}]:[]}))}))
})

test('single-set gross weight is counted once; Navratri parcel survives; unsupported combinations fail',()=>{
  const configured=withKalashParcel(state,'v_kalash')
  expect(pack([{variant_id:'v_kalash',quantity:1}],configured)).toMatchObject({weightKg:2.5,lengthCm:35.56,widthCm:35.56,heightCm:12.7,tareKg:0})
  expect(pack([{variant_id:'v_nav',quantity:1}],configured)).toMatchObject(navParcel)
  expect(()=>pack([{variant_id:'v_kalash',quantity:2}],configured)).toThrow('No approved parcel')
  expect(()=>pack([{variant_id:'v_kalash',quantity:1},{variant_id:'v_nav',quantity:1}],configured)).toThrow('No approved parcel')
  expect(withKalashParcel(configured,'v_kalash')).toEqual(configured)
})

test('tax preparation creates only non-combinable product-scoped zero rates, then reuses them',async()=>{
  await ensureKalashTax(scope,'p_kalash');await ensureKalashTax(scope,'p_kalash')
  expect(tax.createTaxRates).toHaveBeenCalledTimes(2)
  for(const rate of rates)expect(rate).toMatchObject({rate:0,code:KALASH_TAX_CODE,is_default:false,is_combinable:false,rules:[{reference:'product',reference_id:'p_kalash'}]})
  expect(tax.updateTaxRates).toHaveBeenCalledTimes(2)
  rules.push({tax_rate_id:'foreign',reference:'product',reference_id:'p_kalash'})
  await expect(ensureKalashTax(scope,'p_kalash')).rejects.toThrow('override needs review')
})

test('Medusa selects the explicit zero product rate over defaults and preserves a zero tax line',async()=>{
  const service=Object.create(TaxService.prototype)
  const region={id:'txr_in',parent_id:null,province_code:null}
  const defaultsRate={id:'default',rate:18,is_default:true,is_combinable:false,tax_region:region,rules:[]}
  const zero={id:'kalash_zero',rate:0,is_default:false,is_combinable:false,tax_region:region,rules:[{reference:'product',reference_id:'p_kalash'}]}
  const selected=service.getTaxRatesForItem({product_id:'p_kalash'},[defaultsRate,zero])
  expect(selected).toHaveLength(1);expect(selected[0].rate).toBe(0)
  const lines=await new Provider().getTaxLines([{line_item:{id:'line_kalash'},rates:selected}],[],{})
  expect(lines[0]).toMatchObject({rate:0,line_item_id:'line_kalash'})
})

test('release publishes only after all configuration succeeds and never replenishes subsequent stock',async()=>{
  expect(await releaseKalash(scope)).toMatchObject({status:'published',gstRate:0,availableQuantity:50})
  expect(product.metadata).toMatchObject({gst_rate:0,gst_rate_approved:true,packaging_approved:true,ritual_release_approved:true,kalash_stock_initialized:true})
  expect(ritualReleased({...product,handle:'diwali-wealth-kalash'})).toBe(true)
  available=49
  expect(await releaseKalash(scope)).toMatchObject({availableQuantity:49})
  available=0
  await expect(releaseKalash(scope)).rejects.toThrow('no available inventory')
  available=50;tax.listTaxRegions.mockResolvedValue([])
  await expect(releaseKalash(scope)).rejects.toThrow('India tax region')
  expect(product.metadata.ritual_release_approved).toBe(false)
})

test('a nonzero or missing calculated tax line keeps release closed',async()=>{
  for(const lines of [[],[{rate:18,code:'unexpected'}]]) {
    tax.getTaxLines.mockResolvedValue(lines)
    await expect(releaseKalash(scope)).rejects.toThrow('approved zero rate')
    expect(product.metadata.ritual_release_approved).toBe(false)
  }
})

test('prepaid Shiprocket payload retains exact INR value, approved parcel and zero customer shipping',()=>{
  const configured=withKalashParcel(state,'v_kalash'),parcel=pack([{variant_id:'v_kalash',quantity:1}],configured)
  const order={id:'order_mock',total:5599,currency_code:'inr',created_at:'2026-10-18',email:'qa@example.invalid',shipping_address:{country_code:'in',first_name:'QA',phone:'9999999999'},items:[{variant_id:'v_kalash',title:'Kalash',quantity:1,total:5599}],metadata:{commerce_approval:{money_unit:'inr-major-v2',payment_method:'razorpay',cod_fee:0,parcel}}}
  expect(toPaise(order.total)).toBe(559900)
  expect(orderPayload(order,{...configured,pickupName:'warehouse'})).toMatchObject({payment_method:'Prepaid',sub_total:5599,shipping_charges:0,length:35.56,breadth:35.56,height:12.7,weight:2.5})
})
