import crypto from "crypto"
import { Modules } from "@medusajs/framework/utils"
import { CommerceError, minor } from "./db"
import { readCart } from "./orders"
import { pack } from "./packing"
import { requireLive } from "./settings"
import { shiprocket } from "./shiprocket"
const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key,canonical(value[key])])) : value
export function cartFingerprint(cart: any) {
  return crypto.createHash("sha256").update(JSON.stringify(canonical({ id: cart.id, items: (cart.items || []).map((i: any) => [i.variant_id,i.quantity,i.total]).sort(),
    total: minor(cart.total), address: cart.shipping_address, email: cart.email, currency: cart.currency_code }))).digest("hex")
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
export async function serviceability(scope: any, cartId: string, customer: string, revision: string) {
  const s = await requireLive()
  const cart = await readCart(scope,cartId,customer)
  if (cart.completed_at || cart.currency_code !== "inr" || cart.shipping_address?.country_code !== "in") throw new CommerceError("Only uncompleted India INR carts are supported")
  if (revision !== s.revision) throw new CommerceError("Please review and accept the current policies", 409)
  if (!/^[1-9]\d{5}$/.test(cart.shipping_address?.postal_code || "")) throw new CommerceError("Enter a valid India PIN code")
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cart.email || "")) throw new CommerceError("An email address is required for order updates")
  const address = cart.shipping_address
  if (["first_name","address_1","city","province"].some(key => typeof address[key] !== "string" || !address[key].trim() || address[key].length > 200)
    || !/^(?:\+?91)?[6-9]\d{9}$/.test(String(address.phone || "").replace(/[\s()-]/g,"")))
    throw new CommerceError("Enter a complete delivery address and a valid Indian mobile number")
  const parcel = pack(cart.items,s.draft)
  const couriers = await shiprocket.serviceability(s.draft.pickupPincode,cart.shipping_address.postal_code,parcel.weightKg,parcel)
  if (!couriers.length) throw new CommerceError("Delivery is unavailable for this PIN code. Your selection is still saved.", 409)
  const approval = { revision: s.revision, customer_id: customer, accepted_at: new Date().toISOString(),
    fingerprint: cartFingerprint(cart), parcel, shipping: { pickupName: s.draft.pickupName, pickupPincode: s.draft.pickupPincode,
      stockLocationId: s.draft.stockLocationId, hsn: s.draft.hsn,
      variantHsns:Object.fromEntries(cart.items.map((item: any) => [item.variant_id,s.draft.variants.find((v: any) => v.id===item.variant_id)?.hsn || s.draft.hsn])) }, valid_until: new Date(Date.now()+15*60000).toISOString() }
  await scope.resolve(Modules.CART).updateCarts(cartId, { metadata: { ...cart.metadata, commerce_approval: { ...approval, signature: approvalSignature(approval) } } })
  return { shipping_option_id: s.draft.shippingOptionId, shipping_fee: 0, dispatch_hours: s.draft.dispatchHours,
    delivery_min_days: s.draft.deliveryMinDays, delivery_max_days: s.draft.deliveryMaxDays }
}
export async function validatePreparedCart(scope: any, cartId: string, customer?: string) {
  const s = await requireLive()
  const cart = await readCart(scope,cartId,customer)
  const approval = cart.metadata?.commerce_approval
  if (!validApproval(approval) || approval.customer_id !== cart.customer_id || approval.revision !== s.revision ||
    new Date(approval.valid_until).getTime() < Date.now() || approval.fingerprint !== cartFingerprint(cart))
    throw new CommerceError("Please review delivery and the current policies again", 409)
  if (cart.shipping_methods?.length !== 1 || cart.shipping_methods[0].shipping_option_id !== s.draft.shippingOptionId ||
    Number(cart.shipping_methods[0].amount) !== 0) throw new CommerceError("Free India delivery must be selected")
  return cart
}
