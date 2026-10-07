import { ContainerRegistrationKeys, Modules, PaymentActions } from "@medusajs/framework/utils"
import { cancelOrderWorkflow, cancelOrderFulfillmentWorkflow, createOrderFulfillmentWorkflow, createOrderShipmentWorkflow,
  markOrderFulfillmentAsDeliveredWorkflow, processPaymentWorkflow, refundPaymentWorkflow } from "@medusajs/medusa/core-flows"
import { claim, CommerceError, database, enqueue, finish, minor, operationId, exclusive } from "./db"
import { validApproval, cartFingerprint } from './checkout'
import { readOrder, readCart, setShipment, shipment } from "./orders"
import { assignAwb, bookPickup, cancelShipping, createShipping, documents, providerOrder, trackingStatus } from "./shipping-operations"
import { razorpayRequest, refundContext } from "./razorpay"
import { queueEmail, sendOrderEmail } from "./emails"
import { ProviderError, shiprocket } from "./shiprocket"
import { settings } from "./settings"
import { completeApprovedCart } from "./completion"
async function paymentEvent(scope: any, op: any) {
  const payment = await razorpayRequest(`/payments/${op.payload.paymentId}`)
  const order = await razorpayRequest(`/orders/${payment.order_id}`)
  if (payment.currency !== "INR" || minor(payment.amount) !== minor(order.amount) || !order.notes?.medusa_session_id) throw new CommerceError("Payment event mismatch")
  // Failed/authorized notifications may arrive after capture; use the current authoritative status.
  if (payment.status !== "captured") return { ignored: true }
  const module = scope.resolve(Modules.PAYMENT)
  const session = await module.retrievePaymentSession(order.notes.medusa_session_id)
  if (session.data?.id !== order.id || session.currency_code !== "inr" || minor(session.amount) !== minor(payment.amount)) throw new CommerceError("Payment session mismatch")
  await exclusive(`session:${session.id}`,async () => {
    const current = await module.retrievePaymentSession(session.id)
    if (current.data?.razorpay_payment_id && current.data.razorpay_payment_id !== payment.id) throw new CommerceError("Payment is already bound to another transaction",409)
    await module.updatePaymentSession({ id: current.id, amount: current.amount, currency_code: current.currency_code,
      data: { ...current.data, razorpay_payment_id: payment.id } })
  })
  const { data: links } = await scope.resolve(ContainerRegistrationKeys.QUERY).graph({ entity: "cart_payment_collection", fields: ["cart_id"], filters: { payment_collection_id: session.payment_collection_id } })
  if (!links[0]?.cart_id) throw new CommerceError("Captured payment is not linked to a cart")
  await exclusive(`complete:${links[0].cart_id}`,async () => {
    const cart = await readCart(scope,links[0].cart_id)
    if (!cart.completed_at && (!validApproval(cart.metadata?.commerce_approval) || cart.metadata.commerce_approval.fingerprint !== cartFingerprint(cart)))
      throw new CommerceError("Paid cart changed after delivery approval; manual resolution required",409)
    await processPaymentWorkflow(scope).run({ input: { action: PaymentActions.SUCCESSFUL, data: { session_id: session.id, amount: payment.amount } } })
    if (!cart.completed_at) await completeApprovedCart(scope,cart.id)
  })
  return { captured: true }
}
async function ensureFulfillment(scope: any, id: string) {
  const order = await readOrder(scope,id)
  if (order.fulfillments?.some((f: any) => !f.canceled_at)) return
  await createOrderFulfillmentWorkflow(scope).run({ input: { order_id: id, location_id: order.metadata.commerce_approval.shipping.stockLocationId,
    items: order.items.map((i: any) => ({ id: i.id, quantity: i.quantity })), no_notification: true } })
}
async function track(scope: any, id: string) {
  const delivery = await shipment(id)
  if (!delivery?.data?.awb || ["cancelled","returned","delivered"].includes(delivery.status)) return {}
  const response = await shiprocket.get(`/courier/track/awb/${encodeURIComponent(delivery.data.awb)}`)
  const tracking = response.tracking_data
  if (!tracking || Number(tracking.track_status) !== 1) throw new ProviderError(true)
  const row = tracking.shipment_track?.[0]
  const status = trackingStatus(row?.current_status)
  if (status === "unknown") return { status: delivery.status }
  const order = await readOrder(scope,id)
  const fulfillment = order.fulfillments?.find((f: any) => !f.canceled_at)
  if (["picked_up","in_transit","delivered","returned"].includes(status) && fulfillment && !fulfillment.shipped_at)
    await createOrderShipmentWorkflow(scope).run({ input: { order_id: id, fulfillment_id: fulfillment.id,
      items: order.items.map((i: any) => ({ id: i.id, quantity: i.quantity })), labels: [{ tracking_number: delivery.data.awb,
        tracking_url: `https://shiprocket.co/tracking/${encodeURIComponent(delivery.data.awb)}`, label_url: delivery.data.documents?.label || "" }], no_notification: true } as any })
  if (status === "delivered" && fulfillment && !fulfillment.delivered_at)
    await markOrderFulfillmentAsDeliveredWorkflow(scope).run({ input: { orderId: id, fulfillmentId: fulfillment.id } })
  await setShipment(id,status,{ tracking: { status: row.current_status, updatedAt: new Date().toISOString(), estimatedDelivery: tracking.etd || null } })
  if (status !== delivery.status) await queueEmail(id,`shipping:${status}`,"Delivery update",`Your shipment status is ${status.replace(/_/g," ")}. Tracking number: ${delivery.data.awb}`)
  return { status }
}
async function afterSale(scope: any, op: any) {
  const request = (await database().query("select * from commerce_request where id=$1",[op.payload.requestId])).rows[0]
  if (!request || request.order_id !== op.order_id) throw new CommerceError("Request not found")
  if (request.status === "refunded") return request.data
  let order = await readOrder(scope,op.order_id)
  if (op.kind === "cancel_refund") {
    if (order.fulfillments?.some((f: any) => f.shipped_at)) throw new CommerceError("Order already dispatched",409)
    await cancelShipping(op.order_id,op.status === "reconcile")
    for (const f of order.fulfillments || []) if (!f.canceled_at)
      await cancelOrderFulfillmentWorkflow(scope).run({ input: { order_id: order.id, fulfillment_id: f.id } })
  }
  const payment = order.payment_collections?.flatMap((c: any) => c.payments || []).find((p: any) => p.captured_at)
  if (!payment) throw new CommerceError("Captured payment is required")
  const amount = op.kind === "cancel_refund" ? minor(payment.amount)-(payment.refunds || []).reduce((n: number,r: any) => n+minor(r.amount),0) : minor(op.payload.amount)
  const recorded = payment.refunds?.find((r: any) => r.note === op.id)
  if (!recorded) {
    if (amount <= 0) throw new CommerceError("There is no remaining refundable amount")
    await refundContext.run(op.id,() => refundPaymentWorkflow(scope).run({ context: { transactionId: operationId(`medusa-refund:${op.id}`) },
      input: { payment_id: payment.id, amount, created_by: op.payload.actor, note: op.id } }))
  }
  const refundOp = (await database().query("select * from commerce_operation where id=$1",[operationId(`refund:${op.id}`)])).rows[0]
  if (!refundOp?.result?.id) throw new CommerceError("Refund confirmation is pending",409)
  const refund = await razorpayRequest(`/refunds/${refundOp.result.id}`)
  const status = refund.status === "processed" ? "refunded" : refund.status === "failed" ? "refund_failed" : "refund_pending"
  const data = { ...request.data, refundId: refund.id, refundAmount: amount || refund.amount, refundStatus: refund.status }
  await database().query("update commerce_request set status=$2,data=$3,updated_at=now() where id=$1",[request.id,status,JSON.stringify(data)])
  if (op.kind === "cancel_refund" && order.status !== "canceled") {
    // The refund is already recorded, so the standard cancellation workflow cannot submit it a second time.
    await cancelOrderWorkflow(scope).run({ input: { order_id: order.id } })
  }
  await queueEmail(order.id,`refund:${refund.id}:${status}`,"Request update",`Your request ${request.id} is ${status.replace(/_/g," ")}. Refund reference: ${refund.id}.`)
  return data
}
export async function processOperation(scope: any, id: string) {
  const op = await claim(id)
  if (!op) return
  try {
    let result: any
    if (op.kind === "payment_event") result = await paymentEvent(scope,op)
    else if (op.kind === "create_shipping") result = await createShipping(scope,op)
    else if (op.kind === "awb") result = await assignAwb(scope,op)
    else if (op.kind === "pickup") { result = await bookPickup(scope,op); await ensureFulfillment(scope,op.order_id) }
    else if (op.kind === "cancel_shipping") result = await cancelShipping(op.order_id,op.status === "reconcile")
    else if (["cancel_refund","refund"].includes(op.kind)) result = await afterSale(scope,op)
    else if (op.kind === "document") result = await documents(op.order_id,op.payload.document)
    else if (op.kind === "track") result = await track(scope,op.order_id)
    else if (op.kind === "email") {
      if (op.status === "reconcile") throw new CommerceError("Email outcome uncertain; check delivery before retrying",409)
      result = await sendOrderEmail(scope,op)
    } else throw new CommerceError("Unknown operation type; manual review required",409)
    await finish(id,result)
  } catch (error) {
    // Mutations are held after uncertain outcomes. Staff can reconcile the same operation; never create a replacement.
    const uncertain = error instanceof ProviderError ? error.uncertain : !(error instanceof CommerceError)
    await finish(id,{ noEffect: error instanceof ProviderError && !error.uncertain },uncertain ? "reconcile" : "held",error instanceof CommerceError ? error.message : "Provider operation requires review. No automatic duplicate request was made.")
  }
}
export async function runCommerceWorker(scope: any) {
  await database().query(`update commerce_operation set status='reconcile',updated_at=now() where status='processing' and updated_at < now()-interval '5 minutes'`)
  const s = await settings()
  if (process.env.COMMERCE_LIVE_ENABLED === "true" && s.draft.shiprocketReady) {
    const candidates = (await database().query(`select id from "order" o where deleted_at is null and status <> 'canceled'
      and metadata->'commerce_approval' is not null and not exists(select 1 from commerce_operation p where p.order_id=o.id and p.kind='create_shipping') order by created_at limit 20`)).rows
    for (const row of candidates) {
      const order = await readOrder(scope,row.id)
      if (!order.payment_collections?.some((c: any) => c.payments?.some((p: any) => p.captured_at))) continue
      await enqueue("create_shipping",`ship:${order.id}`,{},order.id)
      await queueEmail(order.id,"confirmation","Order confirmed","Your payment is confirmed. We will prepare your selection for dispatch; pickup has not yet occurred.")
    }
    const deliveries = (await database().query("select order_id from commerce_shipment where status not in ('delivered','cancelled','returned') and data->>'awb' is not null order by updated_at limit 10")).rows
    for (const d of deliveries) await enqueue("track",`track:${d.order_id}:${Math.floor(Date.now()/900000)}`,{},d.order_id)
  }
  const refunds = (await database().query("select * from commerce_request where status='refund_pending' order by updated_at limit 10")).rows
  for (const r of refunds) {
    const result = await razorpayRequest(`/refunds/${r.data.refundId}`)
    if (["processed","failed"].includes(result.status)) {
      const status = result.status === "processed" ? "refunded" : "refund_failed"
      await database().query("update commerce_request set status=$2,data=data || $3::jsonb,updated_at=now() where id=$1",[r.id,status,JSON.stringify({ refundStatus: result.status })])
      await queueEmail(r.order_id,`refund:${result.id}:${status}`,"Refund update",`Your request ${r.id} is ${status.replace(/_/g," ")}. Reference: ${result.id}.`)
    }
  }
  const ops = (await database().query(`select id from commerce_operation where status in ('queued','reconcile') and kind not in ('razorpay_order','razorpay_refund')
    order by created_at limit 10`)).rows
  for (const op of ops) await processOperation(scope,op.id)
}
