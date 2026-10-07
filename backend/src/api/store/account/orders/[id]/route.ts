import { commerceRoute, commerceCustomer } from "../../../../utils/commerce"
import { getCustomerId } from "../../../../utils/auth"
import { details } from "../../../../../modules/younoya-commerce/orders"
export const GET = commerceRoute(async req => details(req.scope,req.params.id,commerceCustomer(req)!))
