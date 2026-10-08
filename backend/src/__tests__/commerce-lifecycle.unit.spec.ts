import crypto from 'crypto'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'
const capturedWorkflow = jest.fn(async () => ({}))
const completeWorkflow = jest.fn(async () => ({}))
jest.mock('../modules/younoya-commerce/db',() => ({ __esModule:true,...jest.requireActual('../modules/younoya-commerce/db') }))
jest.mock('../modules/younoya-commerce/orders',() => ({ __esModule:true,...jest.requireActual('../modules/younoya-commerce/orders') }))
jest.mock('../modules/younoya-commerce/razorpay',() => ({ __esModule:true,...jest.requireActual('../modules/younoya-commerce/razorpay') }))
jest.mock('@medusajs/medusa/core-flows',() => ({
  processPaymentWorkflow: () => ({ run:capturedWorkflow }), completeCartWorkflow: () => ({ run:completeWorkflow }),
}))
import * as db from '../modules/younoya-commerce/db'
import * as orders from '../modules/younoya-commerce/orders'
import * as rz from '../modules/younoya-commerce/razorpay'
import { processOperation } from '../modules/younoya-commerce/worker'
import { assignAwb, bookPickup } from '../modules/younoya-commerce/shipping-operations'
import { shiprocket, ProviderError } from '../modules/younoya-commerce/shiprocket'
import { POST } from '../api/hooks/younoya-razorpay/route'
import { approvalSignature } from '../modules/younoya-commerce/checkout'
afterEach(() => { jest.restoreAllMocks();capturedWorkflow.mockClear();completeWorkflow.mockClear() })
const order: any = { id:'order_qa',total:10000,currency_code:'inr',shipping_address:{ postal_code:'110001' },metadata:{},
  payment_collections:[{ payments:[{ captured_at:'2026-10-07',data:{ razorpay_payment_id:'pay_qa' } }] }] }
beforeEach(() => {
  process.env.JWT_SECRET='test-only'
  order.metadata.commerce_approval={ money_unit:'inr-paise-v1',parcel:{ weightKg:.5 },shipping:{ pickupPincode:'110001' } }
  order.metadata.commerce_approval.signature=approvalSignature(order.metadata.commerce_approval)
})
test('out-of-order failed notification uses captured provider state and recovers the cart once',async () => {
  const op={ id:'cop_qa',kind:'payment_event',payload:{ paymentId:'pay_qa' } }
  jest.spyOn(db,'claim').mockResolvedValue(op)
  const finish=jest.spyOn(db,'finish').mockResolvedValue(undefined)
  jest.spyOn(db,'exclusive').mockImplementation(async (_key,run) => run())
  jest.spyOn(rz,'razorpayRequest').mockResolvedValueOnce({ id:'pay_qa',order_id:'rzorder_qa',amount:10000,currency:'INR',status:'captured' })
    .mockResolvedValueOnce({ id:'rzorder_qa',amount:10000,notes:{ medusa_session_id:'ps_qa' } })
  jest.spyOn(orders,'readCart').mockResolvedValue({ id:'cart_qa',completed_at:'2026-10-07' })
  const session={ id:'ps_qa',amount:10000,currency_code:'inr',payment_collection_id:'pc_qa',data:{ id:'rzorder_qa',money_unit:'inr-paise-v1' } }
  const update=jest.fn()
  const scope={ resolve:(key: string) => key===Modules.PAYMENT ? { retrievePaymentSession:async () => session, updatePaymentSession:update }
    : { graph:async () => ({ data:[{ cart_id:'cart_qa' }] }) } }
  await processOperation(scope,'cop_qa')
  expect(capturedWorkflow).toHaveBeenCalledTimes(1);expect(completeWorkflow).not.toHaveBeenCalled()
  expect(finish).toHaveBeenCalledWith('cop_qa',{ captured:true })
})
test('payment event amount mismatch never completes an order',async () => {
  jest.spyOn(db,'claim').mockResolvedValue({ id:'cop_qa',kind:'payment_event',payload:{ paymentId:'pay_qa' } })
  const finish=jest.spyOn(db,'finish').mockResolvedValue(undefined)
  jest.spyOn(rz,'razorpayRequest').mockResolvedValueOnce({ amount:100,currency:'INR',status:'captured' }).mockResolvedValueOnce({ amount:101,notes:{ medusa_session_id:'ps_qa' } })
  await processOperation({},'cop_qa')
  expect(completeWorkflow).not.toHaveBeenCalled();expect(finish.mock.calls[0][2]).toBe('held')
})
test('a verified webhook is not acknowledged when durable storage fails',async () => {
  process.env.RAZORPAY_WEBHOOK_SECRET='qa-webhook'
  const body={ event:'payment.captured',payload:{ payment:{ entity:{ id:'pay_qa',order_id:'order_qa' } } } }
  const raw=JSON.stringify(body)
  const res: any={ status:jest.fn(function(code) { this.code=code;return this }),json:jest.fn(function(body) { this.body=body;return this }) }
  jest.spyOn(db,'enqueue').mockRejectedValue(new Error('database unavailable'))
  await POST({ body,rawBody:raw,headers:{ 'x-razorpay-signature':crypto.createHmac('sha256','qa-webhook').update(raw).digest('hex') } } as any,res)
  expect(res.code).toBe(503)
  res.code=200
  await POST({ body,rawBody:raw,headers:{ 'x-razorpay-signature':'invalid' } } as any,res)
  expect(res.code).toBe(401)
})
function shippingMocks(raw: any) {
  jest.spyOn(orders,'readOrder').mockResolvedValue(order)
  jest.spyOn(db,'database').mockReturnValue({ query:async () => ({ rowCount:0 }) } as any)
  jest.spyOn(rz,'razorpayRequest').mockResolvedValue({ status:'captured',currency:'INR',amount:10000,amount_refunded:0 })
  jest.spyOn(orders,'shipment').mockResolvedValue({ status:'booked',data:{ shiprocketOrderId:12,shipmentId:22,awb:'QA12345' } })
  jest.spyOn(shiprocket,'get').mockResolvedValue({ data:{ shipments:[raw] } })
  jest.spyOn(orders,'setShipment').mockResolvedValue(undefined)
}
test('uncertain pickup does not repeat a booking; recorded provider pickup is recovered',async () => {
  shippingMocks({})
  const post=jest.spyOn(shiprocket,'post')
  await expect(bookPickup({}, { order_id:'order_qa',status:'reconcile' })).rejects.toThrow('uncertain')
  expect(post).not.toHaveBeenCalled()
  jest.spyOn(shiprocket,'get').mockResolvedValue({ data:{ shipments:[{ pickup_scheduled_date:'2026-10-08' }] } })
  expect(await bookPickup({}, { order_id:'order_qa',status:'reconcile' })).toHaveProperty('awb','QA12345')
})
test('pickup rejection remains un-dispatched and does not imply success',async () => {
  shippingMocks({})
  const set=jest.spyOn(orders,'setShipment').mockResolvedValue(undefined)
  jest.spyOn(shiprocket,'post').mockResolvedValue({ pickup_status:0 })
  await expect(bookPickup({}, { order_id:'order_qa',status:'queued' })).rejects.toBeInstanceOf(ProviderError)
  expect(set).not.toHaveBeenCalled()
})
