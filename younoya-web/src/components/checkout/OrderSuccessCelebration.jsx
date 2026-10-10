import { Link } from 'react-router-dom'
import { Check, ShieldCheck, Mail, Sparkles, ArrowRight } from 'lucide-react'
import { money } from './CheckoutSummary'
import ConfettiCelebration from './ConfettiCelebration'

export function formatOrderNumber(order) {
  const year = new Date(order?.created_at || Date.now()).getFullYear() || 2026
  let seq = '0001'
  if (order?.display_id != null) {
    seq = String(order.display_id).padStart(4, '0')
  } else if (order?.id) {
    const raw = String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()
    seq = raw.padStart(4, '0')
  }
  return `YOU-${year}-${seq}`
}

function formatOrderDate(dateString) {
  const date = dateString ? new Date(dateString) : new Date()
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const MILESTONE_STEPS = [
  { id: 'placed', label: 'Order Placed', status: 'completed' },
  { id: 'processing', label: 'Processing', status: 'current' },
  { id: 'shipped', label: 'Shipped', status: 'upcoming' },
  { id: 'delivered', label: 'Delivered', status: 'upcoming' },
]

export default function OrderSuccessCelebration({ order }) {
  const orderNumber = formatOrderNumber(order)
  const orderDate = formatOrderDate(order?.created_at)
  const cod = order?.metadata?.commerce_approval?.payment_method === 'cod'
  const deliveryEstimate = order?.metadata?.commerce_approval?.delivery?.message || 'Estimated delivery 3–5 working days after dispatch.'

  const addr = order?.shipping_address || {}
  const savedAddress = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('yn_checkout_address') || '{}')
    } catch {
      return {}
    }
  })()

  const firstName = addr.first_name || savedAddress.firstName || ''
  const lastName = addr.last_name || savedAddress.lastName || ''
  const recipientName = `${firstName} ${lastName}`.trim()
  const street1 = addr.address_1 || savedAddress.street || ''
  const street2 = addr.address_2 || savedAddress.street2 || ''
  const city = addr.city || savedAddress.city || ''
  const state = addr.province || savedAddress.state || ''
  const pincode = addr.postal_code || savedAddress.pincode || ''
  const phone = addr.phone || savedAddress.phone || ''

  const savedOffer = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('yn_selected_offer') || 'null')
    } catch {
      return null
    }
  })()

  const items = (Array.isArray(order?.items) && order.items.length > 0)
    ? order.items
    : savedOffer
      ? [{
          id: savedOffer.id,
          title: savedOffer.title || 'Curated Atelier Selection',
          quantity: 1,
          thumbnail: savedOffer.thumbnail || savedOffer.image || '/media/shop-apple.webp',
          total: savedOffer.price || order?.total || 0
        }]
      : [{
          id: 'curated-piece',
          title: 'Atelier Curated Selection',
          quantity: 1,
          thumbnail: '/media/shop-apple.webp',
          total: order?.total || 0
        }]

  const totalAmount = order?.total || (items.reduce((sum, item) => sum + Number(item.total || 0), 0))

  return (
    <section className="celebration-container" aria-label="Order confirmation details">
      {/* 1. Party Bomb Confetti Particle Generator */}
      <ConfettiCelebration />

      {/* 2. Glowing Checkmark Emblem & Headline */}
      <div className="celebration-header">
        <div className="celebration-emblem" aria-hidden="true">
          <div className="celebration-emblem-glow" />
          <div className="celebration-emblem-circle">
            <Check size={28} strokeWidth={3.2} className="celebration-check-icon" />
          </div>
        </div>
        <h1 className="celebration-title">Order Confirmed</h1>
        <p className="celebration-subtitle">
          Thank you for your purchase. We are carefully processing your order to dispatch it with utmost care at the earliest.
        </p>
      </div>

      {/* 3. Main Receipt Card */}
      <div className="celebration-receipt-card">
        {/* Top Highlight Banner */}
        <div className="receipt-banner">
          <div className="receipt-banner__left">
            <strong className="receipt-order-id">Order #{orderNumber}</strong>
            <span className="receipt-order-date">{orderDate}</span>
          </div>
          <div className="receipt-banner__right">
            <span className="receipt-total-label">Total</span>
            <strong className="receipt-total-amount">{money(totalAmount)}</strong>
          </div>
        </div>

        {/* Itemized Products */}
        <div className="receipt-section receipt-items-section">
          <h2 className="receipt-section-title">Items</h2>
          <div className="receipt-items-list">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="receipt-item-row">
                <div className="receipt-item-media">
                  <img
                    src={item.thumbnail || item.image || '/media/shop-apple.webp'}
                    alt={item.title || 'Curated Atelier Piece'}
                    className="receipt-item-thumb"
                    width="64"
                    height="64"
                    onError={e => { e.currentTarget.src = '/media/shop-apple.webp' }}
                  />
                </div>
                <div className="receipt-item-info">
                  <span className="receipt-item-title">{item.title || 'Curated Atelier Piece'}</span>
                  <span className="receipt-item-qty">Qty: {item.quantity || 1}</span>
                </div>
                <strong className="receipt-item-price">
                  {money(item.total || (item.unit_price * (item.quantity || 1)) || totalAmount)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side: Shipping Address vs Delivery Information */}
        <div className="receipt-grid-row">
          {/* Shipping Address Column */}
          <div className="receipt-col receipt-address-col">
            <h2 className="receipt-section-title">Shipping Address</h2>
            <div className="receipt-address-details">
              {recipientName ? (
                <strong className="receipt-recipient">{recipientName}</strong>
              ) : null}
              {street1 ? (
                <p className="receipt-address-lines">
                  {street1}
                  {street2 ? `, ${street2}` : ''}
                </p>
              ) : null}
              {(city || state || pincode) ? (
                <p className="receipt-address-city">
                  {[city, state].filter(Boolean).join(', ')}{pincode ? ` ${pincode}` : ''}
                </p>
              ) : null}
              <p className="receipt-address-country">
                India{phone ? ` · +91 ${phone}` : ''}
              </p>
            </div>
          </div>

          {/* Delivery Information Column with 4-Stage Milestone Stepper */}
          <div className="receipt-col receipt-delivery-col">
            <h2 className="receipt-section-title">Delivery Information</h2>
            {cod && <p>Cash on Delivery · ₹49 handling charge<br /><strong>Amount due on delivery: {money(totalAmount)}</strong></p>}
            <div className="delivery-estimate-box">
              <span className="delivery-estimate-label">Estimate delivery date:</span>
              <strong className="delivery-estimate-date">{deliveryEstimate}</strong><small>Festival, weather and unforeseen delays may affect delivery.</small>
            </div>

            {/* 4-Stage Milestone Stepper with Dots */}
            <div className="milestone-stepper" aria-label="Order fulfillment progress">
              <div className="milestone-track">
                <div className="milestone-track-line" />
                <div className="milestone-track-fill" style={{ width: '33%' }} />
                <div className="milestone-nodes">
                  {MILESTONE_STEPS.map((step) => (
                    <div key={step.id} className={`milestone-node is-${step.status}`}>
                      <div className="milestone-dot">
                        {step.status === 'completed' ? (
                          <Check size={11} strokeWidth={3.5} />
                        ) : (
                          <span className="milestone-dot-inner" />
                        )}
                      </div>
                      <span className="milestone-label">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Trust Assurance Cards */}
        <div className="receipt-trust-grid">
          <div className="receipt-trust-card">
            <div className="trust-icon-pill"><ShieldCheck size={16} /></div>
            <div>
              <strong>Purchase Protection</strong>
              <span>Support for delivery issues</span>
            </div>
          </div>
          <div className="receipt-trust-card">
            <div className="trust-icon-pill"><Mail size={16} /></div>
            <div>
              <strong>Order Updates</strong>
              <span>Updates via email</span>
            </div>
          </div>
          <div className="receipt-trust-card">
            <div className="trust-icon-pill"><Sparkles size={16} /></div>
            <div>
              <strong>Atelier Concierge</strong>
              <span>support@younoya.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="celebration-actions">
        <Link to="/shop" className="celebration-btn-primary">
          <span>Continue Shopping</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
