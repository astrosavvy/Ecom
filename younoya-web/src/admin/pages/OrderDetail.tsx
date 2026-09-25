import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { api, formatINR, fmtDate, type Role } from "../api"

type OrderItem = { id: string; title: string; quantity: number; unit_price: number; total?: number; thumbnail?: string | null }
type Order = {
  id: string
  display_id?: number
  created_at: string
  email?: string
  total?: number
  subtotal?: number
  shipping_total?: number
  discount_total?: number
  payment_status: string
  fulfillment_status: string
  items: OrderItem[]
  shipping_address?: any
  customer?: { id: string; email?: string; phone?: string }
}

export default function OrderDetail({ role }: { role: Role }) {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api(`/admin/orders/${id}`)
      .then((d: any) => setOrder(d.order))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this order."))
  }, [id])

  if (error) return <div className="ad__page"><p className="ad-error">{error}</p></div>
  if (!order) return <div className="ad__page"><p className="ad-empty">Loading…</p></div>

  const addr = order.shipping_address

  return (
    <div className="ad__page">
      <header className="ad__head ad__head--row">
        <div>
          <Link to="/admin/orders" className="ad-link">← Orders</Link>
          <h1>Order #{order.display_id ?? order.id.slice(0, 8)}</h1>
          <p>Placed {fmtDate(order.created_at)}{order.email ? ` · ${order.email}` : ""}</p>
        </div>
        <div className="ad-chips">
          <span className={`ad-chip ad-chip--${order.payment_status === "captured" ? "ok" : "wait"}`}>Payment: {order.payment_status}</span>
          <span className={`ad-chip ad-chip--${order.fulfillment_status === "fulfilled" || order.fulfillment_status === "shipped" ? "ok" : "wait"}`}>
            {order.fulfillment_status.replace(/_/g, " ")}
          </span>
        </div>
      </header>

      <section className="ad-card">
        <div className="ad-card__head"><h2>Items</h2></div>
        <table className="ad-table">
          <thead><tr><th>Gift</th><th className="ad-right">Each</th><th className="ad-right">Qty</th><th className="ad-right">Total</th></tr></thead>
          <tbody>
            {(order.items ?? []).map((it) => (
              <tr key={it.id}>
                <td>{it.title}</td>
                <td className="ad-right">{formatINR(it.unit_price)}</td>
                <td className="ad-right">{it.quantity}</td>
                <td className="ad-right">{formatINR(it.total ?? it.unit_price * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ad-totals">
          <div><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
          {order.shipping_total ? <div><span>Shipping</span><span>{formatINR(order.shipping_total)}</span></div> : null}
          {order.discount_total ? <div><span>Discount</span><span>− {formatINR(order.discount_total)}</span></div> : null}
          <div className="ad-totals__grand"><span>Total</span><span>{formatINR(order.total)}</span></div>
        </div>
      </section>

      <section className="ad-card">
        <div className="ad-card__head"><h2>Delivery</h2></div>
        {addr ? (
          <div className="ad-kv">
            <p>{[addr.first_name, addr.last_name].filter(Boolean).join(" ")}</p>
            <p>{addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ""}</p>
            <p>{[addr.city, addr.province, addr.postal_code].filter(Boolean).join(", ")}</p>
            <p>{addr.country_code?.toUpperCase()}</p>
            {order.customer?.phone && <p>Phone: {order.customer.phone}</p>}
          </div>
        ) : (
          <p className="ad-empty">No delivery address on this order.</p>
        )}
        {role === "support" && (
          <p className="ad-note">Status changes are made by the store owner.</p>
        )}
      </section>
    </div>
  )
}
