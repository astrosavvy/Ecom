import crypto from 'crypto'
import { CommerceError, database, transaction } from './db'
import { readCart } from './orders'
const digest=(value:string)=>crypto.createHash('sha256').update(value).digest('hex')
export async function guestRate(ip:string) {
  const id=`guest-rate:${digest(ip)}`
  await transaction(id,async client=>{
    const previous=(await client.query('select data from commerce_setting where id=$1',[id])).rows[0]?.data
    const now=Date.now(),count=previous?.until>now ? previous.count+1 : 1
    if(count>20) throw new CommerceError('Please wait before starting another checkout',429)
    await client.query(`insert into commerce_setting(id,data) values($1,$2) on conflict(id) do update set data=$2,updated_at=now()`,[id,JSON.stringify({count,until:previous?.until>now?previous.until:now+3600000})])
  })
}
export async function createGuestAccess(cartId:string) {
  const token=crypto.randomBytes(32).toString('hex')
  await database().query('insert into commerce_setting(id,data) values($1,$2)',[`guest:${cartId}`,JSON.stringify({hash:digest(token),expires:Date.now()+7*86400000})])
  return token
}
export async function checkoutOwner(req:any,cartId:string) {
  const cart=await readCart(req.scope,cartId)
  const customer=req.auth_context?.actor_id
  if(customer && cart.customer_id===customer) return customer
  const token=req.headers?.['x-younoya-checkout-token']
  if(typeof token!=='string' || !/^[a-f0-9]{64}$/.test(token)) throw new CommerceError('Checkout session not found',403)
  const data=(await database().query('select data from commerce_setting where id=$1',[`guest:${cartId}`])).rows[0]?.data
  if(!data || data.expires<Date.now() || !/^[a-f0-9]{64}$/.test(data.hash) || !crypto.timingSafeEqual(Buffer.from(data.hash,'hex'),Buffer.from(digest(token),'hex')))
    throw new CommerceError('Checkout session expired. Please reopen your bag.',403)
  return `guest:${cartId}`
}
