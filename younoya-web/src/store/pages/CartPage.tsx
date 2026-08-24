import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function CartPage() {
  const { cart, refreshCart } = useStore()
  const nav = useNavigate()
  const [busy, setBusy] = useState<string | null>(null)

  const items = cart?.items ?? []

  async function setQty(lineId: string, qty: number) {
    if (!cart) return
    setBusy(lineId)
    try {
      if (qty <= 0) await api.removeLineItem(cart.id, lineId)
      else await api.updateLineItem(cart.id, lineId, qty)
      await refreshCart()
    } finally {
      setBusy(null)
    }
  }

  if (!items.length) {
    return (
      <div className="page">
        <h1 className="page__title">Your cart is an empty night sky</h1>
        <p className="page__sub">Begin the journey, or browse the vault.</p>
        <div className="explore__actions">
          <Link className="btn" to="/journey">Begin journey</Link>
          <Link className="btn btn--ghost" to="/shop">Browse vault</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page__head">
        <p className="journey__eyebrow">Your cart</p>
        <h1 className="page__title">{items.length} {items.length === 1 ? "keepsake" : "keepsakes"} chosen</h1>
      </header>
      <div className="cart">
        {items.map((li) => (
          <div className="cart__row" key={li.id}>
            <img src={li.thumbnail ?? ""} alt="" />
            <div className="cart__info">
              <strong>{li.title}</strong>
              <span>{api.formatINR(li.unit_price)}</span>
            </div>
            <div className="cart__qty">
              <button onClick={() => setQty(li.id, li.quantity - 1)} disabled={busy === li.id}>−</button>
              <span>{li.quantity}</span>
              <button onClick={() => setQty(li.id, li.quantity + 1)} disabled={busy === li.id}>+</button>
            </div>
            <span className="cart__total">{api.formatINR(li.unit_price * li.quantity)}</span>
          </div>
        ))}
        <div className="cart__foot">
          <div className="cart__sum">
            <span>Total</span>
            <strong>{api.formatINR(cart?.subtotal)}</strong>
          </div>
          <button className="btn" onClick={() => nav("/checkout")}>Proceed to checkout</button>
        </div>
      </div>
    </div>
  )
}
