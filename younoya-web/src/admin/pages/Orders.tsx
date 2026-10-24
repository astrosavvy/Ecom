import { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Search, X, ChevronRight, User, Phone, Mail, Package, CreditCard, Truck, CheckCircle2, Clock } from "lucide-react"
import { api, formatOrderINR, fmtDate, type Role } from "../api"
import OrderSlideOver from "../components/OrderSlideOver"

type OrderRow = {
  id: string
  display_id?: number
  created_at: string
  email?: string
  total?: number
  metadata?: any
  payment_status: string
  fulfillment_status: string
  shipping_address?: {
    first_name?: string
    last_name?: string
    phone?: string
    city?: string
    province?: string
    address_1?: string
  }
  customer?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }
  items?: Array<{
    id: string
    title: string
    quantity: number
    thumbnail?: string | null
  }>
}

type StatusFilter = "all" | "captured" | "cod" | "shipped" | "pending"

const PAGE = 20

export default function Orders({ role }: { role: Role }) {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [count, setCount] = useState(0)
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [offset, setOffset] = useState(0)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setBusy(true)
      api(
        `/admin/orders?limit=${PAGE}&offset=${offset}&fields=*shipping_address,*customer,*items,%2Bmetadata${
          q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""
        }`
      )
        .then((d: any) => {
          setOrders(d.orders ?? [])
          setCount(d.count ?? 0)
          setError(null)
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Could not load orders."))
        .finally(() => setBusy(false))
    }, q ? 250 : 0)
    return () => window.clearTimeout(id)
  }, [q, offset])

  // Filter orders by status pill
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const isCod = o.metadata?.commerce_approval?.shipping?.is_cod === true || o.metadata?.payment_method === "cod"
      if (statusFilter === "captured") return o.payment_status === "captured" && !isCod
      if (statusFilter === "cod") return isCod
      if (statusFilter === "shipped") return o.fulfillment_status === "shipped" || o.fulfillment_status === "fulfilled"
      if (statusFilter === "pending") return o.fulfillment_status === "not_fulfilled" || o.payment_status === "awaiting"
      return true
    })
  }, [orders, statusFilter])

  return (
    <div className="ad__page ad__page--wide">
      {/* Header */}
      <header className="ad__head ad__head--row">
        <div>
          <span className="ad-eyebrow">Commerce Studio</span>
          <h1>Orders</h1>
          <p>
            {role === "admin"
              ? "Every order, newest first. Click any row for complete client & logistics intelligence."
              : "Review orders and dispatch status. Changes are managed by the store owner."}
          </p>
        </div>
        <div className="ad-head-actions">
          <span className="ad-count-indicator">
            {count} {count === 1 ? "Order Total" : "Orders Total"}
          </span>
        </div>
      </header>

      {/* Enhanced Luxury Search & Filter Suite */}
      <div className="ad-filter-bar">
        <div className="ad-filter-top-row">
          <div className="ad-search-wrap">
            <Search size={16} className="ad-search-icon" />
            <input
              className="ad-search-input"
              placeholder="Search by order #, customer name, email, or phone…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setOffset(0)
              }}
            />
            {q && (
              <button
                className="ad-search-clear"
                onClick={() => {
                  setQ("")
                  setOffset(0)
                }}
                title="Clear search"
                type="button"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="ad-search-meta">
            <span className="ad-search-count-pill">
              {filteredOrders.length} {filteredOrders.length === 1 ? "order displayed" : "orders displayed"}
            </span>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="ad-intention-pills">
          <button
            type="button"
            className={`ad-pill ${statusFilter === "all" ? "ad-pill--active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders
          </button>
          <button
            type="button"
            className={`ad-pill ${statusFilter === "captured" ? "ad-pill--active" : ""}`}
            onClick={() => setStatusFilter("captured")}
          >
            Paid (Razorpay)
          </button>
          <button
            type="button"
            className={`ad-pill ${statusFilter === "cod" ? "ad-pill--active" : ""}`}
            onClick={() => setStatusFilter("cod")}
          >
            Cash on Delivery
          </button>
          <button
            type="button"
            className={`ad-pill ${statusFilter === "shipped" ? "ad-pill--active" : ""}`}
            onClick={() => setStatusFilter("shipped")}
          >
            Dispatched
          </button>
          <button
            type="button"
            className={`ad-pill ${statusFilter === "pending" ? "ad-pill--active" : ""}`}
            onClick={() => setStatusFilter("pending")}
          >
            Awaiting Action
          </button>
        </div>
      </div>

      {error && <p className="ad-error" role="alert">{error}</p>}

      {/* Orders Table */}
      <section className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th style={{ width: "120px" }}>Order</th>
              <th style={{ width: "140px" }}>Date</th>
              <th>Customer & Shipping</th>
              <th style={{ width: "160px" }}>Payment</th>
              <th style={{ width: "160px" }}>Fulfillment</th>
              <th className="ad-right" style={{ width: "120px" }}>Total</th>
              <th style={{ width: "48px" }}></th>
            </tr>
          </thead>
          <tbody>
            {busy && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="ad-empty">
                  <div className="ad-table-loading">
                    <div className="ad-boot__ring" />
                    <span>Loading orders…</span>
                  </div>
                </td>
              </tr>
            )}

            {!busy && filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="ad-empty">
                  {q || statusFilter !== "all"
                    ? "No orders match that search or filter."
                    : "No orders yet in the atelier."}
                </td>
              </tr>
            )}

            {filteredOrders.map((o) => {
              const customerName =
                [o.shipping_address?.first_name, o.shipping_address?.last_name].filter(Boolean).join(" ") ||
                [o.customer?.first_name, o.customer?.last_name].filter(Boolean).join(" ") ||
                "Guest Customer"
              const email = o.email || o.customer?.email
              const phone = o.shipping_address?.phone || o.customer?.phone
              const city = o.shipping_address?.city
              const orderRef = o.display_id ? `#YOU-${String(o.display_id).padStart(4, "0")}` : `#${o.id.slice(0, 8)}`
              const isCod = o.metadata?.commerce_approval?.shipping?.is_cod === true || o.metadata?.payment_method === "cod"

              return (
                <tr
                  key={o.id}
                  className={`ad-row-clickable ${selectedOrderId === o.id ? "ad-row-clickable--selected" : ""}`}
                  onClick={() => setSelectedOrderId(o.id)}
                  title="Click to view complete order intelligence"
                >
                  {/* Order Number */}
                  <td>
                    <span className="ad-order-badge">{orderRef}</span>
                  </td>

                  {/* Date */}
                  <td>
                    <span className="ad-order-date">{fmtDate(o.created_at)}</span>
                  </td>

                  {/* Customer Information */}
                  <td>
                    <div className="ad-customer-cell">
                      <span className="ad-customer-name">{customerName}</span>
                      <div className="ad-customer-sub">
                        {phone && <span className="ad-customer-sub-item">{phone}</span>}
                        {city && <span className="ad-customer-sub-item">· {city}</span>}
                      </div>
                      {email && <span className="ad-customer-email">{email}</span>}
                    </div>
                  </td>

                  {/* Payment Status */}
                  <td>
                    <div className="ad-status-cell">
                      <span
                        className={`ad-chip ad-chip--${
                          o.payment_status === "captured" ? "ok" : o.payment_status === "awaiting" ? "wait" : "mut"
                        }`}
                      >
                        {isCod ? "Cash on Delivery" : o.payment_status === "captured" ? "Razorpay Paid" : o.payment_status}
                      </span>
                    </div>
                  </td>

                  {/* Fulfillment Status */}
                  <td>
                    <div className="ad-status-cell">
                      <span
                        className={`ad-chip ad-chip--${
                          o.fulfillment_status === "fulfilled" || o.fulfillment_status === "shipped"
                            ? "ok"
                            : o.fulfillment_status === "not_fulfilled"
                            ? "wait"
                            : "mut"
                        }`}
                      >
                        {o.fulfillment_status === "not_fulfilled"
                          ? "Awaiting Dispatch"
                          : o.fulfillment_status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </td>

                  {/* Total */}
                  <td className="ad-right">
                    <span className="ad-order-amount">{formatOrderINR(o)}</span>
                  </td>

                  {/* Action Chevron */}
                  <td className="ad-right">
                    <span className="ad-row-chevron" aria-hidden="true">
                      <ChevronRight size={16} />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {count > PAGE && (
          <div className="ad-pager">
            <button
              className="ad-btn-plain"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - PAGE))}
            >
              ← Newer
            </button>
            <span>
              {offset + 1}–{Math.min(offset + PAGE, count)} of {count}
            </span>
            <button
              className="ad-btn-plain"
              disabled={offset + PAGE >= count}
              onClick={() => setOffset(offset + PAGE)}
            >
              Older →
            </button>
          </div>
        )}
      </section>

      {/* Instant Slide-Over Order Detail Drawer */}
      <OrderSlideOver
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        role={role}
      />
    </div>
  )
}
