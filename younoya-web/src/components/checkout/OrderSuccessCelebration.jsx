import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle2, PackageCheck, Truck, ShieldCheck, ArrowRight, Printer } from 'lucide-react'
import { money } from './CheckoutSummary'

export default function OrderSuccessCelebration({ order }) {
  const displayId = order?.display_id ? `#${order.display_id}` : `#${order?.id?.slice(-8)?.toUpperCase() || 'CONFIRMED'}`
  const addr = order?.shipping_address || {}
  const recipientName = `${addr.first_name || ''} ${addr.last_name || ''}`.trim() || 'Valued Patron'
  const items = order?.items || []

  return (
    <section className="celebration-container" aria-label="Order confirmation celebration">
      <div className="celebration-badge-row">
        <span className="celebration-pill">
          <Sparkles size={14} className="gold-sparkle" />
          <span>Atelier Order Confirmed</span>
          <Sparkles size={14} className="gold-sparkle" />
        </span>
      </div>

      <div className="celebration-hero">
        <div className="celebration-emblem" aria-hidden="true">
          <div className="celebration-emblem-glow" />
          <div className="celebration-emblem-ring">
            <CheckCircle2 size={44} strokeWidth={1.8} className="celebration-check" />
          </div>
        </div>
        <h1 className="celebration-title">Hurray! Congratulations</h1>
        <p className="celebration-subtitle">
          Your payment has been securely verified and received. Our New Delhi atelier is now handcrafting and preparing your pieces for dispatch.
        </p>
      </div>

      <div className="celebration-card celebration-meta-card">
        <div className="celebration-meta-col">
          <span className="meta-label">Order Reference</span>
          <strong className="meta-value order-id-highlight">{displayId}</strong>
        </div>
        <div className="celebration-meta-col">
          <span className="meta-label">Payment Status</span>
          <span className="status-pill status-pill--paid">
            <ShieldCheck size={13} /> Verified via Razorpay
          </span>
        </div>
        <div className="celebration-meta-col">
          <span className="meta-label">Total Paid</span>
          <strong className="meta-value">{money(order?.total || 0)}</strong>
        </div>
      </div>

      <div className="celebration-card celebration-journey-card">
        <h2 className="journey-title">Fulfillment & Dispatch Journey</h2>
        <div className="journey-timeline">
          <div className="journey-step is-complete">
            <div className="step-marker"><CheckCircle2 size={16} /></div>
            <div className="step-content">
              <strong>1. Payment Verified &amp; Captured</strong>
              <p>Authentication complete. Official tax invoice generated.</p>
            </div>
          </div>
          <div className="journey-step is-active">
            <div className="step-marker"><PackageCheck size={16} /></div>
            <div className="step-content">
              <strong>2. Atelier Curation &amp; Packaging</strong>
              <p>Preparing keepsake hamper with intentional ritual packaging in New Delhi.</p>
            </div>
          </div>
          <div className="journey-step is-pending">
            <div className="step-marker"><Truck size={16} /></div>
            <div className="step-content">
              <strong>3. Courier Dispatch &amp; Delivery</strong>
              <p>Shiprocket warehouse pickup will assign tracking updates to {order?.email || 'your email'}.</p>
            </div>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="celebration-card celebration-items-card">
          <h2 className="journey-title">Curated Selection ({items.length})</h2>
          <div className="celebration-items-list">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="celebration-item-row">
                <div className="item-info">
                  <span className="item-name">{item.title}</span>
                  <span className="item-qty">Qty: {item.quantity}</span>
                </div>
                <strong className="item-price">{money(item.total || item.unit_price * item.quantity)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="celebration-card celebration-address-card">
        <span className="meta-label">Delivering To</span>
        <strong className="address-name">{recipientName}</strong>
        <p className="address-text">
          {[addr.address_1, addr.address_2, addr.city, addr.province, addr.postal_code, 'India'].filter(Boolean).join(', ')}
        </p>
        {addr.phone && <span className="address-phone">Contact: {addr.phone}</span>}
      </div>

      <div className="celebration-actions">
        <Link to="/shop" className="celebration-primary-btn">
          <span>Continue Exploring</span>
          <ArrowRight size={16} />
        </Link>
        <button type="button" onClick={() => window.print()} className="celebration-secondary-btn">
          <Printer size={15} />
          <span>Print Receipt</span>
        </button>
      </div>

      <p className="celebration-help-note">
        A confirmation email has been dispatched to <strong>{order?.email || 'your email'}</strong>. For questions, reach out to <a href="mailto:order@younoya.com">order@younoya.com</a>.
      </p>
    </section>
  )
}
