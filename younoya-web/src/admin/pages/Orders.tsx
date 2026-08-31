import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api, formatINR, fmtDate, type Role } from "../api"

type OrderRow = {
  id: string
  display_id?: number
  created_at: string
  email?: string
  total?: number
  payment_status: string
  fulfillment_status: string
}

const PAGE = 20

export default function Orders({ role }: { role: Role }) {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [count, setCount] = useState(0)
  const [q, setQ] = useState("")
  const [offset, setOffset] = useState(0)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setBusy(true)
      api(`/admin/orders?limit=${PAGE}&offset=${offset}${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`)
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

  return (
    <div className="ad__page">
      <header className="ad__head">
        <h1>Orders</h1>
        <p>{role === "admin" ? "Every order, newest first." : "Look up orders. Changes are made by the store owner."}</p>
      </header>
      <input
        className="ad-search"
        placeholder="Search by email, name or order number…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOffset(0) }}
      />
      {error && <p className="ad-error">{error}</p>}
      <section className="ad-card">
        <table className="ad-table">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Customer</th><th>Payment</th><th>Fulfillment</th><th className="ad-right">Total</th></tr>
          </thead>
          <tbody>
            {busy && orders.length === 0 && (
              <tr><td colSpan={6} className="ad-empty">Loading…</td></tr>
            )}
            {!busy && orders.length === 0 && (
              <tr><td colSpan={6} className="ad-empty">{q ? "Nothing matches that search." : "No orders yet."}</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/admin/orders/${o.id}`} className="ad-link">#{o.display_id ?? o.id.slice(0, 8)}</Link></td>
                <td>{fmtDate(o.created_at)}</td>
                <td>{o.email ?? "—"}</td>
                <td><span className={`ad-chip ad-chip--${o.payment_status === "captured" ? "ok" : o.payment_status === "awaiting" ? "wait" : "mut"}`}>{o.payment_status}</span></td>
                <td><span className={`ad-chip ad-chip--${o.fulfillment_status === "fulfilled" || o.fulfillment_status === "shipped" ? "ok" : o.fulfillment_status === "not_fulfilled" ? "wait" : "mut"}`}>{o.fulfillment_status.replace(/_/g, " ")}</span></td>
                <td className="ad-right">{formatINR(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {count > PAGE && (
          <div className="ad-pager">
            <button className="ad-btn-plain" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>← Newer</button>
            <span>{offset + 1}–{Math.min(offset + PAGE, count)} of {count}</span>
            <button className="ad-btn-plain" disabled={offset + PAGE >= count} onClick={() => setOffset(offset + PAGE)}>Older →</button>
          </div>
        )}
      </section>
    </div>
  )
}
