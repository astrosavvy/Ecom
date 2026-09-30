import { model } from "@medusajs/framework/utils"

const AstroProfile = model.define("astro_profile", {
  id: model.id().primaryKey(),
  owner_customer_id: model.text(),
  full_name: model.text(),
  relationship: model.text().default("self"),
  is_self: model.boolean().default(true),
  phone: model.text().nullable(),
  dob: model.text(),
  tob: model.text().nullable(),
  pob: model.text().nullable(),
  pob_lat: model.number().nullable(),
  pob_lng: model.number().nullable(),
  pob_tz: model.text().default("Asia/Kolkata"),
  sun_sign: model.text(),
  moon_sign: model.text(),
  nakshatra: model.text().nullable(),
  nakshatra_index: model.number().default(0),
  element: model.text(),
  ruling_planet: model.text(),
  chart: model.json().nullable(),
})

export default AstroProfile
