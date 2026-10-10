import { Modules } from '@medusajs/framework/utils'
import * as db from '../modules/younoya-commerce/db'
import * as orders from '../modules/younoya-commerce/orders'
import { approvalSignature, cartFingerprint } from '../modules/younoya-commerce/checkout'
import { completeApprovedCart } from '../modules/younoya-commerce/completion'
jest.mock('../modules/younoya-commerce/db',() => ({ __esModule:true,...jest.requireActual('../modules/younoya-commerce/db') }))
jest.mock('../modules/younoya-commerce/orders',() => ({ __esModule:true,...jest.requireActual('../modules/younoya-commerce/orders') }))
const cart: any = { id:'cart_qa',customer_id:'cus_qa',payment_collection:{id:'paycol_qa'},total:10000,items:[],currency_code:'inr',email:'qa@example.invalid',metadata:{} }
const payment={ listPaymentSessions:async () => [{provider_id:'pp_razorpay_razorpay',amount:10000,currency_code:'inr',data:{money_unit:'inr-major-v2'}}] }
beforeEach(() => {
  process.env.JWT_SECRET='qa-process-only'
  delete cart.completed_at
  const approval={ money_unit:'inr-major-v2', fingerprint:cartFingerprint(cart) }
  cart.metadata={ commerce_approval:{ ...approval,signature:approvalSignature(approval) } }
  jest.spyOn(db,'exclusive').mockImplementation(async (_key,run) => run())
  jest.spyOn(orders,'readCart').mockResolvedValue(cart)
  jest.spyOn(orders,'completedOrder').mockResolvedValue({ id:'order_qa',total:10000 })
})
afterEach(() => jest.restoreAllMocks())
test('HTTP and recovery completion reuse one transaction ID, including after a worker restart',async () => {
  const run=jest.fn(async () => ({ transaction:{ hasFinished:() => true },errors:[] }))
  const scope={ resolve:(key: string) => key === Modules.PAYMENT ? payment : { run } }
  await completeApprovedCart(scope,'cart_qa','cus_qa')
  await completeApprovedCart(scope,'cart_qa')
  expect(run.mock.calls).toHaveLength(2)
  expect((run.mock.calls[0] as any)[1].transactionId).toBe((run.mock.calls[1] as any)[1].transactionId)
  expect(orders.readCart).toHaveBeenCalledWith(scope,'cart_qa','cus_qa')
})
test('already completed cart returns its order without rerunning payment or order creation',async () => {
  cart.completed_at='2026-10-07'
  expect(await completeApprovedCart({},'cart_qa','cus_qa')).toHaveProperty('id','order_qa')
})
test('missing payment collection never queries unrelated payment sessions',async () => {
  const saved = cart.payment_collection
  delete cart.payment_collection
  const resolve = jest.fn()
  try {
    await expect(completeApprovedCart({ resolve },'cart_qa')).rejects.toThrow('Payment preparation is required')
    expect(resolve).not.toHaveBeenCalled()
  } finally { cart.payment_collection = saved }
})
test('changed cart is held before any completion workflow',async () => {
  const run=jest.fn()
  cart.total=10001
  await expect(completeApprovedCart({ resolve:() => ({ run }) },'cart_qa')).rejects.toThrow('changed')
  expect(run).not.toHaveBeenCalled()
  cart.total=10000
})
test('unfinished or failed workflow never reports an order as successful',async () => {
  const run=jest.fn().mockResolvedValueOnce({ transaction:{ hasFinished:() => false },errors:[] })
    .mockResolvedValueOnce({ transaction:{ hasFinished:() => true },errors:[{ error:new Error('QA failure') }] })
  const scope={ resolve:(key: string) => key === Modules.PAYMENT ? payment : { run } }
  await expect(completeApprovedCart(scope,'cart_qa')).rejects.toThrow('reconciled')
  await expect(completeApprovedCart(scope,'cart_qa')).rejects.toThrow('reconciled')
})
