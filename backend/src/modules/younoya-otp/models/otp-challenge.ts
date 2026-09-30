import { model } from "@medusajs/framework/utils"

const OtpChallenge = model.define("otp_challenge", {
  id: model.id().primaryKey(),
  identifier: model.text(),
  identifier_type: model.enum(["mobile", "email"]).default("mobile"),
  otp_hash: model.text(),
  salt: model.text(),
  attempts: model.number().default(0),
  max_attempts: model.number().default(5),
  expires_at: model.dateTime(),
  consumed_at: model.dateTime().nullable(),
  ip_address: model.text().nullable(),
  status: model.enum(["pending", "verified", "expired", "rate_limited"]).default("pending"),
})

export default OtpChallenge
