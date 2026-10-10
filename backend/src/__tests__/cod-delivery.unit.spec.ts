import { checkoutMethod, coreNcr, deliveryInfo, COD_FEE } from '../modules/younoya-commerce/delivery'
import { validateShippingFee, cartFingerprint } from '../modules/younoya-commerce/checkout'
import { orderPayload } from '../modules/younoya-commerce/shipping-operations'
import { Shiprocket } from '../modules/younoya-commerce/shiprocket'
test.each([
  ['Delhi','Central Delhi',true],['Haryana','Gurugram',true],['Haryana','Gurgaon',true],['Haryana','Faridabad',true],
  ['Uttar Pradesh','Gautam Buddha Nagar',true],['Uttar Pradesh','Ghaziabad',true],['Haryana','Sonipat',false],['Maharashtra','Mumbai',false],
])('regional coverage %s / %s', (state,city,expected) => expect(coreNcr({state,city})).toBe(expected))
test('India-time cutoff is prepaid only, including weekends', () => {
  const location = {state:'Delhi',city:'New Delhi'}
  for (const day of ['10','11']) {
    expect(deliveryInfo(location,'razorpay',new Date(`2026-10-${day}T12:29:59Z`)).same_day_advisory).toBe(true)
    expect(deliveryInfo(location,'razorpay',new Date(`2026-10-${day}T12:30:00Z`)).same_day_advisory).toBe(false)
    expect(deliveryInfo(location,'cod',new Date(`2026-10-${day}T10:00:00Z`)).message).toContain('3–5 working days')
    expect(deliveryInfo(location,'cod',new Date(`2026-10-${day}T10:00:00Z`)).same_day_advisory).toBe(false)
  }
  expect(deliveryInfo({state:'Maharashtra',city:'Mumbai'},'razorpay').same_day_advisory).toBe(false)
})
test('payment defaults and fixed fee reject client substitutions', () => {
  expect(checkoutMethod(undefined)).toBe('razorpay'); expect(() => checkoutMethod('free')).toThrow()
  const method = {shipping_option_id:'so_cod',amount:49,total:49,is_tax_inclusive:true,adjustments:[]}
  expect(() => validateShippingFee({shipping_methods:[method]},'so_cod','cod')).not.toThrow()
  for (const invalid of [{...method,amount:0},{...method,total:98},{...method,adjustments:[{amount:1}]},{...method,is_tax_inclusive:false}])
    expect(() => validateShippingFee({shipping_methods:[invalid]},'so_cod','cod')).toThrow()
  const cart:any = {id:'cart_a',total:1548,items:[],metadata:{commerce_payment_method:'cod',cod_fee:49}}
  expect(cartFingerprint({...cart,metadata:{commerce_payment_method:'razorpay',cod_fee:0}})).not.toBe(cartFingerprint(cart))
})
test('COD payload collects merchandise plus exactly one handling fee; fractional discounts remain exact', () => {
  const s = {hsn:'62149090',pickupName:'test'}
  for (const [quantity,itemTotal] of [[1,1499],[3,4497],[2,2698.21]]) {
    const order:any = {id:'order_test',created_at:'2026-10-10',total:itemTotal+COD_FEE,email:'test@example.invalid',
      shipping_address:{country_code:'in',phone:'9999999999',first_name:'Test'},
      metadata:{commerce_approval:{money_unit:'inr-major-v2',payment_method:'cod',cod_fee:49,parcel:{weightKg:.7,lengthCm:33,widthCm:23,heightCm:9}}},
      items:[{title:'Test kit',variant_id:'v_a',quantity,total:itemTotal}]}
    const payload = orderPayload(order,s)
    expect(payload.payment_method).toBe('COD'); expect(payload.shipping_charges).toBe(49)
    expect(Math.round((payload.sub_total+payload.shipping_charges)*100)).toBe(Math.round(order.total*100))
    expect(payload.order_items.reduce((n:number,i:any) => n+Math.round(i.selling_price*100)*i.units,0)).toBe(Math.round(itemTotal*100))
    expect(() => orderPayload({...order,total:order.total+1},s)).toThrow()
  }
})
test('Shiprocket sends COD mode and never invents a courier after failure', async () => {
  const original = {...process.env}
  try {
    process.env.SHIPROCKET_API_EMAIL='test@example.invalid'; process.env.SHIPROCKET_API_PASSWORD='test-only'
    const ok=(body:any)=>({ok:true,status:200,json:async()=>body})
    const fetcher=jest.fn().mockResolvedValueOnce(ok({token:'test-token-with-sufficient-length'})).mockResolvedValueOnce(ok({data:{available_courier_companies:[{courier_company_id:1,rate:55}]}}))
    const provider = new Shiprocket(fetcher as any)
    await provider.serviceability('110024','110001',.7,undefined,true)
    expect(fetcher.mock.calls[1][0]).toContain('cod=1')
    fetcher.mockRejectedValue(new Error('timeout'))
    await expect(provider.serviceability('110024','110001',.7)).rejects.toThrow()
  } finally { process.env=original }
})
