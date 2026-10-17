import { Modules } from '@medusajs/framework/utils'
jest.mock('../modules/younoya-commerce/orders',() => ({readCart:jest.fn(),completedOrder:jest.fn()}))
jest.mock('../modules/younoya-commerce/db',() => ({...jest.requireActual('../modules/younoya-commerce/db'),exclusive:jest.fn(async (_key,run) => run())}))
import { confirmCod } from '../modules/younoya-commerce/cod'
import { checkoutStatus } from '../modules/younoya-commerce/checkout-recovery'
import { checkoutMethod } from '../modules/younoya-commerce/delivery'
import { readCart,completedOrder } from '../modules/younoya-commerce/orders'

const cart:any = {id:'cart_test',metadata:{commerce_payment_method:'cod'},payment_collection:{id:'paycol_test'}}
const listWorkflowExecutions = jest.fn(), listPaymentSessions = jest.fn()
const scope = {resolve:(key:string) => key === Modules.WORKFLOW_ENGINE ? {listWorkflowExecutions} : {listPaymentSessions}}
beforeEach(() => {
  jest.clearAllMocks(); delete cart.completed_at
  ;(readCart as jest.Mock).mockResolvedValue(cart)
  ;(completedOrder as jest.Mock).mockResolvedValue(null)
  listWorkflowExecutions.mockResolvedValue([]); listPaymentSessions.mockResolvedValue([])
})
test('new COD attempts are rejected, including cached explicit requests; prepaid remains default',async () => {
  expect(checkoutMethod(undefined)).toBe('razorpay')
  expect(checkoutMethod('razorpay')).toBe('razorpay')
  expect(() => checkoutMethod('cod')).toThrow('no longer available')
  await expect(confirmCod(scope,'cart_test','guest:cart_test')).rejects.toThrow('no longer available')
  expect(listPaymentSessions).not.toHaveBeenCalled()
})
test('old confirmation can recover a completed order without creating anything',async () => {
  ;(completedOrder as jest.Mock).mockResolvedValue({id:'order_old',total:1548})
  expect(await confirmCod(scope,'cart_test','guest:cart_test')).toEqual({order:{id:'order_old',total:1548}})
  expect(await checkoutStatus(scope,'cart_test','guest:cart_test')).toMatchObject({completed:true,restart_allowed:false,order:{id:'order_old'}})
  expect(listWorkflowExecutions).not.toHaveBeenCalled(); expect(listPaymentSessions).not.toHaveBeenCalled()
})
test('only a proven unattempted cart may restart; address and items remain on its cart',async () => {
  expect(await checkoutStatus(scope,'cart_test','guest:cart_test')).toMatchObject({restart_allowed:true,cart})
  listPaymentSessions.mockResolvedValue([{provider_id:'pp_system',status:'pending'}])
  const attempted = await checkoutStatus(scope,'cart_test','guest:cart_test')
  expect(attempted.restart_allowed).toBe(false); expect(attempted).not.toHaveProperty('cart')
  listPaymentSessions.mockResolvedValue([])
  listWorkflowExecutions.mockResolvedValue([{state:'failed'}])
  expect((await checkoutStatus(scope,'cart_test','guest:cart_test')).restart_allowed).toBe(false)
})
test('uncertain completion, storage outages and wrong ownership fail closed',async () => {
  cart.completed_at='2026-10-10'
  expect(await checkoutStatus(scope,'cart_test','guest:cart_test')).toMatchObject({completed:true,restart_allowed:false})
  delete cart.completed_at
  listWorkflowExecutions.mockRejectedValueOnce(new Error('offline'))
  await expect(checkoutStatus(scope,'cart_test','guest:cart_test')).rejects.toThrow('offline')
  ;(readCart as jest.Mock).mockRejectedValue(new Error('Not owner'))
  await expect(checkoutStatus(scope,'cart_test','cus_other')).rejects.toThrow('Not owner')
  await expect(confirmCod(scope,'cart_test','cus_other')).rejects.toThrow('Not owner')
})
