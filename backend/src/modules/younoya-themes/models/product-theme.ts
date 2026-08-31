import { model } from "@medusajs/framework/utils"

const ProductTheme = model.define("product_theme", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  theme_id: model.text(),
  priority: model.text().default("medium"),
})

export default ProductTheme
