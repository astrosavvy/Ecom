import crypto from "crypto"
import { CommerceError, database, enqueue, transaction, operationId } from "./db"
import { readOrder, shipment } from "./orders"
import { settings } from "./settings"
import { queueEmail } from "./emails"
const dispatched = ["picked_up", "in_transit", "delivered", "returned"]
export async function requestAfterSale(scope: any, id: string, customer: string, input: any) {
  if (!["cancellation","damaged","defective","incorrect"].includes(input.kind) || typeof input.reason !== "string" || input.reason.trim().length < 10 || input.reason.length > 2000)
    throw new CommerceError("Select a request type and describe the issue in 10–2000 characters")
  const order = await readOrder(scope,id,customer)
  const delivery = await shipment(id)
  if (order.status === "canceled") throw new CommerceError("This order is already cancelled", 409)
  if (input.kind === "cancellation" && (dispatched.includes(delivery?.status) || order.fulfillments?.some((f: any) => f.shipped_at)))
    throw new CommerceError("This order has dispatched. Please contact support for help.", 409)
  const s = await settings()
  const deadline = delivery?.delivered_at && new Date(delivery.delivered_at).getTime() + (s.published?.damageReportHours || 0) * 3600000
  const outsideWindow = input.kind !== "cancellation" && deadline && Date.now() > deadline
  const request = await transaction(`commerce:${id}`,async client => {
    const existing = (await client.query("select * from commerce_request where order_id=$1 and status not in ('rejected','refunded','closed')",[id])).rows[0]
    if (existing) return existing
    const record = { id: `creq_${crypto.randomUUID().replace(/-/g,"")}`, kind: input.kind, reason: input.reason.trim(),
      data: { outsideWindow: !!outsideWindow, policyRevision: s.revision } }
    await client.query("insert into commerce_request(id,order_id,customer_id,kind,reason,data) values ($1,$2,$3,$4,$5,$6)",
      [record.id,id,customer,record.kind,record.reason,JSON.stringify(record.data)])
    return { ...record, status: "requested" }
  })
  await queueEmail(id, `request:${request.id}`, "Request received", `Request ${request.id}: ${request.kind}\n${request.reason}\nThe atelier will review your request. This receipt does not confirm cancellation or refund.`)
  return request
}
export async function decideRequest(scope: any, orderId: string, input: any, actor: string) {
  await readOrder(scope,orderId)
  if (!["reject","approve_return","refund","cancel"].includes(input.action)) throw new CommerceError("Invalid request action")
  return transaction(`commerce:${orderId}`,async client => {
    const request = (await client.query("select * from commerce_request where id=$1 and order_id=$2 for update",[input.request_id,orderId])).rows[0]
    if (!request) throw new CommerceError("Request not found",404)
    if (!["requested","return_approved","received"].includes(request.status)) throw new CommerceError("This request was already handled",409)
    if (input.action === "cancel" && (await client.query("select id from commerce_operation where order_id=$1 and status='processing' and kind in ('create_shipping','awb','pickup','track')",[orderId])).rowCount)
      throw new CommerceError("A shipping operation is in progress. Wait for its result before approving cancellation.",409)
    const data = { ...request.data, actor, reviewed_at: new Date().toISOString(), reply: String(input.reply || "").slice(0,2000) }
    if (input.action === "approve_return" && (!data.reply || request.kind === "cancellation")) throw new CommerceError("Provide return instructions for this item")
    let status = input.action === "reject" ? "rejected" : input.action === "approve_return" ? "return_approved" : "processing"
    if (["refund","cancel"].includes(input.action)) {
      if (input.action === "cancel" && request.kind !== "cancellation") throw new CommerceError("Use refund for a product issue")
      const id = `request:${request.id}`
      await client.query("insert into commerce_operation(id,kind,order_id,payload) values ($1,$2,$3,$4) on conflict(id) do nothing",
        [operationId(id),input.action === "cancel" ? "cancel_refund" : "refund",orderId,JSON.stringify({ requestId: request.id, actor, amount: input.amount, received: input.received === true })])
      if (input.action === "refund" && (!Number.isSafeInteger(input.amount) || input.amount <= 0 || input.received !== true))
        throw new CommerceError("Enter the refund amount in paise and confirm the issue/return was verified")
    }
    await client.query("update commerce_request set status=$2,data=$3,updated_at=now() where id=$1",[request.id,status,JSON.stringify(data)])
    return { id: request.id, status, data }
  })
}
