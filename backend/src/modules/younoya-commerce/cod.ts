import { createPaymentCollectionForCartWorkflow, createPaymentSessionsWorkflow } from '@medusajs/medusa/core-flows'
import { CommerceError, exclusive } from './db'
import { validatePreparedCart } from './checkout'
import { completeApprovedCart } from './completion'
import { completedOrder, readCart } from './orders'
export async function confirmCod(scope: any, cartId: string, owner: string) {
  return exclusive(`complete:${cartId}`,async () => {
    let cart = await readCart(scope,cartId,owner)
    if (cart.completed_at) {
      const order = await completedOrder(scope,cartId)
      if (order) return { order }
      throw new CommerceError('Order confirmation is pending. Please retry this order.',409)
    }
    cart = await validatePreparedCart(scope,cartId,owner)
    if (cart.metadata.commerce_approval.payment_method !== 'cod') throw new CommerceError('Cash on Delivery must be selected',409)
    if (!cart.payment_collection?.id) {
      await createPaymentCollectionForCartWorkflow(scope).run({ input: { cart_id: cartId } })
      cart = await readCart(scope,cartId,owner)
    }
    // Existing authorized sessions are reused during retry/restart recovery.
    const payment = scope.resolve('payment')
    const sessions = await payment.listPaymentSessions({ payment_collection_id: cart.payment_collection.id })
    if (sessions.some((p: any) => p.provider_id.includes('razorpay'))) throw new CommerceError('Resolve the online payment first',409)
    if (!sessions.some((p: any) => p.provider_id === 'pp_system'))
      await createPaymentSessionsWorkflow(scope).run({ input: { payment_collection_id: cart.payment_collection.id,
        provider_id: 'pp_system', data: { money_unit: 'inr-major-v2', payment_method: 'cod' } } })
    return { order: await completeApprovedCart(scope,cartId,owner,true) }
  })
}
