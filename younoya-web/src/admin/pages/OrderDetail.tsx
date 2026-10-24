import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
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
  ShieldCheck,
  Tag,
  ExternalLink
} from "lucide-react"
import { api, formatINR, fmtDate, type Role } from "../api"
import OrderOperations from "./commerce/OrderOperations"
import OrderBoxLabel from "../components/OrderBoxLabel"

export default function OrderDetail({ role }: { role: Role }) {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    setError(null)

    // Load commerce intelligence
    api(`/admin/commerce/orders/${id}`)
      .then((res: any) => {
        if (active) {
          setData(res)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Could not load order details.")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="ad__page">
        <div className="ad-table-loading" style={{ minHeight: "360px" }}>
          <div className="ad-boot__ring" />
          <span>Loading order intelligence…</span>
        </div>
      </div>
    )
  }

  if (error || !data?.order) {
    return (
      <div className="ad__page">
        <header className="ad__head">
          <Link to="/admin/orders" className="ad-back-link">
            <ArrowLeft size={14} />
            <span>Back to Orders</span>
          </Link>
          <h1>Order Not Found</h1>
        </header>
        <p className="ad-error" role="alert">{error || "This order could not be located."}</p>
      </div>
    )
  }

  const order = data.order
  const shipment = data.shipment
  const operations = data.operations || []
  const addr = order.shipping_address

  // Operations metadata
  const emailOp = operations.find((op: any) => op.kind === "email")
  const isEmailSent = emailOp?.status === "complete" && emailOp?.result?.sent === true

  const shippingOp = operations.find((op: any) => op.kind === "create_shipping")
  const shiprocketOrderId = shippingOp?.result?.shiprocketOrderId
  const shipmentId = shippingOp?.result?.shipmentId
  const merchantOrderId = shippingOp?.result?.merchantOrderId || `YOU-${String(order.display_id || 0).padStart(4, "0")}`

  const approval = order.metadata?.commerce_approval
  const parcel = approval?.parcel
  const shippingMeta = approval?.shipping
  const orderRef = order.display_id ? `#YOU-${String(order.display_id).padStart(4, "0")}` : `#${order.id.slice(0, 8)}`
  const isCod = order.payment_method === "cod"

  return (
    <div className="ad__page ad__page--wide">
      {/* Top Header */}
      <header className="ad__head ad__head--row">
        <div>
          <Link to="/admin/orders" className="ad-back-link">
            <ArrowLeft size={14} />
            <span>Orders</span>
          </Link>
          <div className="ad-order-page-title-row">
            <h1>Order {orderRef}</h1>
            <span
              className={`ad-chip ad-chip--${
                order.payment_status === "captured" ? "ok" : order.payment_status === "awaiting" ? "wait" : "mut"
              }`}
            >
              {order.payment_status === "captured" ? "Razorpay Paid" : order.payment_status}
            </span>
          </div>
          <p>
            Recorded on {fmtDate(order.created_at)}
            {order.email ? ` · Customer: ${order.email}` : ""}
          </p>
        </div>

        <div className="ad-head-actions">
          {addr?.phone && (
            <a
              href={`https://wa.me/${addr.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="ad-btn-luxury"
            >
              <span>WhatsApp Recipient</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </header>

      {/* Integration Intelligence Grid */}
      <div className="ad-intel-grid">
        {/* 1. Payment Gateway Confirmation */}
        <div className="ad-intel-card">
          <div className="ad-intel-card-head">
            <div className="ad-intel-icon-wrap ad-intel-icon-wrap--gold">
              <CreditCard size={15} />
            </div>
            <span className="ad-intel-label">Payment Gateway</span>
          </div>
          <div className="ad-intel-value-row">
            <span className="ad-intel-main-val">
              {isCod ? "Cash on Delivery" : "Razorpay"}
            </span>
            <span className={`ad-badge-pill ${order.payment_status === "captured" ? "ad-badge-pill--success" : "ad-badge-pill--warning"}`}>
              <CheckCircle2 size={11} />
              <span>{order.payment_status === "captured" ? "Captured" : order.payment_status}</span>
            </span>
          </div>
          <div className="ad-intel-subtext">
            Total Collected: <strong>{formatINR(order.total)}</strong>
            {order.cod_fee ? ` (incl. ₹${order.cod_fee} COD fee)` : " · Verified by Razorpay"}
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

      {/* Recipient & Delivery Information Card */}
      <div className="ad-section-card">
        <div className="ad-section-card-head">
          <div className="ad-section-card-title-group">
            <User size={16} className="ad-gold-icon" />
            <h3>Recipient & Delivery Address</h3>
          </div>
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
                {it.variant_sku && <span className="ad-item-sku">SKU: {it.variant_sku}</span>}
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
            <span>Total Collected</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Warehouse Dispatch & Shiprocket Controls */}
      <OrderOperations id={order.id} role={role} />

      {/* Box Sticker Studio & QR Code */}
      <OrderBoxLabel order={order} />
    </div>
  )
}
