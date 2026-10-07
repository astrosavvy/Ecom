import { model } from "@medusajs/framework/utils"
export default model.define("commerce_request", { id: model.id().primaryKey(), order_id: model.text(), customer_id: model.text(),
  kind: model.text(), reason: model.text(), status: model.text().default("requested"), data: model.json() })
