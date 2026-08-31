import { MedusaService } from "@medusajs/framework/utils"
import Theme from "./models/theme"
import ProductTheme from "./models/product-theme"
import ProductMetadata from "./models/product-metadata"

class YounoyaThemesModuleService extends MedusaService({
  Theme,
  ProductTheme,
  ProductMetadata,
}) {}

export default YounoyaThemesModuleService
