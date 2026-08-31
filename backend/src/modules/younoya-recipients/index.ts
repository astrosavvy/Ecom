import { Module } from "@medusajs/framework/utils"
import YounoyaRecipientsModuleService from "./service"

export const YOUNOYA_RECIPIENTS_MODULE = "younoyaRecipients"

export default Module(YOUNOYA_RECIPIENTS_MODULE, {
  service: YounoyaRecipientsModuleService,
})
