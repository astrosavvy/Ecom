import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  X,
  ExternalLink,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  ShieldCheck,
  Tag
} from "lucide-react"
import { api, formatINR, fmtDate, type Role } from "../api"
import OrderOperations from "../pages/commerce/OrderOperations"
import OrderBoxLabel from "./OrderBoxLabel"

interface OrderSlideOverProps {
  orderId: string | null
  onClose: () => void
  role: Role
}

export default function OrderSlideOver({ orderId, onClose, role }: OrderSlideOverProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setData(null)
      return
    }

    let active = true
    setLoading(true)
    setError(null)

    // Escape key listener to close drawer
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)

    api(`/admin/commerce/orders/${orderId}`)
      .then((res: any) => {
        if (active) {
          setData(res)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load order intelligence.")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [orderId, onClose])

  if (!orderId) return null

  const order = data?.order
  const shipment = data?.shipment
  const operations = data?.operations || []
  const addr = order?.shipping_address

  // Find email operation
  const emailOp = operations.find((op: any) => op.kind === "email")
  const isEmailSent = emailOp?.status === "complete" && emailOp?.result?.sent === true

  // Find shiprocket shipping creation operation
  const shippingOp = operations.find((op: any) => op.kind === "create_shipping")
  const shiprocketOrderId = shippingOp?.result?.shiprocketOrderId
  const shipmentId = shippingOp?.result?.shipmentId
  const merchantOrderId = shippingOp?.result?.merchantOrderId || `YOU-${String(order?.display_id || 0).padStart(4, "0")}`

  // Parcel & HSN metadata
  const approval = order?.metadata?.commerce_approval
  const parcel = approval?.parcel
  const shippingMeta = approval?.shipping

  const orderRef = order?.display_id ? `#YOU-${String(order.display_id).padStart(4, "0")}` : `#${order?.id?.slice(0, 8)}`

  return (
    <div className="ad-drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ad-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="ad-drawer-header">
          <div className="ad-drawer-header-left">
            <span className="ad-drawer-eyebrow">Atelier Order Intelligence</span>
            <div className="ad-drawer-title-row">
              <h2 className="ad-drawer-title">Order {orderRef}</h2>
              {order && (
                <span
                  className={`ad-chip ad-chip--${
                    order.payment_status === "captured" ? "ok" : order.payment_status === "awaiting" ? "wait" : "mut"
                  }`}
                >
                  {order.payment_status === "captured" ? "Paid · Captured" : order.payment_status}
                </span>
              )}
            </div>
            {order && (
              <span className="ad-drawer-timestamp">
                Placed on {fmtDate(order.created_at)}
              </span>
            )}
          </div>

          <div className="ad-drawer-header-actions">
            {order && (
              <Link
                to={`/admin/orders/${order.id}`}
                className="ad-drawer-ext-btn"
                title="Open dedicated full page"
                onClick={onClose}
              >
                <span>Full Page</span>
                <ExternalLink size={13} />
              </Link>
            )}
            <button className="ad-drawer-close" onClick={onClose} aria-label="Close detail panel">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="ad-drawer-body">
          {loading && (
            <div className="ad-drawer-loading">
              <div className="ad-boot__ring" />
              <span>Gathering order records…</span>
            </div>
          )}

          {error && (
            <div className="ad-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!loading && order && (
            <>
              {/* Integration Status Grid (Razorpay, Email, Shiprocket, Parcel) */}
              <div className="ad-intel-grid">
                {/* 1. Razorpay Payment Confirmation */}
                <div className="ad-intel-card">
                  <div className="ad-intel-card-head">
                    <div className="ad-intel-icon-wrap ad-intel-icon-wrap--gold">
                      <CreditCard size={15} />
                    </div>
                    <span className="ad-intel-label">Payment Gateway</span>
                  </div>
                  <div className="ad-intel-value-row">
                    <span className="ad-intel-main-val">
                      {order.payment_method === "cod" ? "Cash on Delivery" : "Razorpay"}
                    </span>
                    <span className={`ad-badge-pill ${order.payment_status === "captured" ? "ad-badge-pill--success" : "ad-badge-pill--warning"}`}>
                      <CheckCircle2 size={11} />
                      <span>{order.payment_status === "captured" ? "Captured" : order.payment_status}</span>
                    </span>
                  </div>
                  <div className="ad-intel-subtext">
                    Total Collected: <strong>{formatINR(order.total)}</strong>
                    {order.cod_fee ? ` (incl. ₹${order.cod_fee} COD fee)` : " · Zero gateway deductions"}
                  </div>
                </div>

                {/* 2. Customer Confirmation Email */}
                <div className="ad-intel-card">
                  <div className="ad-intel-card-head">
                    <div className="ad-intel-icon-wrap ad-intel-icon-wrap--sage">
                      <Mail size={15} />
                    </div>
                    <span className="ad-intel-label">Order Confirmation Email</span>
                  </div>
                  <div className="ad-intel-value-row">
                    <span className="ad-intel-main-val">
                      {isEmailSent ? "Dispatched" : emailOp?.status || "Pending"}
                    </span>
                    <span className={`ad-badge-pill ${isEmailSent ? "ad-badge-pill--success" : "ad-badge-pill--warning"}`}>
                      {isEmailSent ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      <span>{isEmailSent ? "Sent to Customer" : "Queued"}</span>
                    </span>
                  </div>
                  <div className="ad-intel-subtext">
                    Delivered to: <strong>{order.email || addr?.email || "Customer"}</strong>
                    {emailOp?.updated_at && ` on ${fmtDate(emailOp.updated_at)}`}
                  </div>
                </div>

                {/* 3. Shiprocket Dispatch Status */}
                <div className="ad-intel-card">
                  <div className="ad-intel-card-head">
                    <div className="ad-intel-icon-wrap ad-intel-icon-wrap--indigo">
                      <Truck size={15} />
                    </div>
                    <span className="ad-intel-label">Shiprocket Logistics</span>
                  </div>
                  <div className="ad-intel-value-row">
                    <span className="ad-intel-main-val">
                      {shipment?.status === "booked" ? "Order Booked" : shipment?.status?.replace(/_/g, " ") || "Connected"}
                    </span>
                    <span className={`ad-badge-pill ${shipment?.status === "booked" || shipment?.data?.awb ? "ad-badge-pill--info" : "ad-badge-pill--neutral"}`}>
                      <Package size={11} />
                      <span>{shipment?.data?.awb ? `AWB: ${shipment.data.awb}` : "Booked"}</span>
                    </span>
                  </div>
                  <div className="ad-intel-subtext">
                    Shiprocket ID: <strong>{shiprocketOrderId || "—"}</strong> · Ref: <strong>{merchantOrderId}</strong>
                  </div>
                </div>

                {/* 4. Consecrated Parcel Specs */}
                <div className="ad-intel-card">
                  <div className="ad-intel-card-head">
                    <div className="ad-intel-icon-wrap ad-intel-icon-wrap--amber">
                      <ShieldCheck size={15} />
                    </div>
                    <span className="ad-intel-label">Parcel & Packaging</span>
                  </div>
                  <div className="ad-intel-value-row">
                    <span className="ad-intel-main-val">
                      {parcel?.weightKg ? `${parcel.weightKg} kg gross` : "Standard Box"}
                    </span>
                    <span className="ad-badge-pill ad-badge-pill--neutral">
                      <Tag size={11} />
                      <span>HSN {shippingMeta?.hsn || "711790"}</span>
                    </span>
                  </div>
                  <div className="ad-intel-subtext">
                    Dimensions: <strong>{parcel ? `${parcel.lengthCm} × ${parcel.widthCm} × ${parcel.heightCm} cm` : "Atelier Carton"}</strong>
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Information Card */}
              <div className="ad-section-card">
                <div className="ad-section-card-head">
                  <div className="ad-section-card-title-group">
                    <User size={16} className="ad-gold-icon" />
                    <h3>Recipient & Delivery Address</h3>
                  </div>
                  {addr?.phone && (
                    <a
                      href={`https://wa.me/${addr.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ad-chip-action"
                    >
                      <span>WhatsApp Customer</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                <div className="ad-customer-details-grid">
                  <div className="ad-customer-field">
                    <span className="ad-field-lbl">Customer Name</span>
                    <span className="ad-field-val ad-field-val--strong">
                      {[addr?.first_name, addr?.last_name].filter(Boolean).join(" ") || "Guest Customer"}
                    </span>
                  </div>

                  <div className="ad-customer-field">
                    <span className="ad-field-lbl">Phone Number</span>
                    <span className="ad-field-val">
                      {addr?.phone ? (
                        <a href={`tel:${addr.phone}`} className="ad-interactive-link">
                          <Phone size={12} />
                          <span>{addr.phone}</span>
                        </a>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>

                  <div className="ad-customer-field">
                    <span className="ad-field-lbl">Email Address</span>
                    <span className="ad-field-val">
                      {order.email ? (
                        <a href={`mailto:${order.email}`} className="ad-interactive-link">
                          <Mail size={12} />
                          <span>{order.email}</span>
                        </a>
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>

                  <div className="ad-customer-field ad-customer-field--full">
                    <span className="ad-field-lbl">Destination Address</span>
                    <div className="ad-address-box">
                      <MapPin size={14} className="ad-gold-icon" />
                      <div className="ad-address-lines">
                        <p>{addr?.address_1 || "No street address provided"}</p>
                        {addr?.address_2 && <p className="ad-address-landmark">{addr.address_2}</p>}
                        <p>
                          {[addr?.city, addr?.province, addr?.postal_code].filter(Boolean).join(", ")}
                          {addr?.country_code ? ` · ${addr.country_code.toUpperCase()}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Card */}
              <div className="ad-section-card">
                <div className="ad-section-card-head">
                  <div className="ad-section-card-title-group">
                    <Package size={16} className="ad-gold-icon" />
                    <h3>Curated Keepsakes ({order.items?.length || 0})</h3>
                  </div>
                </div>

                <div className="ad-items-list">
                  {(order.items || []).map((it: any) => (
                    <div key={it.id} className="ad-item-row">
                      {it.thumbnail ? (
                        <img src={it.thumbnail} alt={it.title} className="ad-item-thumb" />
                      ) : (
                        <div className="ad-item-thumb-placeholder">
                          <Package size={18} />
                        </div>
                      )}
                      <div className="ad-item-info">
                        <h4 className="ad-item-title">{it.title}</h4>
                        {it.subtitle && <span className="ad-item-subtitle">{it.subtitle}</span>}
                        {it.variant_sku && (
                          <span className="ad-item-sku">SKU: {it.variant_sku}</span>
                        )}
                      </div>
                      <div className="ad-item-pricing">
                        <span className="ad-item-qty">Qty: {it.quantity}</span>
                        <span className="ad-item-total">{formatINR(it.total || it.unit_price * it.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ad-drawer-totals">
                  <div className="ad-total-line">
                    <span>Subtotal</span>
                    <span>{formatINR(order.total)}</span>
                  </div>
                  <div className="ad-total-line ad-total-line--grand">
                    <span>Final Total</span>
                    <span>{formatINR(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Warehouse Dispatch Operations */}
              <OrderOperations id={order.id} role={role} />

              {/* Box Sticker Studio & QR Code */}
              <OrderBoxLabel order={order} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
