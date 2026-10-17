import { commerceRoute } from '../../../../../utils/commerce'
import { ritualAvailability } from '../../../../../../modules/younoya-commerce/ritual-products'
export const GET = commerceRoute(req => ritualAvailability(req.scope,req.params.handle))
