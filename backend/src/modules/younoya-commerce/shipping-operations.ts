import { CommerceError, rupees, database, orderPaise } from "./db"
import { pack } from "./packing"
import { readOrder, setShipment, shipment } from "./orders"
import { razorpayRequest } from "./razorpay"
import { shiprocket, ProviderError } from "./shiprocket"
import { settings } from "./settings"
import { validApproval } from "./checkout"
export function trackingStatus(raw: unknown) {
  const status = String(raw || "").toLowerCase().replace(/[^a-z]/g,"")
  if (status.includes("rtodelivered") || status.includes("returned")) return "returned"
  if (status === "delivered") return "delivered"
  if (status.includes("cancel")) return "cancelled"
  if (status.includes("pickup") && (status.includes("scheduled") || status.includes("generated"))) return "booked"
  if (status.includes("pickedup")) return "picked_up"
  if (["intransit","outfordelivery","reached","shipped","rtotransit"].some(s => status.includes(s))) return "in_transit"
  if (["new","awbassigned","pickupqueued"].includes(status)) return "booked"
  return "unknown"
}
export const externalOrderId = (id: string) => `YN-${id}`
export async function shipOrder(scope: any, id: string) {
  const order = await readOrder(scope,id)
  if ((await database().query("select id from commerce_request where order_id=$1 and kind='cancellation' and status in ('processing','refund_pending','refunded')",[id])).rowCount)
    throw new CommerceError("Cancellation is being processed; dispatch is blocked",409)
  if (order.status === "canceled" || !validApproval(order.metadata?.commerce_approval)) throw new CommerceError("Order is not approved for shipping")
  const payment = order.payment_collections?.flatMap((p: any) => p.payments || []).find((p: any) => p.captured_at)
  if (!payment?.data?.razorpay_payment_id) throw new CommerceError("Captured payment is required",409)
  const verified = await razorpayRequest(`/payments/${payment.data.razorpay_payment_id}`)
  if (verified.status !== "captured" || verified.currency !== "INR" || Number(verified.amount) !== orderPaise(order.total,order) || Number(verified.amount_refunded))
    throw new CommerceError("Payment needs review before dispatch",409)
  return order
}
async function findExternal(id: string) {
  const response = await shiprocket.get(`/orders?search=${encodeURIComponent(externalOrderId(id))}`)
  if (!Array.isArray(response.data)) throw new ProviderError(true)
  const found = response.data.filter((o: any) => String(o.channel_order_id || o.order_id) === externalOrderId(id))
  if (found.length > 1) throw new CommerceError("Multiple shipping records require manual review",409)
  return found[0] || null
}
export function orderPayload(order: any, s: any) {
  const a = order.shipping_address
  const parcel = order.metadata?.commerce_approval?.parcel || pack(order.items,s)
  if (a?.country_code !== "in" || !order.email || !a.phone || !a.first_name) throw new CommerceError("India shipping contact information is incomplete")
  const items: any[] = []
  for (const item of order.items) {
    const hsn = s.variantHsns?.[item.variant_id] || s.variants?.find((v: any) => v.id===item.variant_id)?.hsn || s.hsn
    if (!/^(?:\d{4}|\d{6}|\d{8})$/.test(hsn || "")) throw new CommerceError("Verified invoice classification is required")
    const total = orderPaise(item.total,order), quantity = Number(item.quantity)
    if (!Number.isSafeInteger(total) || !Number.isInteger(quantity) || quantity < 1) throw new CommerceError("Invalid shipping item amount")
    // Split a remainder across two lines rather than introduce rounding errors when converting paise to rupees.
    const base = Math.floor(total/quantity), extra = total%quantity
    for (const [units, price, suffix] of [[quantity-extra,base,""],[extra,base+1,"-r"]] as const) if (units) items.push({
      name: item.title, sku: `${item.variant_sku || item.variant_id || item.id}${suffix}`, units, selling_price: rupees(price), hsn,
    })
  }
  const sum = items.reduce((n,i) => n+Math.round(i.selling_price*100)*i.units,0)
  if (sum !== orderPaise(order.total,order)) throw new CommerceError("Shipping invoice total does not match the paid order")
  return { order_id: externalOrderId(order.id), order_date: new Date(new Date(order.created_at).getTime()+19800000).toISOString().slice(0,16).replace("T"," "),
    pickup_location: s.pickupName, billing_customer_name: a.first_name, billing_last_name: a.last_name || "",
    billing_address: a.address_1, billing_address_2: a.address_2 || "", billing_city: a.city, billing_pincode: a.postal_code,
    billing_state: a.province, billing_country: "India", billing_email: order.email, billing_phone: a.phone,
    shipping_is_billing: true, order_items: items, payment_method: "Prepaid", shipping_charges: 0,
    sub_total: rupees(orderPaise(order.total,order)), length: parcel.lengthCm, breadth: parcel.widthCm, height: parcel.heightCm, weight: parcel.weightKg }
}
export async function createShipping(scope: any, op: any) {
  const existing = await shipment(op.order_id)
  if (existing?.data?.shiprocketOrderId) return existing.data
  const found = await findExternal(op.order_id)
  let result = found
  if (!found) {
    if (op.status === "reconcile") throw new CommerceError("Shipping creation is uncertain; verify the merchant order ID in Shiprocket before resolving.",409)
    const order = await shipOrder(scope,op.order_id)
    const s = await settings()
    result = await shiprocket.post("/orders/create/adhoc",orderPayload(order,{ ...s.draft,...order.metadata.commerce_approval.shipping }))
  }
  const shiprocketOrderId = Number(result.order_id || result.id), shipmentId = Number(result.shipment_id || result.shipments?.id || result.shipments?.[0]?.id)
  if (!Number.isSafeInteger(shiprocketOrderId) || shiprocketOrderId <= 0 || !Number.isSafeInteger(shipmentId) || shipmentId <= 0) throw new ProviderError(true)
  const data = { shiprocketOrderId, shipmentId, merchantOrderId: externalOrderId(op.order_id) }
  await setShipment(op.order_id,"booked",data); return data
}
export async function providerOrder(id: string) {
  const delivery = await shipment(id)
  if (!delivery?.data?.shiprocketOrderId) throw new CommerceError("Create the shipping order first",409)
  const response = await shiprocket.get(`/orders/show/${delivery.data.shiprocketOrderId}`)
  if (!response.data) throw new ProviderError(true)
  return { delivery, data: response.data, raw: response.data.shipments?.[0] || response.data.shipments || response.data }
}
export async function assignAwb(scope: any, op: any) {
  const order = await shipOrder(scope,op.order_id)
  const { delivery, raw } = await providerOrder(op.order_id)
  if (delivery.status === "cancelled") throw new CommerceError("Shipping order was cancelled",409)
  let data = raw
  if (!raw.awb && !raw.awb_code && !delivery.data.awb) {
    if (op.status === "reconcile") throw new CommerceError("AWB assignment needs provider reconciliation",409)
    const approval = order.metadata.commerce_approval
    const quotes = await shiprocket.serviceability(approval.shipping.pickupPincode,order.shipping_address.postal_code,approval.parcel.weightKg,approval.parcel)
    if (!quotes.some((q: any) => Number(q.courier_company_id) === op.payload.courierId)) throw new CommerceError("Select a currently available courier")
    const result = await shiprocket.post("/courier/assign/awb", { shipment_id: delivery.data.shipmentId, courier_id: op.payload.courierId })
    if (Number(result.awb_assign_status) !== 1) throw new ProviderError(true)
    data = result.response?.data
  }
  const awb = data?.awb_code || data?.awb || delivery.data.awb
  if (!awb || !/^[a-zA-Z0-9-]{5,50}$/.test(String(awb))) throw new ProviderError(true)
  const result = { awb: String(awb), courier: data.courier_name || delivery.data.courier || "", courierId: op.payload.courierId }
  await setShipment(op.order_id,"booked",result); return result
}
export async function bookPickup(scope: any, op: any) {
  await shipOrder(scope,op.order_id)
  const { delivery, raw } = await providerOrder(op.order_id)
  if (!delivery.data.awb || delivery.status === "cancelled") throw new CommerceError("Assign an AWB before booking pickup",409)
  if (raw.pickup_scheduled_date || delivery.data.pickupScheduled) {
    const recovered = { ...delivery.data,pickupScheduled:true,pickupDate:raw.pickup_scheduled_date || delivery.data.pickupDate || null }
    await setShipment(op.order_id,delivery.status,recovered)
    return recovered
  }
  if (op.status === "reconcile") throw new CommerceError("Pickup outcome is uncertain; reconcile it in Shiprocket before resolving",409)
  const pickupPayload: any = { shipment_id: [delivery.data.shipmentId] }
  if (op.payload?.pickupDate) pickupPayload.pickup_date = [op.payload.pickupDate]
  const result = await shiprocket.post("/courier/generate/pickup", pickupPayload)
  if (Number(result.pickup_status) !== 1) throw new ProviderError(true)
  await setShipment(op.order_id,"booked",{ pickupScheduled: true, pickupDate: result.response?.pickup_scheduled_date || op.payload?.pickupDate || null })
  return { pickupScheduled: true }
}
export async function cancelShipping(id: string, reconcile = false) {
  const delivery = await shipment(id)
  if (!delivery?.data?.shiprocketOrderId || delivery.status === "cancelled") return { cancelled: true }
  const { raw, data } = await providerOrder(id)
  const state = trackingStatus([raw.current_status,raw.status,data.status].find(s => typeof s === "string"))
  if (["picked_up","in_transit","delivered","returned","unknown"].includes(state)) throw new CommerceError("Confirm shipment status before cancellation; dispatched shipments cannot be cancelled",409)
  if (state !== "cancelled") {
    if (reconcile) throw new CommerceError("Cancellation needs provider reconciliation",409)
    const result = await shiprocket.post("/orders/cancel",{ ids: [delivery.data.shiprocketOrderId] })
    if (!result.success) {
      const check = await providerOrder(id)
      if (trackingStatus([check.raw.current_status,check.raw.status,check.data.status].find(s => typeof s === "string")) !== "cancelled") throw new ProviderError(true)
    }
  }
  await setShipment(id,"cancelled",{}); return { cancelled: true }
}
export async function documents(id: string, kind: string) {
  const delivery = await shipment(id)
  if (!delivery?.data?.awb) throw new CommerceError("Assign an AWB before requesting documents",409)
  const spec: any = { label: ["/courier/generate/label",{ shipment_id: [delivery.data.shipmentId] },"label_url"],
    invoice: ["/orders/print/invoice",{ ids: [delivery.data.shiprocketOrderId] },"invoice_url"],
    manifest: ["/manifests/generate",{ shipment_id: [delivery.data.shipmentId] },"manifest_url"] }
  if (!spec[kind]) throw new CommerceError("Invalid document")
  const [path,body,key] = spec[kind]
  const result = await shiprocket.post(path,body)
  let url = result[key]
  if (kind === "manifest" && !url) url = (await shiprocket.post("/manifests/print",{ order_ids: [delivery.data.shiprocketOrderId] })).manifest_url
  if (typeof url !== "string" || !url.startsWith("https://")) throw new ProviderError(true)
  await setShipment(id,delivery.status,{ documents: { ...delivery.data.documents,[kind]: url } }); return { [kind]: url }
}
