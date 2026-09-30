import { MedusaService } from "@medusajs/framework/utils"
import OtpChallenge from "./models/otp-challenge"
import OtpRateLimit from "./models/otp-rate-limit"

class YounoyaOtpModuleService extends MedusaService({
  OtpChallenge,
  OtpRateLimit,
}) {}

export default YounoyaOtpModuleService
