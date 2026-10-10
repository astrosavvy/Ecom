import crypto from 'crypto'
import { minor, rupees } from '../modules/younoya-commerce/db'
import { defaults, publicFields, policyBlockers, readiness, settingsSchema } from '../modules/younoya-commerce/settings'
import { pack } from '../modules/younoya-commerce/packing'
import { approvalSignature, cartFingerprint, validApproval } from '../modules/younoya-commerce/checkout'
import { verifyWebhook } from '../modules/younoya-commerce/razorpay'
import { orderPayload, trackingStatus } from '../modules/younoya-commerce/shipping-operations'
import { Shiprocket, ProviderError } from '../modules/younoya-commerce/shiprocket'
const original = { ...process.env }
const packing = { ...defaults, packagingReviewed: true, hsn:'7117', variants:[{ id:'variant_one',packedUnitKg:.2 }],
  parcels:[{ name:'Verified small box',variantIds:['variant_one'],maxUnits:4,tareKg:.1,maxWeightKg:1,lengthCm:20,widthCm:15,heightCm:10 }] }
const complete = { ...packing,address:'QA business address',supportPhone:'QA phone',grievanceName:'QA officer',grievanceEmail:'qa@example.invalid',grievancePhone:'QA phone',
  damageReportHours:48,refundInitiationDays:3,consumerReviewComplete:true,pickupName:'QA pickup',pickupAddress:'QA address',pickupPincode:'110001',
  taxStatus:'not_registered',stockLocationId:'sloc_qa',salesChannelId:'sc_qa',shippingOptionId:'so_qa',
  razorpayApproved:true,captureConfigured:true,shiprocketReady:true,liveTestComplete:true,taxInvoiceReviewed:true,catalogMoneyVersion:"inr-major-v2" }
afterEach(() => { process.env = { ...original } })
test('launch fails closed without complete settings, approved policies, credentials and activation', () => {
  expect(policyBlockers(defaults)).toContain('address')
  expect(readiness(defaults,null,null).ready).toBe(false)
  for (const name of ['RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET','SHIPROCKET_API_EMAIL','SHIPROCKET_API_PASSWORD']) process.env[name]='test-only'
  process.env.COMMERCE_LIVE_ENABLED='true'
  expect(readiness(complete,publicFields(complete),'revision').ready).toBe(true)
  expect(readiness({ ...complete,damageReportHours:72 },publicFields(complete),'revision').blockers).toContain('unpublishedPolicyChanges')
  expect(Object.keys(publicFields(complete))).not.toContain('pickupName')
  expect(JSON.stringify(publicFields(complete))).not.toContain('test-only')
})
test('invalid packing and setting values are rejected', () => {
  expect(settingsSchema.safeParse({ ...complete,parcels:[{ ...packing.parcels[0],lengthCm:0 }] }).success).toBe(false)
  expect(pack([{ variant_id:'variant_one',quantity:2 }],packing).weightKg).toBe(.5)
  expect(() => pack([{ variant_id:'unconfigured',quantity:1 }],packing)).toThrow()
  expect(() => pack([{ variant_id:'variant_one',quantity:5 }],packing)).toThrow()
  expect(() => pack([{ variant_id:'variant_one',quantity:1.5 }],packing)).toThrow()
})
test('currency conversion preserves exact INR minor units, including serialized Medusa BigNumbers', () => {
  expect(rupees(249900)).toBe(2499)
  expect(minor({ value:'249900',precision:20 })).toBe(249900)
  for (const value of [-1,1.2,NaN,Infinity]) expect(() => minor(value)).toThrow()
})
test('delivery approval survives JSONB key ordering, but cannot be forged or reused on another cart', () => {
  process.env.JWT_SECRET='test-signing-secret'
  const cart = { id:'cart_one',items:[{ variant_id:'variant_one',quantity:1,total:100 }],total:100,email:'qa@example.invalid',currency_code:'inr',shipping_address:{ postal_code:'110001',country_code:'in' } }
  const approval: any = { fingerprint:cartFingerprint(cart),customer_id:'cus_one',revision:'r1',parcel:packing.parcels[0] }
  approval.signature=approvalSignature(approval)
  const reordered = Object.fromEntries(Object.entries(approval).reverse())
  expect(validApproval(reordered)).toBe(true)
  expect(validApproval({ ...approval,customer_id:'cus_two' })).toBe(false)
  expect(cartFingerprint({ ...cart,id:'cart_two' })).not.toBe(approval.fingerprint)
  expect(cartFingerprint({ ...cart,shipping_address:{ country_code:'in',postal_code:'110001' } })).toBe(approval.fingerprint)
})
test('webhook signatures bind the exact raw payload and fail closed without secret', () => {
  process.env.RAZORPAY_WEBHOOK_SECRET='test-webhook-secret'
  const raw='{"event":"payment.captured"}'
  const signature=crypto.createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex')
  expect(verifyWebhook(raw,signature)).toBe(true)
  expect(verifyWebhook(raw+' ',signature)).toBe(false)
  expect(verifyWebhook(raw,'invalid')).toBe(false)
  delete process.env.RAZORPAY_WEBHOOK_SECRET
  expect(verifyWebhook(raw,signature)).toBe(false)
})
test('Shiprocket payload balances discounted fractional unit prices without 100x conversion mistakes', () => {
  const order = { metadata:{money_unit:'inr-major-v2'},id:'order_qa',created_at:'2026-10-07T10:00:00Z',email:'qa@example.invalid',total:100.01,
    items:[{ id:'item_qa',title:'QA item',variant_id:'variant_one',quantity:3,total:100.01 }],
    shipping_address:{ country_code:'in',phone:'9876543210',first_name:'QA',address_1:'QA address',city:'Delhi',province:'Delhi',postal_code:'110001' } }
  const payload=orderPayload(order,packing)
  expect(payload.sub_total).toBe(100.01)
  expect(payload.order_items.reduce((n: number,i: any) => n+Math.round(i.selling_price*100)*i.units,0)).toBe(10001)
  expect(payload.payment_method).toBe('Prepaid'); expect(payload.shipping_charges).toBe(0)
  const classified=orderPayload(order,{ ...packing,variantHsns:{variant_one:'7117'},variants:[{...packing.variants[0],hsn:'9999'}],hsn:'8888' })
  expect(classified.order_items.every((i: any) => i.hsn==='7117')).toBe(true)
  expect(() => orderPayload(order,{ ...packing,hsn:'' })).toThrow('classification')
  expect(trackingStatus('Pickup Scheduled')).toBe('booked')
  expect(trackingStatus('Picked Up')).toBe('picked_up')
  expect(trackingStatus('Out For Delivery')).toBe('in_transit')
  expect(trackingStatus('RTO Delivered')).toBe('returned')
  expect(trackingStatus('unrecognized')).toBe('unknown')
})
describe('Shiprocket provider', () => {
  const ok = (body: any) => ({ ok:true,status:200,json:async () => body })
  beforeEach(() => { process.env.SHIPROCKET_API_EMAIL='api@example.invalid';process.env.SHIPROCKET_API_PASSWORD='test-private-password' })
  test('auth stays server-side, token is reused and serviceability returns validated courier entries', async () => {
    const fetcher=jest.fn().mockResolvedValueOnce(ok({ token:'test-token-with-sufficient-length' })).mockResolvedValue(ok({ data:{ available_courier_companies:[{ courier_company_id:1,rate:55 }] } }))
    const provider=new Shiprocket(fetcher as any)
    expect((await provider.serviceability('110001','110002',.5)).length).toBe(1)
    await provider.serviceability('110001','110003',.5)
    expect(fetcher).toHaveBeenCalledTimes(3)
    expect(fetcher.mock.calls[0][1].body).toContain('test-private-password')
    expect(fetcher.mock.calls[1][1].headers.Authorization).toContain('Bearer ')
    expect(fetcher.mock.calls[1][0]).not.toContain('test-private-password')
  })
  test.each([['rejection',{ ok:false,status:422 },false],['timeout',null,true],['malformed',ok({ data:{} }),true]])('%s does not retry a provider request',async (_name,response,uncertain) => {
    const fetcher=jest.fn().mockResolvedValueOnce(ok({ token:'test-token-with-sufficient-length' }))
    if (response) fetcher.mockResolvedValueOnce(response);else fetcher.mockRejectedValueOnce(new Error('timeout'))
    try { await new Shiprocket(fetcher as any).serviceability('110001','110002',.5); throw new Error('expected error') }
    catch (error) { expect(error).toBeInstanceOf(ProviderError);expect((error as ProviderError).uncertain).toBe(uncertain) }
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
  test('missing configuration and malformed authentication block delivery',async () => {
    delete process.env.SHIPROCKET_API_PASSWORD
    delete process.env.SHIPROCKET_API_KEY
    const fetcher=jest.fn();await expect(new Shiprocket(fetcher as any).get('/orders')).rejects.toThrow('not configured');expect(fetcher).not.toHaveBeenCalled()
    process.env.SHIPROCKET_API_PASSWORD='test-private-password'
    fetcher.mockResolvedValue(ok({ token:'bad' }));await expect(new Shiprocket(fetcher as any).get('/orders')).rejects.toBeInstanceOf(ProviderError)
  })
})
