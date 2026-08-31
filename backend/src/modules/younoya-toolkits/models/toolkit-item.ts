import { model } from "@medusajs/framework/utils"

const ToolkitItem = model.define("toolkit_item", {
  id: model.id().primaryKey(),
  toolkit_id: model.text(),
  product_id: model.text(),
  product_handle: model.text().nullable(),
  product_title: model.text().nullable(),
  role: model.text().default("supporting"),
  selection_rationale: model.text().nullable(),
  score: model.number().default(0),
  display_order: model.number().default(0),
})

export default ToolkitItem
