import { Module } from "@medusajs/framework/utils"
import YounoyaBlogModuleService from "./service"

export const YOUNOYA_BLOG_MODULE = "younoyaBlog"

export default Module(YOUNOYA_BLOG_MODULE, {
  service: YounoyaBlogModuleService,
})
