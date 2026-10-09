import { commerceRoute } from "../../../../../utils/commerce"
import { CommerceError, database, enqueue } from "../../../../../../modules/younoya-commerce/db"
import { readOrder } from "../../../../../../modules/younoya-commerce/orders"
import { decideRequest } from "../../../../../../modules/younoya-commerce/after-sales"
import { processOperation } from "../../../../../../modules/younoya-commerce/worker"
export const POST = commerceRoute(async req => {
  const id = req.params.id, body = req.body
  await readOrder(req.scope,id)
  if (["reject","approve_return","refund","cancel"].includes(body.action)) return { request: await decideRequest(req.scope,id,body,(req as any).auth_context.actor_id) }
  if (["reconcile","retry"].includes(body.action)) {
    const op = (await database().query("select * from commerce_operation where id=$1 and order_id=$2",[body.operation_id,id])).rows[0]
    if (!op || !["held","reconcile"].includes(op.status)) throw new CommerceError("Operation cannot be reconciled",409)
    if (body.action === "retry" && op.result?.noEffect !== true) throw new CommerceError("An uncertain operation cannot be replayed",409)
    // Reconciliation can read provider state, but cannot replay an uncertain mutation.
    await database().query("update commerce_operation set status=$2 where id=$1 and status in ('held','reconcile')",[op.id,body.action === "retry" ? "queued" : "reconcile"])
    await processOperation(req.scope,op.id)
    return { operation_id: op.id }
  }
  const kinds: any = { create: ["create_shipping",`ship:${id}`], awb: ["awb",`awb:${id}`], pickup: ["pickup",`pickup:${id}`],
    cancel_shipping: ["cancel_shipping",`cancel-shipping:${id}`], document: ["document",`document:${id}:${body.document}`] }
  if (!kinds[body.action] || (body.action === "awb" && (!Number.isSafeInteger(body.courier_id) || body.courier_id <= 0)) ||
    (body.action === "document" && !["label","invoice","manifest"].includes(body.document))) throw new CommerceError("Invalid shipping action")
  const [kind,key] = kinds[body.action]
  const operation = await enqueue(kind,key,{ courierId: body.courier_id, document: body.document, pickupDate: body.pickup_date },id)
  return { operation_id: operation, status: "queued" }
})
