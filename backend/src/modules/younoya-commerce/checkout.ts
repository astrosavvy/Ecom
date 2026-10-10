import crypto from "crypto"
import { Modules } from "@medusajs/framework/utils"
import { CommerceError, toPaise } from "./db"
import { readCart } from "./orders"
import { pack } from "./packing"
import { requireLive } from "./settings"
import { shiprocket } from "./shiprocket"
import { addShippingMethodToCartWorkflow, refreshPaymentCollectionForCartWorkflow } from '@medusajs/medusa/core-flows'
import { COD_FEE, checkoutMethod, deliveryInfo } from './delivery'
import { lookupPincode } from './pincode'
const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key,canonical(value[key])])) : value
export function cartFingerprint(cart: any) {
  return crypto.createHash("sha256").update(JSON.stringify(canonical({ id: cart.id, items: (cart.items || []).map((i: any) => [i.variant_id,i.quantity,i.total]).sort(),
    total: toPaise(cart.total), address: cart.shipping_address, email: cart.email, currency: cart.currency_code,
    ...(cart.metadata?.commerce_payment_method ? { method: cart.metadata.commerce_payment_method, fee: cart.metadata.cod_fee } : {}) }))).digest("hex")
}
export function approvalSignature(approval: any) {
  if (!process.env.JWT_SECRET) throw new CommerceError("Checkout signing is not configured",503)
  const { signature, ...value } = approval
  return crypto.createHmac("sha256",process.env.JWT_SECRET).update(JSON.stringify(canonical(value))).digest("hex")
}
export function validApproval(approval: any) {
  if (!approval || typeof approval.signature !== "string" || !/^[a-f\d]{64}$/.test(approval.signature)) return false
  return crypto.timingSafeEqual(Buffer.from(approval.signature,"hex"),Buffer.from(approvalSignature(approval),"hex"))
}
export async function serviceability(scope: any, cartId: string, customer: string, revision: string, requestedMethod?: unknown) {
  const s = await requireLive()
  const method = checkoutMethod(requestedMethod)
  if (method === 'cod' && !s.draft.codShippingOptionId) throw new CommerceError('Cash on Delivery is being configured',409)
  let cart = await readCart(scope,cartId,customer)
  if (cart.payment_collection?.id) {
    const sessions = await scope.resolve(Modules.PAYMENT).listPaymentSessions({ payment_collection_id: cart.payment_collection.id })
    if (sessions.some((p: any) => p.provider_id.includes('razorpay')))
      throw new CommerceError('A payment is already prepared. Resolve it before changing the order or payment method.',409)
  }
  if (cart.metadata?.commerce_requote_required || cart.metadata?.money_unit !== 'inr-major-v2')
    throw new CommerceError('Reopen checkout to calculate current prices. Your bag and address are preserved.',409)
  if (cart.completed_at || cart.currency_code !== "inr" || cart.shipping_address?.country_code !== "in") throw new CommerceError("Only uncompleted India INR carts are supported")
  if (revision !== s.revision) throw new CommerceError("Please review and accept the current policies", 409)
  if (!/^[1-9]\d{5}$/.test(cart.shipping_address?.postal_code || "")) throw new CommerceError("Enter a valid India PIN code")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cart.email || "")) throw new CommerceError("An email address is required for order updates")
  const address = cart.shipping_address
  if (["first_name","address_1","city","province"].some(key => typeof address[key] !== "string" || !address[key].trim() || address[key].length > 200)
    || !/^(?:\+?91)?[6-9]\d{9}$/.test(String(address.phone || "").replace(/[\s()-]/g,"")))
    throw new CommerceError("Enter a complete delivery address and a valid Indian mobile number")
  const parcel = pack(cart.items,s.draft)
  const couriers = await shiprocket.serviceability(s.draft.pickupPincode,cart.shipping_address.postal_code,parcel.weightKg,parcel,method === 'cod')
  if (!couriers.length) throw new CommerceError("Delivery is unavailable for this PIN code. Your selection is still saved.", 409)
  const cartModule = scope.resolve(Modules.CART)
  await cartModule.updateCarts(cartId, { metadata: { ...cart.metadata, commerce_approval: null, commerce_payment_method: method, cod_fee: method === 'cod' ? COD_FEE : 0 } })
  const optionId = method === 'cod' ? s.draft.codShippingOptionId : s.draft.shippingOptionId
  await addShippingMethodToCartWorkflow(scope).run({ input: { cart_id: cartId, options: [{ id: optionId }] } })
  cart = await readCart(scope,cartId,customer)
  // Product promotions remain intact. The fixed handling charge cannot be discounted.
  const adjustmentIds = (cart.shipping_methods || []).flatMap((m: any) => (m.adjustments || []).map((a: any) => a.id))
  if (adjustmentIds.length) await cartModule.deleteShippingMethodAdjustments(adjustmentIds)
  await refreshPaymentCollectionForCartWorkflow(scope).run({ input: { cart_id: cartId } })
  cart = await readCart(scope,cartId,customer)
  validateShippingFee(cart, optionId, method)
  let delivery = deliveryInfo({},method,new Date(),s.draft)
  try { delivery = deliveryInfo(await lookupPincode(address.postal_code),method,new Date(),s.draft) } catch { /* No regional promise on an uncertain postal location. */ }
  const approval = { money_unit: "inr-major-v2", revision: s.revision, customer_id: customer, accepted_at: new Date().toISOString(),
    payment_method: method, cod_fee: method === 'cod' ? COD_FEE : 0, delivery,
    fingerprint: cartFingerprint(cart), parcel, shipping: { pickupName: s.draft.pickupName, pickupPincode: s.draft.pickupPincode,
      stockLocationId: s.draft.stockLocationId, hsn: s.draft.hsn,
      variantHsns:Object.fromEntries(cart.items.map((item: any) => [item.variant_id,s.draft.variants.find((v: any) => v.id===item.variant_id)?.hsn || s.draft.hsn])) }, valid_until: new Date(Date.now()+15*60000).toISOString() }
  await scope.resolve(Modules.CART).updateCarts(cartId, { metadata: { ...cart.metadata, commerce_approval: { ...approval, signature: approvalSignature(approval) } } })
  return { cart: await readCart(scope,cartId,customer), payment_method: method, cod_fee: method === 'cod' ? COD_FEE : 0, delivery,
    shipping_option_id: optionId, shipping_fee: 0, dispatch_hours: s.draft.dispatchHours,
    delivery_min_days: s.draft.deliveryMinDays, delivery_max_days: s.draft.deliveryMaxDays }
}
export function validateShippingFee(cart: any, optionId: string, method: string) {
  const fee = method === 'cod' ? COD_FEE : 0
  const shipping = cart.shipping_methods?.[0]
  if (cart.shipping_methods?.length !== 1 || shipping.shipping_option_id !== optionId ||
    toPaise(shipping.amount) !== fee * 100 || toPaise(shipping.total ?? shipping.amount) !== fee * 100 ||
    (shipping.adjustments || []).length || (fee && shipping.is_tax_inclusive !== true))
    throw new CommerceError('Delivery and handling charges need recalculation',409)
}
export async function validatePreparedCart(scope: any, cartId: string, customer?: string) {
  const s = await requireLive()
  const cart = await readCart(scope,cartId,customer)
  const approval = cart.metadata?.commerce_approval
  if (!validApproval(approval) || (approval.customer_id !== `guest:${cart.id}` && approval.customer_id !== cart.customer_id) || approval.revision !== s.revision ||
    new Date(approval.valid_until).getTime() < Date.now() || approval.fingerprint !== cartFingerprint(cart))
    throw new CommerceError("Please review delivery and the current policies again", 409)
  const method = checkoutMethod(approval.payment_method)
  validateShippingFee(cart,method === 'cod' ? s.draft.codShippingOptionId : s.draft.shippingOptionId,method)
  if (method === 'cod' && (approval.cod_fee !== COD_FEE || cart.metadata.commerce_payment_method !== 'cod' || cart.metadata.cod_fee !== COD_FEE))
    throw new CommerceError('Cash on Delivery approval is invalid',409)
  return cart
}
