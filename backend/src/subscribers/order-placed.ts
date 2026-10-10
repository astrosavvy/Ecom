import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { enqueue } from "../modules/younoya-commerce/db"
import { queueEmail } from "../modules/younoya-commerce/emails"
import { readOrder } from "../modules/younoya-commerce/orders"
export default async function orderPlacedHandler({ event, container }: SubscriberArgs<{ id: string }>) {
  const order = await readOrder(container,event.data.id)
  if (!order.metadata?.commerce_approval) return
  await enqueue("create_shipping",`ship:${order.id}`,{},order.id)
  await queueEmail(order.id,"confirmation","Order received",order.metadata.commerce_approval.payment_method === 'cod'
    ? 'Your Cash on Delivery order has been received. Payment is due on delivery, including ₹49 COD handling. It has not shipped yet.'
    : "Your order has been received. Dispatch will follow captured payment and courier pickup approval; it has not shipped yet.")
}
export const config: SubscriberConfig = { event: "order.placed" }
