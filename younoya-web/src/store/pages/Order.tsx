import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import * as api from "../../lib/api"

export default function Order() {
  const { id } = useParams()
  type OrderData = { id: string; display_id: number; total?: number; items?: Array<{ title: string; quantity: number }> }
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrder(id!).then((r) => setOrder(r.order)).catch(() => setOrder(null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="page"><p className="page__empty">Sealing the order…</p></div>
  if (!order)
    return (
      <div className="page">
        <p className="page__empty">Order not found.</p>
        <Link className="btn" to="/shop">Back to the vault</Link>
      </div>
    )

  return (
    <div className="page order">
      <p className="journey__eyebrow">Order #{order.display_id}</p>
      <h1 className="page__title">The sankalpa has been spoken</h1>
      <p className="page__sub">
        Your keepsakes enter consecration. You will hear from us when the blessing begins its journey.
      </p>
      <div className="tile">
        {(order.items ?? []).map((li, i) => (
          <div className="checkout__line" key={i}>
            <span>{li.title} × {li.quantity}</span>
          </div>
        ))}
        <div className="checkout__total">
          <span>Total</span>
          <strong>{api.formatINR(order.total)}</strong>
        </div>
      </div>
      <div className="explore__actions">
        <Link className="btn" to="/shop">Keep exploring</Link>
        <Link className="btn btn--ghost" to="/account">My orders</Link>
      </div>
    </div>
  )
}
