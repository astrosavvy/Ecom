import { Module } from "@medusajs/framework/utils"
import YounoyaOtpModuleService from "./service"

export const YOUNOYA_OTP_MODULE = "younoyaOtp"

export default Module(YOUNOYA_OTP_MODULE, {
  service: YounoyaOtpModuleService,
})
