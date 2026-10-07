import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import service from "./service"
export default ModuleProvider(Modules.FULFILLMENT, { services: [service] })
