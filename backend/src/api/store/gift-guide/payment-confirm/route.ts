import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import Razorpay from "razorpay"
import { getCustomerId } from "../../../utils/auth"
import { validRazorpaySignature } from "../../../../modules/younoya-razorpay/service"
import { completedOrder } from "../../../../modules/younoya-commerce/orders"
import { exclusive, minor } from "../../../../modules/younoya-commerce/db"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Sign in to continue" })
  const cartId = String(req.query.cartId ?? "")
  if (!/^cart_[a-zA-Z0-9]+$/.test(cartId)) return res.status(400).json({ message: "Invalid cart" })
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data } = await query.graph({ entity: "cart", fields: ["id", "customer_id", "completed_at"], filters: { id: cartId } })
  if (!data[0] || data[0].customer_id !== customerId) return res.status(403).json({ message: "Cart not found for this account" })
  let order: any = null
  if (data[0].completed_at) {
    order = await completedOrder(req.scope,cartId)
  }
  return res.json({ owned: true, completed: Boolean(data[0].completed_at), order })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Sign in before ordering" })
  const body = (req.body ?? {}) as Record<string, string>
  const { cartId, sessionId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body
  if (![cartId, sessionId, orderId, paymentId, signature].every((value) => typeof value === "string" && value.length < 150)) {
    return res.status(400).json({ message: "Invalid payment response" })
  }
  const keyId = process.env.RAZORPAY_KEY_ID
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !secret) return res.status(503).json({ message: "Payments are not configured" })
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
    const { data: carts } = await query.graph({ entity: "cart", fields: ["id", "customer_id", "total", "currency_code",
      "shipping_address.country_code", "payment_collection.id", "completed_at"], filters: { id: cartId } })
    const cart = carts[0]
    if (!cart || cart.customer_id !== customerId) return res.status(403).json({ message: "Cart not found for this account" })
    if (cart.completed_at) {
      return res.json({ verified: true, completed: true, order: await completedOrder(req.scope,cartId) })
    }
    if (cart.currency_code !== "inr" || cart.shipping_address?.country_code !== "in") {
      return res.status(400).json({ message: "Only India INR orders are supported" })
    }
    const paymentModule = req.scope.resolve(Modules.PAYMENT) as any
    const session = await paymentModule.retrievePaymentSession(sessionId)
    if (session.provider_id !== "pp_razorpay_razorpay" || session.payment_collection_id !== cart.payment_collection?.id ||
        session.data?.id !== orderId || minor(session.amount) !== minor(cart.total)) {
      return res.status(400).json({ message: "Payment does not match this cart" })
    }
    if (!validRazorpaySignature(String(session.data.id), paymentId, signature, secret)) return res.status(400).json({ message: "Payment verification failed" })
    if (session.data?.razorpay_payment_id && session.data.razorpay_payment_id !== paymentId) {
      return res.status(409).json({ message: "A different payment is already linked to this order" })
    }
    const razorpay = new Razorpay({ key_id: keyId, key_secret: secret, timeout: 12000 } as any)
    const payment: any = await razorpay.payments.fetch(paymentId)
    if (payment.order_id !== orderId || payment.currency !== "INR" || Number(payment.amount) !== Number(session.amount) ||
        !["authorized", "captured"].includes(payment.status)) {
      return res.status(400).json({ message: "Payment amount or status could not be verified" })
    }
    const linked = await exclusive(`session:${sessionId}`,async () => {
      const current = await paymentModule.retrievePaymentSession(sessionId)
      if (current.data?.razorpay_payment_id && current.data.razorpay_payment_id !== paymentId) return false
      if (!current.data?.razorpay_payment_id) await paymentModule.updatePaymentSession({ id: current.id, amount: current.amount,
        currency_code: current.currency_code, data: { ...current.data, razorpay_payment_id: paymentId, razorpay_signature: signature } })
      return true
    })
    if (!linked) return res.status(409).json({ message: "A different payment is already linked to this order" })
    return res.json({ verified: true })
  } catch (error) {
    return res.status(503).json({ message: "Payment verification is temporarily unavailable. Your payment can be checked again safely." })
  }
}
