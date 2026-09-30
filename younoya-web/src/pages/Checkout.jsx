import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getCustomerToken, storeRequest } from '../lib/giftGuideApi'
import { createCheckoutCart, getPendingPayment, launchPayment, preparePayment } from '../lib/checkout'
import GuideLogin from '../components/gift-guide/GuideLogin'
import '../styles/Checkout.css'

const money = value => `₹${((value || 0) / 100).toLocaleString('en-IN')}`
const initialAddress = { firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', pincode: '' }

export default function Checkout() {
  const { cart: bag, giftNote, clearCart } = useCart()
  const [offer] = useState(() => { try { return JSON.parse(sessionStorage.getItem('yn_selected_offer')) } catch { return null } })
  const [customer, setCustomer] = useState(null)
  const [cart, setCart] = useState(null)
  const [session, setSession] = useState(null)
  const [address, setAddress] = useState(initialAddress)
  const [promo, setPromo] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  useEffect(() => {
    if (!getCustomerToken()) return
    storeRequest('/store/customers/me', { auth: true }).then(data => setCustomer(data.customer)).catch(() => setCustomer(null))
  }, [])
  useEffect(() => {
    if (!customer) return
    setAddress(current => ({ ...current, email: customer.email || '', firstName: customer.first_name || '', lastName: customer.last_name || '' }))
    let cancelled = false
    const pending = getPendingPayment()
    if (pending?.cartId && pending?.session?.id) {
      storeRequest(`/store/gift-guide/payment-confirm?cartId=${encodeURIComponent(pending.cartId)}`, { auth: true })
        .then(status => {
          if (status.completed) throw new Error('This payment may already have completed. Please check your order before paying again.')
          return storeRequest(`/store/carts/${encodeURIComponent(pending.cartId)}`, { auth: true })
        }).then(({ cart }) => {
        if (!cart) throw new Error('The paid cart could not be reopened. Please contact the atelier before paying again.')
        if (cancelled) return
        setCart(cart); setSession(pending.session)
        const shipping = cart.shipping_address || {}
        setAddress({ firstName: shipping.first_name || '', lastName: shipping.last_name || '', email: cart.email || customer.email || '',
          phone: shipping.phone || '', street: shipping.address_1 || '', city: shipping.city || '',
          state: shipping.province || '', pincode: shipping.postal_code || '' })
      }).catch(issue => { if (!cancelled) setError(issue.message) })
      return () => { cancelled = true }
    }
    createCheckoutCart(offer, bag, customer).then(value => { if (!cancelled) setCart(value) })
      .catch(issue => { if (!cancelled) setError(issue.message) })
    return () => { cancelled = true }
  }, [customer])
  async function pay(event) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      if (!session) {
        const prepared = await preparePayment(cart.id, address, giftNote, promo)
        setCart(prepared.cart); setSession(prepared.session)
        return
      }
      const complete = await launchPayment(cart, session, address)
      setOrder(complete); clearCart(); sessionStorage.removeItem('yn_selected_offer')
    } catch (issue) { setError(issue.message) }
    finally { setBusy(false) }
  }
  const editAddress = (field, value) => {
    if (getPendingPayment()) { setError('Your payment is being confirmed. Please finish this order before editing the address.'); return }
    setAddress(current => ({ ...current, [field]: value })); setSession(null)
  }
  if (order) return <section className="checkout-page checkout-success"><span>YOUNOYA · ORDER CONFIRMED</span><h1>Beautifully <em>on its way.</em></h1><p>Your order {order.display_id || order.id} is confirmed. We will write to {address.email} with the details.</p><Link to="/shop">Explore the collection ↗</Link></section>
  return <section className="checkout-page"><div className="checkout-page__intro"><span>YOUNOYA · SECURE CHECKOUT</span><h1>A thoughtful gift, <em>almost yours.</em></h1><p>India delivery · INR · Secure payment by Razorpay</p></div>
    {!customer ? <GuideLogin purpose="place your order" onCancel={() => history.back()} onSuccess={setCustomer} /> : <div className="checkout-page__grid">
      <form className="checkout-form" onSubmit={pay}><h2>Where shall we send it?</h2><div className="checkout-form__names">
        <label>First name<input required value={address.firstName} onChange={event => editAddress('firstName', event.target.value)} /></label>
        <label>Last name<input required value={address.lastName} onChange={event => editAddress('lastName', event.target.value)} /></label></div>
        <label>Email<input required type="email" value={address.email} onChange={event => editAddress('email', event.target.value)} /></label>
        <label>Mobile number<input required type="tel" pattern="[0-9+ ()-]{10,18}" value={address.phone} onChange={event => editAddress('phone', event.target.value)} /></label>
        <label>Street address<input required value={address.street} onChange={event => editAddress('street', event.target.value)} /></label>
        <div className="checkout-form__names"><label>City<input required value={address.city} onChange={event => editAddress('city', event.target.value)} /></label><label>State<input required value={address.state} onChange={event => editAddress('state', event.target.value)} /></label></div>
        <label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={address.pincode} onChange={event => editAddress('pincode', event.target.value)} /></label>
        <label>Promotion code <span>Optional</span><input value={promo} onChange={event => {
          if (getPendingPayment()) { setError('Finish confirming this payment before changing a promotion.'); return }
          setPromo(event.target.value); setSession(null)
        }} placeholder="Applied and checked by the atelier" /></label>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="guide-primary" type="submit" disabled={!cart || busy}>{busy ? 'One moment…' : getPendingPayment() ? 'Confirm your order →' : session ? `Pay ${money(cart.total)} securely →` : 'Review final total →'}</button>
      </form>
      <aside className="checkout-summary"><h2>Your selection</h2>{cart ? <><div>{cart.items?.map(item => <div className="checkout-summary__item" key={item.id}><span>{item.title}<small>Quantity {item.quantity}</small></span><strong>{money(item.total)}</strong></div>)}</div>
        {session && <><div className="checkout-summary__item"><span>Delivery</span><strong>{money(cart.shipping_total)}</strong></div>
          {cart.discount_total > 0 && <div className="checkout-summary__item"><span>Promotion</span><strong>−{money(cart.discount_total)}</strong></div>}</>}
        <div className="checkout-summary__total"><span>{session ? 'Total to pay' : 'Estimated total'}</span><strong>{money(cart.total)}</strong></div>
        <p>{session ? 'This INR total is calculated by Medusa and will appear in Razorpay.' : 'Review delivery and promotions to see the final INR total before payment.'}</p></> : <p>Preparing your bag…</p>}
        {offer?.components?.length > 0 && <div className="checkout-summary__components"><strong>Included in your set</strong>{offer.components.map((component, index) => <span key={index}>{typeof component === 'string' ? component : component.title}</span>)}</div>}
        <Link to="/shop">Continue exploring ↗</Link></aside>
    </div>}
  </section>
}
