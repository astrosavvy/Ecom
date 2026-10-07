import { model } from "@medusajs/framework/utils"
export default model.define("commerce_setting", { id: model.id().primaryKey(), data: model.json(),
  published: model.json().nullable(), revision: model.text().nullable() })
