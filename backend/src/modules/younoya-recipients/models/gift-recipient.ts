import { model } from "@medusajs/framework/utils"

const GiftRecipient = model.define("gift_recipient", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  name: model.text(),
  relationship: model.text().default("friend"),
  dob: model.text().nullable(),
  birth_time: model.text().nullable(),
  birth_place: model.text().nullable(),
  birth_time_unknown: model.boolean().default(false),
  saved_preferences: model.json().nullable(),
  astrological_profile: model.json().nullable(),
  notes: model.text().nullable(),
})

export default GiftRecipient
