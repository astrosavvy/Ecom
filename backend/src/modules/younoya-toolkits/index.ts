import { Module } from "@medusajs/framework/utils"
import YounoyaToolkitsModuleService from "./service"

export const YOUNOYA_TOOLKITS_MODULE = "younoyaToolkits"

export default Module(YOUNOYA_TOOLKITS_MODULE, {
  service: YounoyaToolkitsModuleService,
})
