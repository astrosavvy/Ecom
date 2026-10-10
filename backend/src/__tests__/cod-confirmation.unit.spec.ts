const sessionRun = jest.fn()
jest.mock('@medusajs/medusa/core-flows',() => ({createPaymentSessionsWorkflow:() => ({run:sessionRun}),createPaymentCollectionForCartWorkflow:() => ({run:jest.fn()})}))
jest.mock('../modules/younoya-commerce/orders',() => ({readCart:jest.fn(),completedOrder:jest.fn()}))
jest.mock('../modules/younoya-commerce/checkout',() => ({validatePreparedCart:jest.fn()}))
jest.mock('../modules/younoya-commerce/completion',() => ({completeApprovedCart:jest.fn()}))
jest.mock('../modules/younoya-commerce/db',() => ({...jest.requireActual('../modules/younoya-commerce/db'),exclusive:jest.fn(async (_key,run) => run())}))
import { confirmCod } from '../modules/younoya-commerce/cod'
import { readCart,completedOrder } from '../modules/younoya-commerce/orders'
import { validatePreparedCart } from '../modules/younoya-commerce/checkout'
import { completeApprovedCart } from '../modules/younoya-commerce/completion'
const cart:any={id:'cart_test',payment_collection:{id:'paycol_test'},metadata:{commerce_approval:{payment_method:'cod'}}}
let sessions:any[]=[]
const scope={resolve:()=>({listPaymentSessions:async()=>sessions})}
beforeEach(() => {
 jest.clearAllMocks(); delete cart.completed_at; sessions=[]
 ;(readCart as jest.Mock).mockResolvedValue(cart)
 ;(validatePreparedCart as jest.Mock).mockResolvedValue(cart)
 ;(completedOrder as jest.Mock).mockResolvedValue({id:'order_test'})
 ;(completeApprovedCart as jest.Mock).mockResolvedValue({id:'order_test'})
 sessionRun.mockImplementation(async () => {sessions=[{provider_id:'pp_system'}]})
})
test('COD creates a manual session once and reuses it during retry/restart',async () => {
 expect(await confirmCod(scope,'cart_test','guest:cart_test')).toEqual({order:{id:'order_test'}})
 await confirmCod(scope,'cart_test','guest:cart_test')
 expect(sessionRun).toHaveBeenCalledTimes(1)
 expect(sessionRun.mock.calls[0][0].input.provider_id).toBe('pp_system')
 expect(completeApprovedCart).toHaveBeenCalledWith(scope,'cart_test','guest:cart_test',true)
})
test('completed carts return the existing order without another authorization',async () => {
 cart.completed_at='2026-10-10'
 expect(await confirmCod(scope,'cart_test','guest:cart_test')).toEqual({order:{id:'order_test'}})
 expect(sessionRun).not.toHaveBeenCalled(); expect(completeApprovedCart).not.toHaveBeenCalled()
})
test('ownership, expired approval and an existing Razorpay session cannot be bypassed',async () => {
 ;(readCart as jest.Mock).mockRejectedValueOnce(new Error('Not owner'))
 await expect(confirmCod(scope,'cart_test','cus_other')).rejects.toThrow('Not owner')
 ;(validatePreparedCart as jest.Mock).mockRejectedValueOnce(new Error('Expired approval'))
 await expect(confirmCod(scope,'cart_test','guest:cart_test')).rejects.toThrow('Expired approval')
 sessions=[{provider_id:'pp_razorpay_razorpay'}]
 await expect(confirmCod(scope,'cart_test','guest:cart_test')).rejects.toThrow('Resolve the online payment')
 expect(sessionRun).not.toHaveBeenCalled(); expect(completeApprovedCart).not.toHaveBeenCalled()
})
test('stock/workflow failure preserves the session and never reports success',async () => {
 ;(completeApprovedCart as jest.Mock).mockRejectedValueOnce(new Error('Stock unavailable'))
 await expect(confirmCod(scope,'cart_test','guest:cart_test')).rejects.toThrow('Stock unavailable')
 expect(sessions).toEqual([{provider_id:'pp_system'}])
})
