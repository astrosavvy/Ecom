import { Modules } from "@medusajs/framework/utils"
import { completeCartWorkflowId } from "@medusajs/medusa/core-flows"
import { CommerceError, database, exclusive, operationId } from "./db"
import { approvalSignature, cartFingerprint, validApproval, validatePreparedCart } from "./checkout"
import { toPaise, sessionPaise } from './db'
import { deliveryInfo } from './delivery'
import { completedOrder, readCart } from "./orders"

// Browser completion and webhook recovery resume the same persisted Medusa workflow.
export async function completeApprovedCart(scope: any, id: string, customer?: string, allowCod = false) {
  return exclusive(`complete:${id}`,async () => {
    const cart = await readCart(scope,id,customer)
    if (cart.completed_at) {
      const existing = await completedOrder(scope,id)
      if (existing) return existing
      throw new CommerceError("Order confirmation is being reconciled. Please do not pay again.",409)
    }
    if (!validApproval(cart.metadata?.commerce_approval) || cart.metadata.commerce_approval.fingerprint !== cartFingerprint(cart))
      throw new CommerceError("Your selection changed after delivery approval. Please contact support before paying again.",409)
    const cod = cart.metadata.commerce_approval.payment_method === 'cod'
    if (cod && !allowCod) throw new CommerceError('Confirm Cash on Delivery through checkout',409)
    if (cod) await validatePreparedCart(scope,id,customer)
    if (!cart.payment_collection?.id) throw new CommerceError('Payment preparation is required before order confirmation',409)
    const sessions = await scope.resolve(Modules.PAYMENT).listPaymentSessions({ payment_collection_id: cart.payment_collection.id })
    const session = sessions.find((p: any) => p.provider_id === (cod ? 'pp_system' : 'pp_razorpay_razorpay'))
    if (!session || (cod ? toPaise(session.amount) : sessionPaise(session.amount,session.data)) !==
      sessionPaise(cart.total,{ money_unit: cart.metadata.commerce_approval.money_unit || cart.metadata.money_unit }) || session.currency_code !== 'inr')
      throw new CommerceError('Payment total needs review before order confirmation',409)
    if (cod && sessions.some((p: any) => p.provider_id.includes('razorpay'))) throw new CommerceError('Resolve the online payment first',409)
    if (cart.metadata.commerce_approval.delivery) {
      const old = cart.metadata.commerce_approval
      const delivery = deliveryInfo({state:old.delivery.regional ? 'Delhi' : ''},cod ? 'cod' : 'razorpay')
      if (delivery.message !== old.delivery.message) {
        const approval = {...old,delivery}; approval.signature = approvalSignature(approval)
        await scope.resolve(Modules.CART).updateCarts(id,{metadata:{...cart.metadata,commerce_approval:approval}})
      }
    }
    const shippingMethod = cart.shipping_methods?.[0]
    if (shippingMethod?.shipping_option_id) {
      await database().query(`
        INSERT INTO product_shipping_profile (id, product_id, shipping_profile_id, created_at, updated_at)
        SELECT 'prodsp_' || p.id, p.id, so.shipping_profile_id, NOW(), NOW()
        FROM cart_line_item cli
        JOIN product_variant pv ON pv.id = cli.variant_id
        JOIN product p ON p.id = pv.product_id
        JOIN shipping_option so ON so.id = $2
        WHERE cli.cart_id = $1
        ON CONFLICT (product_id, shipping_profile_id) DO UPDATE SET deleted_at = NULL, updated_at = NOW()
      `, [id, shippingMethod.shipping_option_id]).catch(() => void 0)
    }
    const execution = await scope.resolve(Modules.WORKFLOW_ENGINE).run(completeCartWorkflowId, {
      transactionId: operationId(`complete-cart:${id}`), input: { id }, throwOnError: false,
    })
    if (execution.errors?.length || !execution.transaction?.hasFinished())
      throw new CommerceError("Order confirmation is being reconciled. Your selection and payment are preserved; please do not pay again.",409)
    const order = await completedOrder(scope,id)
    if (!order) throw new CommerceError("Order confirmation is pending. Please do not pay again.",409)
    return order
  })
}
