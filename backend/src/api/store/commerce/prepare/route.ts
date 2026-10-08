import { commerceRoute } from "../../../utils/commerce"
import { checkoutOwner } from '../../../../modules/younoya-commerce/guest'
import { serviceability } from "../../../../modules/younoya-commerce/checkout"
export const POST = commerceRoute(async req => serviceability(req.scope,req.body.cart_id,await checkoutOwner(req,req.body.cart_id),req.body.policy_revision))
