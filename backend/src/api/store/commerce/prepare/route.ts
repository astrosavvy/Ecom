import { commerceRoute, commerceCustomer } from "../../../utils/commerce"
import { getCustomerId } from "../../../utils/auth"
import { serviceability } from "../../../../modules/younoya-commerce/checkout"
export const POST = commerceRoute(async req => serviceability(req.scope,req.body.cart_id,commerceCustomer(req)!,req.body.policy_revision))
