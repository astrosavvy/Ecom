import { model } from "@medusajs/framework/utils"

const Toolkit = model.define("toolkit", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  recipient_profile_id: model.text().nullable(),
  type: model.text().default("general"),
  status: model.text().default("generated"),
  recipient_name: model.text().nullable(),
  recipient_relationship: model.text().nullable(),
  intents: model.json().nullable(),
  occasion: model.text().nullable(),
  gift_message: model.text().nullable(),
  personalised_explanation: model.text().nullable(),
  astro_snapshot: model.json().nullable(),
})

export default Toolkit
