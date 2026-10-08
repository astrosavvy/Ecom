import {commerceRoute} from '../../../utils/commerce'
import {lookupPincode} from '../../../../modules/younoya-commerce/pincode'
export const GET=commerceRoute(async req=>lookupPincode(String(req.query.pincode||'')))
