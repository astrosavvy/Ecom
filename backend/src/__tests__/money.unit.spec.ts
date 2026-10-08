import { toPaise, sessionPaise, orderPaise, rupees } from '../modules/younoya-commerce/db'
import { classifyPrice } from '../modules/younoya-commerce/money-migration'
import { orderPayload } from '../modules/younoya-commerce/shipping-operations'
import { defaults } from '../modules/younoya-commerce/settings'
test('native Medusa rupees convert once at the provider boundary, including BigNumbers and half-up rounding', () => {
  expect(toPaise(1499)).toBe(149900)
  expect(toPaise({ value:'1499.25',precision:20 })).toBe(149925)
  expect(toPaise('1.005')).toBe(101)
  expect(toPaise('0.009')).toBe(1)
  expect(toPaise(1e3)).toBe(100000)
  for(const amount of [null,undefined,'',true,-1,NaN,Infinity,'1x',1e15]) expect(()=>toPaise(amount)).toThrow()
  expect(sessionPaise(1499,{money_unit:'inr-major-v2'})).toBe(149900)
  expect(sessionPaise(149900,{money_unit:'inr-paise-v1'})).toBe(149900)
  expect(()=>sessionPaise(149900,{})).toThrow('review')
  expect(orderPaise(149900,{metadata:{money_unit:'inr-paise-v1'}})).toBe(149900)
  expect(()=>orderPaise(149900,{metadata:{}})).toThrow('review')
})
test('migration requires exact known provenance and never guesses edited or custom prices', () => {
  const old={id:'price_qa',handle:'wild-poise',amount:249900,metadata:{catalog_source:'younoya-brooch-2026'}}
  expect(classifyPrice(old)).toEqual({id:'price_qa',action:'convert',amount:2499})
  expect(classifyPrice({...old,amount:2499}).action).toBe('keep')
  expect(classifyPrice({...old,metadata:{money_unit:'inr-major-v2'},amount:2999}).amount).toBe(2999)
  for(const changed of [{...old,amount:300000},{...old,metadata:{}},{...old,price_list_id:'pl_custom'},{...old,handle:'custom'}]) expect(()=>classifyPrice(changed)).toThrow()
})
test('mixed discounted INR invoices balance in rupees while preserving inclusive GST and quantities', () => {
  const settings={...defaults,packagingReviewed:true,hsn:'7117',variants:[{id:'nav',packedUnitKg:.5},{id:'brooch',packedUnitKg:.1}],
    parcels:[{name:'QA',variantIds:['nav','brooch'],maxUnits:10,tareKg:.1,maxWeightKg:10,lengthCm:20,widthCm:20,heightCm:20}]}
  const order={id:'order_qa',metadata:{money_unit:'inr-major-v2'},created_at:'2026-10-08',email:'qa@example.invalid',total:5695.51,
    items:[{id:'a',title:'Nine-day set',variant_id:'nav',quantity:3,total:4047.3},{id:'b',title:'Brooch',variant_id:'brooch',quantity:3,total:1648.21}],
    shipping_address:{country_code:'in',phone:'9876543210',first_name:'QA',address_1:'QA',city:'QA',province:'QA',postal_code:'110001'}}
  const payload=orderPayload(order,settings)
  expect(payload.sub_total).toBe(5695.51)
  expect(payload.order_items.reduce((sum:number,item:any)=>sum+toPaise(item.selling_price)*item.units,0)).toBe(569551)
  expect(payload.order_items.reduce((sum:number,item:any)=>sum+item.units,0)).toBe(6)
  expect(rupees(toPaise(1499/1.18))).toBe(1270.34)
  expect(149900-toPaise(1499/1.18)).toBe(22866)
  expect(()=>orderPayload({...order,total:5695.52},settings)).toThrow('total')
})
