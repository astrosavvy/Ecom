import { commerceRoute, commerceCustomer } from "../../../../../utils/commerce"
import { getCustomerId } from "../../../../../utils/auth"
import { requestAfterSale } from "../../../../../../modules/younoya-commerce/after-sales"
export const POST = commerceRoute(async req => ({ request: await requestAfterSale(req.scope,req.params.id,commerceCustomer(req)!,req.body) }))
