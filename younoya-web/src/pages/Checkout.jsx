import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, LockKeyhole, CircleCheck, ShieldCheck } from 'lucide-react'
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
  const location = useLocation()
  const { cart: bag, giftNote, clearCart, setIsOpen } = useCart()
  const [offer, setOffer] = useState(() => { try { return JSON.parse(sessionStorage.getItem('yn_selected_offer')) } catch { return null } })
  const [customer, setCustomer] = useState(null)
  const [customerReady, setCustomerReady] = useState(() => !getCustomerToken())
  const [cart, setCart] = useState(null)
  const [session, setSession] = useState(null)
  const [address, setAddress] = useState(() => { try { return { ...initialAddress, ...JSON.parse(sessionStorage.getItem('yn_checkout_address') || '{}') } } catch { return initialAddress } })
  const [promo, setPromo] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  const selectionKey = offer ? `${offer.id}:${offer.variantId}` : bag.map(item => `${item.id}:${item.quantity}`).join('|')

  // Calculate live payable amount for initial button rendering
  const bagEstimate = offer ? Number(offer.price || 0) : bag.reduce((sum, item) => sum + Number(item.priceNum || item.price || 0) * (item.quantity || 1), 0)
  const payableAmount = Number(cart?.total || 0) > 0 ? cart.total : bagEstimate

  useEffect(() => { sessionStorage.setItem('yn_checkout_address', JSON.stringify(address)) }, [address])

  function complete(value) {
    setOrder(value)
    clearCart()
    sessionStorage.removeItem('yn_selected_offer')
    sessionStorage.removeItem('yn_pending_payment')
  }

  useEffect(() => { try { setOffer(JSON.parse(sessionStorage.getItem('yn_selected_offer'))) } catch { setOffer(null) } }, [location.key])

  useEffect(() => {
    if (getCustomerToken()) {
      storeRequest('/store/customers/me', { auth: true })
        .then(data => setCustomer(data.customer))
        .catch(issue => { setCustomer(null); if (issue.status === 401) clearCustomerToken() })
        .finally(() => setCustomerReady(true))
    }
  }, [])

  useEffect(() => {
    if (customer && !getPendingPayment()) {
      setAddress(current => ({ ...current, email: current.email || customer.email || '', firstName: current.firstName || customer.first_name || '', lastName: current.lastName || customer.last_name || '' }))
    }
  }, [customer])

  useEffect(() => { setAccepted(false) }, [site.policyRevision])

  useEffect(() => {
    if (order || !customerReady) return
    if (!site.checkoutEnabled && !getPendingPayment()) return
    setAddress(current => ({ ...current, email: current.email || customer?.email || '', firstName: current.firstName || customer?.first_name || '', lastName: current.lastName || customer?.last_name || '' }))

    let cancelled = false
    const pending = getPendingPayment()
    if (pending?.cartId && pending?.session?.id) {
      storeRequest(`/store/gift-guide/payment-confirm?cartId=${encodeURIComponent(pending.cartId)}`, checkoutAccess(pending.cartId))
        .then(status => {
          if (status.completed && status.order?.id) return { already: status.order }
          if (status.completed) throw new Error('Your paid order is being recovered. Please contact support before paying again.')
          return storeRequest(`/store/carts/${encodeURIComponent(pending.cartId)}`)
        })
        .then(({ cart: saved, already }) => {
          if (cancelled) return
          if (already) { complete(already); return }
          if (!saved) throw new Error('Your paid cart could not reopen. Please contact support before paying again.')
          setCart(saved); setSession(pending.session); setAccepted(true)
          const a = saved.shipping_address || {}
          setAddress({ firstName: a.first_name || '', lastName: a.last_name || '', email: saved.email || '', phone: a.phone || '', street: a.address_1 || '', street2: a.address_2 || '', city: a.city || '', state: a.province || '', pincode: a.postal_code || '' })
        })
        .catch(issue => { if (!cancelled) setError(issue.message) })
    } else {
      setCart(null); setSession(null)
      createCheckoutCart(offer, bag, customer).then(value => { if (!cancelled) setCart(value) }).catch(issue => { if (!cancelled) setError(issue.message) })
    }
    return () => { cancelled = true }
  }, [site.checkoutEnabled, selectionKey, customerReady])

  // Single-Click Payment Execution (prepares and directly triggers Razorpay popup modal)
  async function pay(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (!site.checkoutEnabled || !accepted) {
        throw new Error('Please review and accept the store policies before placing your order.')
      }

      let activeCart = cart
      let activeSession = session

      // If payment session not yet prepared, prepare it now
      if (!activeSession) {
        const current = activeCart?.metadata?.commerce_requote_required || activeCart?.metadata?.money_unit !== 'inr-major-v2'
          ? await createCheckoutCart(offer, bag, customer)
          : activeCart
        setCart(current)
        const prepared = await preparePayment(current.id, address, giftNote, promo, site.policyRevision)
        activeCart = prepared.cart
        activeSession = prepared.session
        setCart(activeCart)
        setSession(activeSession)
      }

      // Directly open Razorpay in the same flow — zero second clicks!
      const orderResult = await launchPayment(activeCart, activeSession, address)
      complete(orderResult)
    } catch (issue) {
      setError(issue.message)
    } finally {
      setBusy(false)
    }
  }

  function editAddress(field, value) {
    if (getPendingPayment()) return
    setAddress(current => ({ ...current, [field]: value }))
    setSession(null)
  }

  const pending = !!getPendingPayment()

  if (order) {
    return (
      <section className="checkout-page checkout-success">
        <OrderSuccessCelebration order={order} />
        <PolicyLinks />
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="checkout-top">
        <button type="button" onClick={() => setIsOpen(true)}>
          <ArrowLeft size={16} />
          <span>Back to bag</span>
        </button>
        <span className="checkout-secure-badge">
          <LockKeyhole size={14} />
          <span>256-bit encrypted checkout</span>
        </span>
      </div>

      {!site.checkoutEnabled && !pending && (
        <p className="checkout-paused" role="status">
          Online ordering is being prepared. Your selections remain saved. Contact <a href="mailto:support@younoya.com">support@younoya.com</a> for assistance.
        </p>
      )}

      <div className="checkout-page__grid">
        <form className="checkout-form" onSubmit={pay}>
          {/* 1. Modern Shipping Address Block */}
          <CheckoutFields address={address} onChange={editAddress} locked={pending} />

          {/* 2. Modern Payment Method Block (Image 3 Style) */}
          <section className="checkout-card checkout-payment-card" aria-label="Payment method">
            <h2 className="checkout-card__title">Payment Method</h2>
            <div className="checkout-payment-option is-selected">
              <div className="checkout-payment-option__radio">
                <CircleCheck size={18} className="payment-check-icon" />
              </div>
              <div className="checkout-payment-option__info">
                <span className="payment-provider-title">Razorpay Secure Checkout</span>
                <span className="payment-provider-subtitle">UPI, Credit/Debit Cards, Net Banking &amp; Wallets</span>
              </div>
              <div className="checkout-payment-badges">
                <span className="payment-method-badge">UPI</span>
                <span className="payment-method-badge">Cards</span>
                <span className="payment-method-badge">Net Banking</span>
              </div>
            </div>
          </section>

          {/* 3. Policy Consent & Unified Single-Click CTA Button */}
          <div className="checkout-submit-card">
            <PolicyConsent accepted={accepted} onChange={setAccepted} disabled={!site.policiesPublished || pending} />

            {!pending && (!site.policiesPublished || !site.checkoutEnabled) && (
              <p className="checkout-availability" role="status">
                {!site.policiesPublished
                  ? 'Policy confirmation will be available once the store policies setup is complete.'
                  : 'Online payments will be available once ordering setup is complete.'}
              </p>
            )}

            {error && <p className="checkout-error" role="alert">{error}</p>}

            {busy && pending && (
              <p className="checkout-finalizing-note">
                ✦ Payment received. Finalizing your order with the atelier… Please do not refresh.
              </p>
            )}

            <button
              className="checkout-place-order-btn"
              type="submit"
              disabled={!cart && !offer && bag.length === 0 || busy || (!pending && (!site.checkoutEnabled || !accepted))}
            >
              <span>
                {busy
                  ? (pending ? 'Finalizing your order…' : '✦ Opening secure payment…')
                  : pending
                    ? 'Finalizing order…'
                    : `Pay ${money(payableAmount)} securely`}
              </span>
              <ArrowRight size={17} />
            </button>
          </div>
        </form>

        {/* 4. Modern Order Summary Block (Image 3 Style) */}
        <CheckoutSummary
          cart={cart}
          bag={bag}
          session={session}
          offer={offer}
          promo={promo}
          onPromoChange={val => { setPromo(val); setSession(null) }}
        />
      </div>

      <PolicyLinks />
    </section>
  )
}
