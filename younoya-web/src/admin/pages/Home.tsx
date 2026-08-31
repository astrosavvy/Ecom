import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api, formatINR, fmtDate } from "../api"

type OrderRow = { id: string; display_id?: number; created_at: string; total?: number; email?: string; payment_status: string; fulfillment_status: string }
type CustomerRow = { id: string; email: string; first_name?: string; created_at: string }

export default function Home() {
  const [stats, setStats] = useState<{ orders30: number; revenue30: number; customers: number; posts: number } | null>(null)
  const [recent, setRecent] = useState<OrderRow[]>([])
  const [newCustomers, setNewCustomers] = useState<CustomerRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api("/admin/orders?limit=100"),
      api("/admin/customers?limit=5"),
      api("/admin/blog/posts?limit=1"),
    ])
      .then(async ([orders, customers, blog]: any[]) => {
        const all: OrderRow[] = orders.orders ?? []
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
        const recent30 = all.filter((o) => new Date(o.created_at).getTime() > cutoff)
        setStats({
          orders30: orders.count ?? all.length,
          revenue30: recent30.reduce((sum, o) => sum + (o.total ?? 0), 0),
          customers: customers.count ?? 0,
          posts: blog.count ?? 0,
        })
        setRecent(all.slice(0, 5))
        setNewCustomers(customers.customers ?? [])
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the overview."))
  }, [])

  return (
    <div className="ad__page">
      <header className="ad__head">
        <h1>Home</h1>
        <p>How the store is doing at a glance.</p>
      </header>
      {error && <p className="ad-error">{error}</p>}
      <div className="ad-stats">
        <div className="ad-stat">
          <small>Orders · last 30 days</small>
          <strong>{stats ? stats.orders30 : "…"}</strong>
        </div>
        <div className="ad-stat">
          <small>Revenue · last 30 days</small>
          <strong>{stats ? formatINR(stats.revenue30) : "…"}</strong>
        </div>
        <div className="ad-stat">
          <small>Customers</small>
          <strong>{stats ? stats.customers : "…"}</strong>
        </div>
        <div className="ad-stat">
          <small>Journal posts</small>
          <strong>{stats ? stats.posts : "…"}</strong>
        </div>
      </div>

      <section className="ad-card">
        <div className="ad-card__head">
          <h2>Latest orders</h2>
          <Link to="/admin/orders" className="ad-link">View all →</Link>
        </div>
        <table className="ad-table">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Status</th><th className="ad-right">Total</th></tr>
          </thead>
          <tbody>
            {recent.map((o) => (
              <tr key={o.id}>
                <td><Link to={`/admin/orders/${o.id}`} className="ad-link">#{o.display_id ?? o.id.slice(0, 8)}</Link></td>
                <td>{fmtDate(o.created_at)}</td>
                <td><span className={`ad-chip ad-chip--${o.payment_status === "captured" ? "ok" : "wait"}`}>{o.payment_status}</span></td>
                <td className="ad-right">{formatINR(o.total)}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr><td colSpan={4} className="ad-empty">No orders yet — they will appear here the moment one arrives.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="ad-card">
        <div className="ad-card__head">
          <h2>Newest customers</h2>
          <Link to="/admin/customers" className="ad-link">View all →</Link>
        </div>
        <table className="ad-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {newCustomers.map((c) => (
              <tr key={c.id}>
                <td><Link to={`/admin/customers/${c.id}`} className="ad-link">{c.first_name || "—"}</Link></td>
                <td>{c.email}</td>
                <td>{fmtDate(c.created_at)}</td>
              </tr>
            ))}
            {newCustomers.length === 0 && (
              <tr><td colSpan={3} className="ad-empty">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
