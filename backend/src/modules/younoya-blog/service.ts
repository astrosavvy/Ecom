import { MedusaService } from "@medusajs/framework/utils"
import BlogPost from "./models/blog-post"

class YounoyaBlogModuleService extends MedusaService({ BlogPost }) {}

export default YounoyaBlogModuleService
