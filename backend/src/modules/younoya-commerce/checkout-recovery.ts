import { Modules } from '@medusajs/framework/utils'
import { completeCartWorkflowId } from '@medusajs/medusa/core-flows'
import { CommerceError, exclusive, operationId } from './db'
import { completedOrder, readCart } from './orders'

// Read-only, under the same lock as confirmation. Any attempted completion or
// payment session is uncertain until reconciled; never create a replacement order.
export async function checkoutStatus(scope: any, cartId: string, owner: string) {
  return exclusive(`complete:${cartId}`, async () => {
    const cart = await readCart(scope,cartId,owner)
    const order = await completedOrder(scope,cartId)
    if (order) return { owned:true, completed:true, order, restart_allowed:false }
    if (cart.completed_at) return { owned:true, completed:true, order:null, restart_allowed:false }
    const executions = await scope.resolve(Modules.WORKFLOW_ENGINE).listWorkflowExecutions({
      workflow_id:completeCartWorkflowId, transaction_id:operationId(`complete-cart:${cartId}`),
    }, { take:1 })
    const payments = cart.payment_collection?.id
      ? await scope.resolve(Modules.PAYMENT).listPaymentSessions({ payment_collection_id:cart.payment_collection.id }) : []
    const restartAllowed = executions.length === 0 && payments.length === 0
    return { owned:true, completed:false, order:null, restart_allowed:restartAllowed, ...(restartAllowed ? { cart } : {}),
      message:restartAllowed ? 'Please review your details and continue with online payment.'
        : 'Your previous order attempt needs review. Your bag and address are saved. Contact support before placing another order.' }
  })
}

export async function requireUnattemptedCart(scope: any, cartId: string, owner: string) {
  const status = await checkoutStatus(scope,cartId,owner)
  if (!status.restart_allowed) throw new CommerceError(('message' in status && status.message) || 'Your previous order is being recovered. Please do not place another order.',409)
}
