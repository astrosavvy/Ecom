import { CommerceError } from './db'
const cache=new Map<string,{until:number,value:any}>()
export async function lookupPincode(pin:string) {
 if(!/^[1-9][0-9]{5}$/.test(pin)) throw new CommerceError('Enter a six-digit Indian PIN code')
 const saved=cache.get(pin);if(saved&&saved.until>Date.now()) return saved.value
 const response=await fetch(`https://api.postalpincode.in/pincode/${pin}`,{signal:AbortSignal.timeout(5000)})
 if(!response.ok) throw new CommerceError('PIN lookup is unavailable. Enter city and state manually.',503)
 const data=await response.json() as any
 const offices=data?.[0]?.Status==='Success'&&Array.isArray(data[0].PostOffice)?data[0].PostOffice.filter((o:any)=>o.Country==='India'&&String(o.Pincode)===pin&&typeof o.District==='string'&&typeof o.State==='string'):[]
 if(!offices.length) throw new CommerceError('No address was found for this PIN. Check it or enter city and state manually.',404)
 const delivery=offices.filter((o:any)=>o.DeliveryStatus==='Delivery')
 const candidates=delivery.length?delivery:offices
 const states=[...new Set(candidates.map((o:any)=>o.State))],districts=[...new Set(candidates.map((o:any)=>o.District))]
 if(states.length!==1||districts.length!==1) throw new CommerceError('This PIN has several locations. Enter your city and state manually.',409)
 const value={pincode:pin,city:districts[0],state:states[0],country:'India'}
 if(cache.size>=2000) cache.delete(cache.keys().next().value!)
 cache.set(pin,{until:Date.now()+86400000,value});return value
}
