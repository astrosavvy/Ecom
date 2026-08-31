import { model } from "@medusajs/framework/utils"

const ProductMetadata = model.define("product_metadata", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  editorial_story: model.text().nullable(),
  symbolic_significance: model.text().nullable(),
  materials: model.text().nullable(),
  dimensions: model.text().nullable(),
  care_instructions: model.text().nullable(),
  suitable_for: model.json().nullable(),
  symbolic_associations: model.json().nullable(),
  seo_title: model.text().nullable(),
  meta_description: model.text().nullable(),
  clean_url: model.text().nullable(),
})

export default ProductMetadata
