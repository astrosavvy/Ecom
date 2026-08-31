import { model } from "@medusajs/framework/utils"

const RecommendationRule = model.define("recommendation_rule", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  priority: model.number().default(0),
  active: model.boolean().default(true),
  conditions: model.json(),
  actions: model.json(),
  version: model.number().default(1),
})

export default RecommendationRule
