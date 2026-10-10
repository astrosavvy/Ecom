import {commerceRoute} from '../../../utils/commerce'
import {lookupPincode} from '../../../../modules/younoya-commerce/pincode'
import { deliveryInfo } from '../../../../modules/younoya-commerce/delivery'
export const GET=commerceRoute(async req=> {
 const location = await lookupPincode(String(req.query.pincode||''))
 return { ...location, delivery: deliveryInfo(location) }
})
