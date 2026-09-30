import { Module } from "@medusajs/framework/utils"
import YounoyaAstroModuleService from "./service"

export const YOUNOYA_ASTRO_MODULE = "younoyaAstro"

export default Module(YOUNOYA_ASTRO_MODULE, {
  service: YounoyaAstroModuleService,
})
