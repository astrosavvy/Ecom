import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { CommerceError } from "../../modules/younoya-commerce/db"
import { validatePreparedCart } from "../../modules/younoya-commerce/checkout"
import { completeApprovedCart } from "../../modules/younoya-commerce/completion"
import { checkoutOwner } from '../../modules/younoya-commerce/guest'
export async function checkoutGuard(req: any, res: any, next: any) {
  try {
    const id = (req.originalUrl || req.url).match(/payment-collections\/([^/]+)\/payment-sessions/)?.[1]
    if (!id) throw new CommerceError("Payment collection not found",404)
    const { data } = await req.scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity: "cart_payment_collection",
      fields: ["cart_id"], filters: { payment_collection_id: id } })
    if (!data[0]?.cart_id) throw new CommerceError("Cart not found",404)
    const cart = await validatePreparedCart(req.scope,data[0].cart_id,await checkoutOwner(req,data[0].cart_id))
    if (cart.metadata.commerce_approval.payment_method === 'cod' || !/^pp_razorpay_razorpay$/.test(req.body?.provider_id || ''))
      throw new CommerceError('Use the approved checkout payment method',409)
    next()
  } catch (error) { return res.status(error instanceof CommerceError ? error.status : 503).json({ message: error instanceof CommerceError ? error.message : "Checkout validation is unavailable" }) }
}
export async function completionGuard(req: any, res: any, _next: any) {
  try {
    const id = (req.originalUrl || req.url).match(/carts\/([^/]+)\/complete/)?.[1]
    const order = await completeApprovedCart(req.scope,id,await checkoutOwner(req,id))
    return res.status(200).json({ type: "order", order })
  } catch (error) { if (!res.headersSent) return res.status(error instanceof CommerceError ? error.status : 503).json({ message: error instanceof CommerceError ? error.message : "Order completion is being reconciled; your payment is preserved" }) }
}
export function operationGuard(_req: any, res: any) {
  return res.status(409).json({ message: "Use the commerce order operations panel for cancellation, refunds and dispatch." })
}
