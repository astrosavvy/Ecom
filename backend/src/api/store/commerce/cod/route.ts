import { commerceRoute } from '../../../utils/commerce'
import { checkoutOwner } from '../../../../modules/younoya-commerce/guest'
import { confirmCod } from '../../../../modules/younoya-commerce/cod'
export const POST = commerceRoute(async req => confirmCod(req.scope,req.body.cart_id,await checkoutOwner(req,req.body.cart_id)))
