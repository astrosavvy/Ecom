import { MedusaService } from "@medusajs/framework/utils"
import AstroProfile from "./models/astro-profile"

class YounoyaAstroModuleService extends MedusaService({
  AstroProfile,
}) {}

export default YounoyaAstroModuleService
