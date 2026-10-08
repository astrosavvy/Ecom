import { useEffect, useRef, useState } from 'react'
import { storeRequest } from '../../lib/giftGuideApi'
import { MapPin, Pencil } from 'lucide-react'
const fields = [
 ['email','Email address','email'],
 ['phone','Mobile number','tel'],['firstName','Full name','name'],['street','Address line 1','address-line1'],['street2','Address line 2 (optional)','address-line2'],['pincode','PIN code','postal-code'],
]
export default function CheckoutFields({address,onChange,locked}) {
 const [status,setStatus]=useState(''),[manual,setManual]=useState(false),[loading,setLoading]=useState(false)
 const [editing,setEditing]=useState(true)
 const container=useRef(null)
 function saveAddress(){
  const invalid=[...container.current.querySelectorAll('input')].find(input=>!input.checkValidity())
  if(invalid){invalid.reportValidity();return}
  if(!address.city||!address.state){setManual(true);setStatus('Please enter your city and state.');return}
  setEditing(false)
 }
 const change=useRef(onChange);change.current=onChange
 useEffect(()=>{
  if(locked||!/^[1-9]\d{5}$/.test(address.pincode)){setStatus('');setLoading(false);return}
  const controller=new AbortController()
  setLoading(true);setStatus('Finding your delivery location…')
  storeRequest(`/store/commerce/pincode?pincode=${address.pincode}`,{signal:controller.signal}).then(result=>{
   if(controller.signal.aborted)return
   change.current('city',result.city);change.current('state',result.state);setManual(false)
   setStatus('City / district and state filled from your PIN. Please check your delivery address.')
  }).catch(error=>{if(!controller.signal.aborted){setManual(true);setStatus(error.message==='Failed to fetch'?'Location lookup is unavailable. Enter your city and state below.':error.message||'Enter your city and state below.')}})
   .finally(()=>{if(!controller.signal.aborted)setLoading(false)})
  return ()=>controller.abort()
 },[address.pincode,locked])
 const field=([key,label,autoComplete])=><label key={key} className={["firstName","street","street2"].includes(key)?"checkout-wide":undefined}>{label}<input
  required={key!=='street2'} value={address[key]} autoComplete={autoComplete} readOnly={locked}
  type={key==='email'?'email':key==='phone'?'tel':'text'}
  {...(key==='pincode'?{inputMode:'numeric',pattern:'[1-9][0-9]{5}',maxLength:6}:{})}
  {...(key==='phone'?{pattern:'[0-9+ ()-]{10,18}'}:{})}
  onChange={event=>{if(key==='pincode'){change.current('city','');change.current('state','')};onChange(key,key==='pincode'?event.target.value.replace(/\D/g,''):event.target.value)}}/></label>
 return <section ref={container} className={`checkout-address ${editing?'is-editing':''}`} aria-label="Delivery address">
 <div className="checkout-address__heading"><h2><MapPin size={18}/>Delivery address</h2>{!editing&&<button type="button" disabled={locked} onClick={()=>setEditing(true)}><Pencil size={14}/>Edit</button>}</div>
 {!editing&&<div className="checkout-address__saved"><strong>{address.firstName} {address.lastName}</strong><p>{address.street}{address.street2?`, ${address.street2}`:''}<br/>{address.city}, {address.state} {address.pincode}<br/>India</p><small>{address.email}<br/>{address.phone}</small></div>}
 <div className="checkout-address__fields">
 <fieldset className="checkout-fieldset"><legend>Contact information</legend><div className="checkout-fields">{fields.slice(0,2).map(field)}</div></fieldset>
 <fieldset className="checkout-fieldset"><legend>Shipping address</legend><div className="checkout-fields">{fields.slice(2).map(field)}<label>Country<span className="checkout-country">India</span></label>
  <div className="checkout-location" aria-busy={loading}>
   <p role="status">{status||'Enter your PIN code to fill city and state automatically.'}</p>
   {!manual&&address.city&&<p><strong>{address.city}, {address.state} · India</strong></p>}
   {!locked&&<button type="button" onClick={()=>setManual(!manual)}>{manual?'Use PIN lookup':'Edit city / state'}</button>}
   {(manual||locked)&&<div className="checkout-fields">{[['city','City / district','address-level2'],['state','State','address-level1']].map(([key,label,autoComplete])=><label key={key}>{label}<input required value={address[key]} autoComplete={autoComplete} readOnly={locked} onChange={event=>onChange(key,event.target.value)}/></label>)}</div>}
  </div>
 </div></fieldset><button className="checkout-address__save" type="button" disabled={locked||loading} onClick={saveAddress}>Use this address</button></div></section>
}
