import { model } from "@medusajs/framework/utils"
export default model.define("commerce_shipment", { id: model.id().primaryKey(), order_id: model.text().unique(),
  data: model.json(), status: model.text().default("paid"), delivered_at: model.dateTime().nullable() })
