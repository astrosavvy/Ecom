import { MedusaService } from "@medusajs/framework/utils"
import Toolkit from "./models/toolkit"
import ToolkitItem from "./models/toolkit-item"
import RecommendationRule from "./models/recommendation-rule"

class YounoyaToolkitsModuleService extends MedusaService({
  Toolkit,
  ToolkitItem,
  RecommendationRule,
}) {}

export default YounoyaToolkitsModuleService
