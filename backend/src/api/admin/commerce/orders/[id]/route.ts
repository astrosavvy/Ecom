import { commerceRoute } from "../../../../utils/commerce"
import { details } from "../../../../../modules/younoya-commerce/orders"
import { operations } from "../../../../../modules/younoya-commerce/db"
export const GET = commerceRoute(async req => ({ ...await details(req.scope,req.params.id), operations: await operations(req.params.id) }))
