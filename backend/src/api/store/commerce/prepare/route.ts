import { commerceRoute } from "../../../utils/commerce"
import { checkoutOwner } from '../../../../modules/younoya-commerce/guest'
import { serviceability } from "../../../../modules/younoya-commerce/checkout"
import { exclusive } from '../../../../modules/younoya-commerce/db'
export const POST = commerceRoute(async req => exclusive(`complete:${req.body.cart_id}`,async () =>
 serviceability(req.scope,req.body.cart_id,await checkoutOwner(req,req.body.cart_id),req.body.policy_revision,req.body.payment_method)))
