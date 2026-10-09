import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LockKeyhole, Truck, CircleCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useSiteConfig } from '../context/SiteConfigContext'
import { getCustomerToken, clearCustomerToken, storeRequest } from '../lib/giftGuideApi'
import { createCheckoutCart, getPendingPayment, launchPayment, preparePayment, checkoutAccess } from '../lib/checkout'
import CheckoutFields from '../components/checkout/CheckoutFields'
import CheckoutSummary, { money } from '../components/checkout/CheckoutSummary'
import PolicyConsent from '../components/checkout/PolicyConsent'
import OrderSuccessCelebration from '../components/checkout/OrderSuccessCelebration'
import PolicyLinks from '../components/PolicyLinks'
import '../styles/Policies.css'
import '../styles/Checkout.css'
const initialAddress = { firstName: '', lastName: '', email: '', phone: '', street: '', street2: '', city: '', state: '', pincode: '' }
export default function Checkout() {
  const site = useSiteConfig()
  const location=useLocation()
  const { cart: bag, giftNote, clearCart, setIsOpen } = useCart()
  const [offer,setOffer] = useState(() => { try { return JSON.parse(sessionStorage.getItem('yn_selected_offer')) } catch { return null } })
  const [customer, setCustomer] = useState(null)
  const [customerReady,setCustomerReady]=useState(()=>!getCustomerToken())
  const [cart, setCart] = useState(null)
  const [session, setSession] = useState(null)
  const [address, setAddress] = useState(() => { try { return {...initialAddress,...JSON.parse(sessionStorage.getItem('yn_checkout_address') || '{}')} } catch { return initialAddress } })
  const [promo, setPromo] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const selectionKey=offer?`${offer.id}:${offer.variantId}`:bag.map(item=>`${item.id}:${item.quantity}`).join('|')
  useEffect(() => { sessionStorage.setItem('yn_checkout_address',JSON.stringify(address)) },[address])
  function complete(value) {
    setOrder(value); clearCart(); sessionStorage.removeItem('yn_selected_offer'); sessionStorage.removeItem('yn_pending_payment')
  }
  useEffect(()=>{try{setOffer(JSON.parse(sessionStorage.getItem('yn_selected_offer')))}catch{setOffer(null)}},[location.key])
  useEffect(() => {
    if (getCustomerToken()) storeRequest('/store/customers/me', { auth: true }).then(data => setCustomer(data.customer)).catch(issue => {setCustomer(null);if(issue.status===401)clearCustomerToken()}).finally(()=>setCustomerReady(true))
  }, [])
  useEffect(()=>{
    if(customer&&!getPendingPayment())setAddress(current=>({...current,email:current.email||customer.email||'',firstName:current.firstName||customer.first_name||'',lastName:current.lastName||customer.last_name||''}))
  },[customer])
  useEffect(() => { setAccepted(false) }, [site.policyRevision])
  useEffect(() => {
    if(order||!customerReady)return
    if (!site.checkoutEnabled && !getPendingPayment()) return
    setAddress(current => ({ ...current, email: current.email || customer?.email || '', firstName: current.firstName || customer?.first_name || '', lastName: current.lastName || customer?.last_name || '' }))
    let cancelled = false
    const pending = getPendingPayment()
    if (pending?.cartId && pending?.session?.id) {
      storeRequest(`/store/gift-guide/payment-confirm?cartId=${encodeURIComponent(pending.cartId)}`, checkoutAccess(pending.cartId)).then(status => {
        if (status.completed && status.order?.id) return { already: status.order }
        if (status.completed) throw new Error('Your paid order is being recovered. Please contact support before paying again.')
        return storeRequest(`/store/carts/${encodeURIComponent(pending.cartId)}`)
      }).then(({ cart: saved, already }) => {
        if (cancelled) return
        if (already) { complete(already); return }
        if (!saved) throw new Error('Your paid cart could not reopen. Please contact support before paying again.')
        setCart(saved); setSession(pending.session); setAccepted(true)
        const a = saved.shipping_address || {}
        setAddress({ firstName: a.first_name || '', lastName: a.last_name || '', email: saved.email || '', phone: a.phone || '', street: a.address_1 || '', street2: a.address_2 || '', city: a.city || '', state: a.province || '', pincode: a.postal_code || '' })
      }).catch(issue => { if (!cancelled) setError(issue.message) })
    } else {
      setCart(null);setSession(null)
      createCheckoutCart(offer,bag,customer).then(value => { if (!cancelled) setCart(value) }).catch(issue => { if (!cancelled) setError(issue.message) })
    }
    return () => { cancelled = true }
  }, [site.checkoutEnabled,selectionKey,customerReady])
  async function pay(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      if (!session) {
        if (!site.checkoutEnabled || !accepted) throw new Error('Please review the current policies before ordering.')
        const current = cart.metadata?.commerce_requote_required || cart.metadata?.money_unit !== 'inr-major-v2'
          ? await createCheckoutCart(offer,bag,customer) : cart
        setCart(current)
        const prepared = await preparePayment(current.id,address,giftNote,promo,site.policyRevision)
        setCart(prepared.cart); setSession(prepared.session); return
      }
      complete(await launchPayment(cart,session,address))
    } catch (issue) { setError(issue.message) } finally { setBusy(false) }
  }
  function editAddress(field,value) {
    if (getPendingPayment()) return
    setAddress(current => ({ ...current, [field]: value })); setSession(null)
  }
  const pending = !!getPendingPayment()
  if (order) return (
    <section className="checkout-page checkout-success">
      <OrderSuccessCelebration order={order} />
      <PolicyLinks />
    </section>
  )
  return <section className="checkout-page"><div className="checkout-top"><button type="button" onClick={()=>setIsOpen(true)}><ArrowLeft size={16}/>Back to bag</button><span><LockKeyhole size={14}/>Secure checkout</span></div>
    {!site.checkoutEnabled && !pending && <p className="checkout-paused" role="status">Online ordering is being prepared. Your selections remain saved. Contact <a href="mailto:support@younoya.com">support@younoya.com</a> for assistance.</p>}
    <div className="checkout-page__grid">
      <form className="checkout-form" onSubmit={pay}><div className="checkout-heading"><h1>Checkout</h1><ol className="checkout-progress" aria-label="Checkout progress">{['Shipping','Payment','Confirmation'].map((label,index)=><li key={label} className={index===(session?1:0)?'is-current':''} aria-current={index===(session?1:0)?'step':undefined}><span>{index+1}</span>{label}</li>)}</ol></div><CheckoutFields address={address} onChange={editAddress} locked={pending} />
        <section className="checkout-delivery" aria-label="Shipping"><Truck size={21}/><div><h2>Shipping</h2><p>Free India shipping · Estimated 3–5 working days after dispatch. Remote areas may take longer.</p></div><strong>Free</strong></section>
        <section className="checkout-payment" aria-label="Payment method"><h2>Payment method</h2><div><img src="/razorpay-logo.svg" alt="Razorpay" width="106" height="23"/><span>UPI, cards &amp; net banking<small>Choose your method securely in Razorpay.</small></span><CircleCheck size={20} aria-label="Selected payment provider"/></div></section>
        <details className="checkout-promo"><summary>Have a promotion code?</summary><label>Promotion code<input value={promo} readOnly={pending} onChange={e => { setPromo(e.target.value); setSession(null) }} placeholder="Applied to your final total" /></label></details>
        <div className="checkout-action"><PolicyConsent accepted={accepted} onChange={setAccepted} disabled={!site.policiesPublished || pending} />
        {!pending&&(!site.policiesPublished||!site.checkoutEnabled)&&<p className="checkout-availability" role="status">{!site.policiesPublished?'Policy confirmation and payment will be available once the store policies and ordering setup are complete.':'Online payments will be available once the ordering setup is complete.'}</p>}
        {error && <p className="checkout-error" role="alert">{error}</p>}
        {busy && pending && <p className="checkout-finalizing-note" style={{ color: '#8d683d', fontSize: '13px', textAlign: 'center', margin: '4px 0' }}>✦ Payment received. Finalizing your order with the atelier… Please do not refresh.</p>}
        <button className="checkout-continue" type="submit" disabled={!cart || busy || (!pending && (!site.checkoutEnabled || !accepted))}>{busy ? (pending ? 'Finalizing your order…' : 'One moment…') : pending ? 'Finalizing order…' : session ? `Pay ${money(cart.total)} securely` : 'Continue to payment'}<ArrowRight size={18}/></button></div>
      </form><CheckoutSummary cart={cart} bag={bag} session={session} offer={offer} />
    </div><PolicyLinks />
  </section>
}
