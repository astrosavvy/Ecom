import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function Account() {
  const { customer, profiles, refreshProfiles } = useStore()
  const [orders, setOrders] = useState<Array<{ id: string; display_id: number; total?: number }>>([])
  const [confirm, setConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (!customer) return
    refreshProfiles()
    const base = (import.meta.env.VITE_API_BASE as string) || "https://api.younoya.com"
    const key =
      (import.meta.env.VITE_PUBLISHABLE_KEY as string) ||
      "pk_fe6f25d425dbefc81508541538e1007d229a450f06697a1d58f4cda7bc390c35"
    fetch(`${base}/store/customers/me/orders?limit=10`, {
      headers: {
        "x-publishable-api-key": key,
        Authorization: `Bearer ${api.getToken()}`,
      },
    })
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []))
      .catch(() => void 0)
  }, [customer, refreshProfiles])

  if (!customer) {
    return (
      <div className="page">
        <h1 className="page__title">You are not signed in</h1>
        <Link className="btn" to="/journey">Login with mobile</Link>
      </div>
    )
  }

  async function remove(id: string) {
    await api.deleteProfile(id)
    setConfirm(null)
    await refreshProfiles()
  }

  return (
    <div className="page account">
      <header className="page__head">
        <p className="journey__eyebrow">Account</p>
        <h1 className="page__title">Namaste, {customer.first_name ?? "traveller"}</h1>
      </header>

      <section className="account__block">
        <h2>Sky profiles</h2>
        {profiles.length === 0 && <p className="page__empty">No charts yet.</p>}
        {profiles.map((p) => (
          <div className="account__profile" key={p.id}>
            <div>
              <strong>{p.full_name}</strong>
              <span className="account__tag">{p.is_self ? "self" : p.relationship}</span>
            </div>
            <span>{p.moon_sign} · {p.sun_sign} · {p.nakshatra}</span>
            {confirm === p.id ? (
              <span className="account__confirm">
                Delete? <button onClick={() => remove(p.id)}>Yes</button>
                <button onClick={() => setConfirm(null)}>No</button>
              </span>
            ) : (
              <button className="linkish" onClick={() => setConfirm(p.id)}>remove</button>
            )}
          </div>
        ))}
        <Link className="btn btn--ghost" to="/journey">New reading</Link>
      </section>

      <section className="account__block">
        <h2>Orders</h2>
        {orders.length === 0 && <p className="page__empty">No orders yet.</p>}
        {orders.map((o) => (
          <Link className="account__order" key={o.id} to={`/order/${o.id}`}>
            <span>#{o.display_id}</span>
            <span>{api.formatINR(o.total)}</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
