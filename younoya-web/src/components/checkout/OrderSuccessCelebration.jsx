import { Link } from 'react-router-dom'
import { Check, ShieldCheck, Mail, Sparkles, Printer, ArrowRight } from 'lucide-react'
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

function calculateEstimatedDelivery(dateString) {
  const start = dateString ? new Date(dateString) : new Date()
  const end = new Date(start)
  start.setDate(start.getDate() + 4)
  end.setDate(end.getDate() + 7)

  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const year = end.getFullYear()
  return `${fmt(start)} – ${fmt(end)}, ${year}`
}

export default function OrderSuccessCelebration({ order }) {
  const orderNumber = formatOrderNumber(order)
  const orderDate = formatOrderDate(order?.created_at)
  const deliveryEstimate = calculateEstimatedDelivery(order?.created_at)

  const addr = order?.shipping_address || {}
  const recipientName = `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || 'Valued Patron'
  const items = order?.items || []
  const totalAmount = order?.total || 0

  return (
    <section className="celebration-container" aria-label="Order confirmation details">
      {/* 1. Party Bomb Confetti Particle Generator */}
      <ConfettiCelebration />

      {/* 2. Glowing Checkmark Emblem & Headline */}
      <div className="celebration-header">
        <div className="celebration-emblem" aria-hidden="true">
          <div className="celebration-emblem-glow" />
          <div className="celebration-emblem-circle">
            <Check size={28} strokeWidth={3} className="celebration-check-icon" />
          </div>
        </div>
        <h1 className="celebration-title">Order Confirmed</h1>
        <p className="celebration-subtitle">
          Thank you for the purchase. We've received your order.
        </p>
      </div>

      {/* 3. Main Receipt Card (Image 2 Style) */}
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
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div key={item.id || idx} className="receipt-item-row">
                  <div className="receipt-item-media">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="receipt-item-thumb"
                        width="64"
                        height="64"
                      />
                    ) : (
                      <div className="receipt-item-thumb-placeholder">✦</div>
                    )}
                  </div>
                  <div className="receipt-item-info">
                    <span className="receipt-item-title">{item.title || 'Curated Atelier Piece'}</span>
                    <span className="receipt-item-qty">Qty: {item.quantity || 1}</span>
                  </div>
                  <strong className="receipt-item-price">
                    {money(item.total || (item.unit_price * (item.quantity || 1)) || totalAmount)}
                  </strong>
                </div>
              ))
            ) : (
              <div className="receipt-item-row">
                <div className="receipt-item-info">
                  <span className="receipt-item-title">Atelier Curated Selection</span>
                  <span className="receipt-item-qty">Qty: 1</span>
                </div>
                <strong className="receipt-item-price">{money(totalAmount)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Side-by-Side: Shipping Address vs Delivery Information */}
        <div className="receipt-grid-row">
          {/* Shipping Address Column */}
          <div className="receipt-col receipt-address-col">
            <h2 className="receipt-section-title">Shipping Address</h2>
            <div className="receipt-address-details">
              <strong className="receipt-recipient">{recipientName}</strong>
              <p className="receipt-address-lines">
                {addr.address_1 || 'Studio Address'}
                {addr.address_2 ? `, ${addr.address_2}` : ''}
              </p>
              <p className="receipt-address-city">
                {[addr.city, addr.province].filter(Boolean).join(', ')}{' '}
                {addr.postal_code || ''}
              </p>
              <p className="receipt-address-country">
                India{addr.phone ? ` · +91 ${addr.phone}` : ''}
              </p>
            </div>
          </div>

          {/* Delivery Information Column with 4-Stage Progress Bar */}
          <div className="receipt-col receipt-delivery-col">
            <h2 className="receipt-section-title">Delivery Information</h2>
            <div className="delivery-estimate-box">
              <span className="delivery-estimate-label">Estimate delivery date:</span>
              <strong className="delivery-estimate-date">{deliveryEstimate}</strong>
            </div>

            {/* 4-Stage Progress Bar */}
            <div className="delivery-progress-widget" aria-label="Order fulfillment progress">
              <div className="delivery-progress-track">
                <div className="delivery-progress-bar-fill" style={{ width: '25%' }} />
              </div>
              <div className="delivery-progress-labels">
                <span className="progress-step is-active">Order Placed</span>
                <span className="progress-step">Processing</span>
                <span className="progress-step">Shipped</span>
                <span className="progress-step">Delivered</span>
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
              <span>Guaranteed safe delivery</span>
            </div>
          </div>
          <div className="receipt-trust-card">
            <div className="trust-icon-pill"><Mail size={16} /></div>
            <div>
              <strong>Order Updates</strong>
              <span>Track via email &amp; SMS</span>
            </div>
          </div>
          <div className="receipt-trust-card">
            <div className="trust-icon-pill"><Sparkles size={16} /></div>
            <div>
              <strong>Atelier Concierge</strong>
              <span>order@younoya.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons (Image 2 Style) */}
      <div className="celebration-actions">
        <button
          type="button"
          onClick={() => window.print()}
          className="celebration-btn-primary"
        >
          <Printer size={16} />
          <span>Track Order</span>
        </button>
        <Link to="/shop" className="celebration-btn-secondary">
          <span>Continue Shopping</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  )
}
