import { model } from "@medusajs/framework/utils"

const OtpRateLimit = model.define("otp_rate_limit", {
  id: model.id().primaryKey(),
  identifier: model.text(),
  identifier_type: model.text(),
  request_count: model.number().default(1),
  window_start: model.dateTime(),
  window_minutes: model.number().default(60),
})

export default OtpRateLimit
