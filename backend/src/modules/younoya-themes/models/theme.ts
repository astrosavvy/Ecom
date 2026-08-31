import { model } from "@medusajs/framework/utils"

const Theme = model.define("theme", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text(),
  description: model.text().nullable(),
  icon: model.text().default("✦"),
  category: model.text().default("lifestyle"),
  sort_order: model.number().default(0),
  active: model.boolean().default(true),
})

export default Theme
