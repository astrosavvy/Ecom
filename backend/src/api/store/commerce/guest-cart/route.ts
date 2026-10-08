import { commerceRoute } from '../../../utils/commerce'
import { requireLive } from '../../../../modules/younoya-commerce/settings'
import { createGuestAccess, guestRate } from '../../../../modules/younoya-commerce/guest'
import { CommerceError } from '../../../../modules/younoya-commerce/db'
import { createCartWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'
export const POST=commerceRoute(async req=>{
 await requireLive();await guestRate(req.ip||'unknown')
 const input=req.body as any
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>30 || input.items.some((i:any)=>typeof i.variant_id!=='string'||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>10))
  throw new CommerceError('Please check the items in your bag')
 const region=await (req.scope.resolve(Modules.REGION) as any).retrieveRegion(input.region_id,{relations:['countries']})
 if(region.currency_code!=='inr'||!region.countries.some((c:any)=>c.iso_2==='in')) throw new CommerceError('India delivery only')
 const {data:variants}=await (req.scope.resolve('query') as any).graph({entity:'product_variant',fields:['id','product.status','product.metadata'],filters:{id:input.items.map((item:any)=>item.variant_id)}})
 if(input.items.some((item:any)=>{
  const product=variants.find((variant:any)=>variant.id===item.variant_id)?.product
  return !product||product.status!=='published'||product.metadata?.gift_guide_approved===false||
   (product.metadata?.product_kind==='ritual-box'&&product.metadata?.navratri_release_approved!==true)
 })) throw new CommerceError('One of these pieces is not available to order yet',409)
 const {result:cart}=await createCartWorkflow(req.scope).run({input:{region_id:region.id,items:input.items,metadata:{money_unit:'inr-major-v2'}}})
 return {cart,checkout_token:await createGuestAccess(cart.id)}
})
