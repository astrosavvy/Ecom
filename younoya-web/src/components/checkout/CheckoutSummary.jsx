import { useState } from 'react'
import { ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { checkoutTotal } from '../../lib/delivery'

export const money = value => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CheckoutSummary({ cart, bag, session, offer, promo = '', onPromoChange, method = 'razorpay' }) {
  const [promoInput, setPromoInput] = useState(promo)
  const [promoApplied, setPromoApplied] = useState(false)

  const bagItems = offer
    ? [{ id: offer.id, title: offer.title, quantity: 1, thumbnail: offer.thumbnail, total: offer.price, subtitle: offer.subtitle }]
    : (bag || []).map(item => ({
        id: item.id,
        title: item.name || item.title,
        quantity: item.quantity,
        thumbnail: item.image || item.thumbnail,
        total: Number(item.priceNum || item.price || 0) * (item.quantity || 1),
        subtitle: item.subtitle
      }))

  const cartHasValidItems = Array.isArray(cart?.items) && cart.items.length > 0 && cart.items.some(i => i.title || (Number(i.total || i.unit_price || 0) > 0))

  const items = cartHasValidItems
    ? cart.items.map(item => ({
        id: item.id,
        title: item.title || item.variant_title || 'Atelier Selection',
        quantity: item.quantity || 1,
        thumbnail: item.thumbnail || bagItems.find(b => b.id === item.id)?.thumbnail,
        total: Number(item.total || (item.unit_price * (item.quantity || 1)) || 0),
        subtitle: item.subtitle
      }))
    : bagItems

  const estimate = bagItems.reduce((sum, item) => sum + Number(item.total || 0), 0)
  const cartSubtotal = Number(cart?.original_item_total || cart?.subtotal || 0)
  const cartTotal = Number(cart?.total || 0)

  const subtotal = cartSubtotal > 0 ? cartSubtotal : estimate
  const total = checkoutTotal(cart,estimate,method)

  function handleApplyPromo(e) {
    e?.preventDefault?.()
    if (!promoInput.trim()) return
    onPromoChange?.(promoInput.trim())
    setPromoApplied(true)
  }

  return (
    <aside className="checkout-card checkout-summary-card" aria-label="Order summary">
      <h2 className="checkout-card__title">Your Order</h2>

      {/* Itemized Piece Cards (Image 3 Style) */}
      <div className="checkout-summary__items">
        {items.map(item => (
          <div className="checkout-item-card" key={item.id}>
            <div className="checkout-item-card__media">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="checkout-item-card__thumb"
                  width="72"
                  height="72"
                />
              ) : (
                <div className="checkout-item-card__placeholder">✦</div>
              )}
            </div>
            <div className="checkout-item-card__body">
              <h3 className="checkout-item-card__title">{item.title}</h3>
              <div className="checkout-item-card__meta">
                <span className="checkout-item-card__qty">Qty: {item.quantity}</span>
                <strong className="checkout-item-card__price">{money(item.total)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon / Promo Code Input with Inline Button (Image 3 Style) */}
      <div className="checkout-coupon-row">
        <label className="checkout-coupon-label">Coupon Code</label>
        <div className="checkout-coupon-input-group">
          <input
            type="text"
            className="checkout-coupon-input"
            value={promoInput}
            placeholder="Enter promo code"
            onChange={e => {
              setPromoInput(e.target.value)
              setPromoApplied(false)
            }}
          />
          <button
            type="button"
            className="checkout-coupon-btn"
            onClick={handleApplyPromo}
          >
            {promoApplied ? 'Applied' : 'Apply Code'}
          </button>
        </div>
      </div>

      {/* Financial Totals Breakdown */}
      <dl className="checkout-summary__totals">
        <div className="checkout-summary__row">
          <dt>Subtotal:</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div className="checkout-summary__row">
          <dt>Delivery:</dt>
          <dd className="checkout-shipping-free">Free</dd>
        </div>
        {Number(cart?.discount_total) > 0 && (
          <div className="checkout-summary__row checkout-summary__discount">
            <dt>Discount:</dt>
            <dd>−{money(cart.discount_total)}</dd>
          </div>
        )}
        {method === 'cod' && <div className="checkout-summary__row"><dt>COD handling charge:</dt><dd>{money(49)}</dd></div>}
        <div className="checkout-summary__row checkout-summary__total-row">
          <dt>Total:</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      {/* Trust Micro-Badges */}
      <div className="checkout-trust-bar">
        <span><ShieldCheck size={14} /> 100% Secure Checkout</span>
        <span><Truck size={14} /> Free Delivery</span>
        <span><Sparkles size={14} /> Sacred Packaging</span>
      </div>
    </aside>
  )
}
