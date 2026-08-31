import { Module } from "@medusajs/framework/utils"
import YounoyaThemesModuleService from "./service"

export const YOUNOYA_THEMES_MODULE = "younoyaThemes"

export default Module(YOUNOYA_THEMES_MODULE, {
  service: YounoyaThemesModuleService,
})
