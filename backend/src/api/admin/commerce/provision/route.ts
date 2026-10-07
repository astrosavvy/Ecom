import { commerceRoute } from "../../../utils/commerce"
import { provision } from "../../../../modules/younoya-commerce/provision"
export const POST = commerceRoute(async req => provision(req.scope))
