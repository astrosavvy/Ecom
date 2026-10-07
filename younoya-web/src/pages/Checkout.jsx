import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSiteConfig } from '../context/SiteConfigContext'
import { getCustomerToken, storeRequest } from '../lib/giftGuideApi'
import { createCheckoutCart, getPendingPayment, launchPayment, preparePayment } from '../lib/checkout'
import GuideLogin from '../components/gift-guide/GuideLogin'
import CheckoutFields from '../components/checkout/CheckoutFields'
import CheckoutSummary, { money } from '../components/checkout/CheckoutSummary'
import PolicyConsent from '../components/checkout/PolicyConsent'
import PolicyLinks from '../components/PolicyLinks'
import '../styles/Checkout.css'
import '../styles/Policies.css'
const initialAddress = { firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', pincode: '' }
export default function Checkout() {
  const site = useSiteConfig()
  const { cart: bag, giftNote, clearCart } = useCart()
  const [offer] = useState(() => { try { return JSON.parse(sessionStorage.getItem('yn_selected_offer')) } catch { return null } })
  const [customer, setCustomer] = useState(null)
  const [cart, setCart] = useState(null)
  const [session, setSession] = useState(null)
  const [address, setAddress] = useState(initialAddress)
  const [promo, setPromo] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  function complete(value) {
    setOrder(value); clearCart(); sessionStorage.removeItem('yn_selected_offer'); sessionStorage.removeItem('yn_pending_payment')
  }
  useEffect(() => {
    if (getCustomerToken()) storeRequest('/store/customers/me', { auth: true }).then(data => setCustomer(data.customer)).catch(() => setCustomer(null))
  }, [])
  useEffect(() => { setAccepted(false) }, [site.policyRevision])
  useEffect(() => {
    if (!customer) return
    setAddress(current => ({ ...current, email: current.email || customer.email || '', firstName: current.firstName || customer.first_name || '', lastName: current.lastName || customer.last_name || '' }))
    let cancelled = false
    const pending = getPendingPayment()
    if (pending?.cartId && pending?.session?.id) {
      storeRequest(`/store/gift-guide/payment-confirm?cartId=${encodeURIComponent(pending.cartId)}`, { auth: true }).then(status => {
        if (status.completed && status.order?.id) return { already: status.order }
        if (status.completed) throw new Error('Your paid order is being recovered. Please contact support before paying again.')
        return storeRequest(`/store/carts/${encodeURIComponent(pending.cartId)}`, { auth: true })
      }).then(({ cart: saved, already }) => {
        if (cancelled) return
        if (already) { complete(already); return }
        if (!saved) throw new Error('Your paid cart could not reopen. Please contact support before paying again.')
        setCart(saved); setSession(pending.session); setAccepted(true)
        const a = saved.shipping_address || {}
        setAddress({ firstName: a.first_name || '', lastName: a.last_name || '', email: saved.email || '', phone: a.phone || '', street: a.address_1 || '', city: a.city || '', state: a.province || '', pincode: a.postal_code || '' })
      }).catch(issue => { if (!cancelled) setError(issue.message) })
    } else createCheckoutCart(offer,bag,customer).then(value => { if (!cancelled) setCart(value) }).catch(issue => { if (!cancelled) setError(issue.message) })
    return () => { cancelled = true }
  }, [customer])
  async function pay(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      if (!session) {
        if (!site.checkoutEnabled || !accepted) throw new Error('Please review the current policies before ordering.')
        const prepared = await preparePayment(cart.id,address,giftNote,promo,site.policyRevision)
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
  if (order) return <section className="checkout-page checkout-success"><span>YOUNOYA · ORDER CONFIRMED</span><h1>Chosen with <em>intention.</em></h1><p>Order {order.display_id || order.id} is confirmed. Courier preparation and pickup follow payment confirmation; it has not necessarily dispatched.</p><Link className="policy-action" to={`/account/orders/${order.id}`}>View your order ↗</Link><PolicyLinks /></section>
  return <section className="checkout-page"><div className="checkout-page__intro"><span>YOUNOYA · SECURE CHECKOUT</span><h1>A thoughtful gift, <em>almost yours.</em></h1><p>India delivery · Free shipping · INR · Razorpay</p></div>
    {!site.checkoutEnabled && !pending && <p className="checkout-paused" role="status">Online ordering is being prepared. Your selections remain saved. Contact <a href="mailto:support@younoya.com">support@younoya.com</a> for assistance.</p>}
    {!customer && (site.checkoutEnabled || pending) ? <GuideLogin purpose="place your order" onCancel={() => history.back()} onSuccess={setCustomer} /> : <div className="checkout-page__grid">
      <form className="checkout-form" onSubmit={pay}><h2>Where shall we send it?</h2><CheckoutFields address={address} onChange={editAddress} locked={pending} />
        <label>Promotion code <span>Optional</span><input value={promo} readOnly={pending} onChange={e => { setPromo(e.target.value); setSession(null) }} placeholder="Checked at checkout" /></label>
        <PolicyConsent accepted={accepted} onChange={setAccepted} disabled={!site.policiesPublished || pending} />
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="guide-primary" type="submit" disabled={!cart || busy || (!pending && (!site.checkoutEnabled || !accepted))}>{busy ? 'One moment…' : pending ? 'Confirm your order →' : session ? `Pay ${money(cart.total)} securely →` : 'Review final total →'}</button>
      </form><CheckoutSummary cart={cart} bag={bag} session={session} offer={offer} />
    </div>}<PolicyLinks />
  </section>
}
