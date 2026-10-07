import { model } from "@medusajs/framework/utils"
export default model.define("commerce_operation", { id: model.id().primaryKey(), kind: model.text(), order_id: model.text().default(""),
  payload: model.json(), status: model.text().default("queued"), result: model.json().nullable(), error: model.text().nullable() })
