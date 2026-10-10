import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { CommerceError, database, orderPaise, rupees } from "./db"
export const orderFields = ["id", "display_id", "customer_id", "email", "created_at", "status", "total", "currency_code", "metadata",
  "items.*", "shipping_address.*", "shipping_methods.*", "payment_collections.payments.*",
  "payment_collections.payments.refunds.*", "fulfillments.*"]
export async function readOrder(scope: any, id: string, customer?: string) {
  if (!/^order_[a-zA-Z0-9]+$/.test(id)) throw new CommerceError("Order not found", 404)
  const { data } = await scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity: "order", fields: orderFields, filters: { id } })
  const order = data[0]
  if (!order || (customer && order.customer_id !== customer)) throw new CommerceError("Order not found", 404)
  return order
}
export async function readCart(scope: any, id: string, customer?: string) {
  if (!/^cart_[a-zA-Z0-9]+$/.test(id)) throw new CommerceError("Cart not found", 404)
  const { data } = await scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity: "cart", fields: ["id", "customer_id", "email", "total",
    "currency_code", "metadata", "completed_at", "items.*", "shipping_address.*", "shipping_methods.*", "shipping_methods.adjustments.*", "payment_collection.*"], filters: { id } })
  const cart = data[0]
  if (!cart || (customer && (customer.startsWith('guest:') ? customer !== `guest:${cart.id}` : cart.customer_id !== customer))) throw new CommerceError("Cart not found", 404)
  return cart
}
export async function completedOrder(scope: any, cartId: string) {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: links } = await query.graph({ entity: "order_cart", fields: ["order_id"], filters: { cart_id: cartId } })
  if (!links[0]?.order_id) return null
  const { data } = await query.graph({ entity: "order", fields: ["id","display_id","total","metadata"], filters: { id: links[0].order_id } })
  return data[0] ? { ...data[0], total: rupees(orderPaise(data[0].total,data[0])), money_unit: 'inr-major-v2' } : null
}
export async function shipment(id: string) {
  return (await database().query("select * from commerce_shipment where order_id=$1", [id])).rows[0] || null
}
export async function setShipment(id: string, status: string, data: any) {
  await database().query(`insert into commerce_shipment(id,order_id,status,data,delivered_at) values ($1,$1,$2,$3,case when $2='delivered' then now() else null end)
    on conflict(order_id) do update set status=$2,data=commerce_shipment.data || $3::jsonb,updated_at=now(),
      delivered_at=case when $2='delivered' then coalesce(commerce_shipment.delivered_at,now()) else commerce_shipment.delivered_at end`, [id,status,JSON.stringify(data)])
}
export async function details(scope: any, id: string, customer?: string) {
  const order = await readOrder(scope,id,customer)
  const requests = (await database().query("select id,kind,reason,status,data,created_at from commerce_request where order_id=$1 order by created_at desc",[id])).rows
  const payments = order.payment_collections?.flatMap((p: any) => p.payments || []) || []
  const captured = payments.filter((p: any) => p.captured_at)
  const paid = captured.reduce((n: number,p: any) => n+Number(p.amount),0)
  const refunded = captured.reduce((n: number,p: any) => n+(p.refunds || []).reduce((sum: number,r: any) => sum+Number(r.amount),0),0)
  const cod = order.metadata?.commerce_approval?.payment_method === 'cod'
  const paymentStatus = cod ? 'due_on_delivery' : refunded ? refunded >= paid ? "refunded" : "partially_refunded" : captured.length ? "captured" : "pending"
  const safeOrder = { id: order.id, display_id: order.display_id, created_at: order.created_at, status: order.status,
    total: rupees(orderPaise(order.total,order)), money_unit: 'inr-major-v2', payment_method: cod ? 'cod' : 'razorpay', cod_fee: cod ? 49 : 0,
    delivery: order.metadata?.commerce_approval?.delivery, currency_code: order.currency_code, items: order.items.map((i: any) => ({ id: i.id,title: i.title,quantity: i.quantity,total: rupees(orderPaise(i.total,order)),thumbnail: i.thumbnail })), shipping_address: order.shipping_address, payment_status: order.status === 'canceled' ? 'cancelled' : paymentStatus }
  const delivery = await shipment(id)
  const publicRequests = requests.map(r => ({ ...r, data: { reply: r.data?.reply, outsideWindow: r.data?.outsideWindow,
    refundId: r.data?.refundId, refundAmount: r.data?.refundAmount == null ? null : rupees(orderPaise(r.data.refundAmount,order)), refundStatus: r.data?.refundStatus } }))
  return { order: safeOrder, shipment: delivery ? { status: delivery.status, data: { awb: delivery.data.awb,
    courier: delivery.data.courier, documents: delivery.data.documents || {}, tracking: delivery.data.tracking || null }, delivered_at: delivery.delivered_at } : null, requests: customer ? publicRequests : requests }
}
