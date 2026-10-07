import { commerceRoute } from "../../utils/commerce"
import { publicSettings } from "../../../modules/younoya-commerce/settings"
export const GET = commerceRoute(async () => publicSettings())
