import { commerceRoute } from '../../../utils/commerce'
import { requireLive } from '../../../../modules/younoya-commerce/settings'
import { createGuestAccess, guestRate } from '../../../../modules/younoya-commerce/guest'
import { CommerceError } from '../../../../modules/younoya-commerce/db'
import { createCartWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'
import { readCart } from '../../../../modules/younoya-commerce/orders'
import { requireReleasedItems } from '../../../../modules/younoya-commerce/ritual-products'
export const POST=commerceRoute(async req=>{
 await requireLive();await guestRate(req.ip||'unknown')
 const input=req.body as any
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>30 || input.items.some((i:any)=>typeof i.variant_id!=='string'||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>10))
  throw new CommerceError('Please check the items in your bag')
 const region=await (req.scope.resolve(Modules.REGION) as any).retrieveRegion(input.region_id,{relations:['countries']})
 if(region.currency_code!=='inr'||!region.countries.some((c:any)=>c.iso_2==='in')) throw new CommerceError('India delivery only')
 await requireReleasedItems(req.scope,input.items)
 const {result:cart}=await createCartWorkflow(req.scope).run({input:{region_id:region.id,items:input.items,metadata:{money_unit:'inr-major-v2'}}})
 const populated = await readCart(req.scope,cart.id).catch(() => cart)
 return {cart:populated,checkout_token:await createGuestAccess(cart.id)}
})
