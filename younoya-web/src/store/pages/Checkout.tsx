import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function Checkout() {
  const { cart, customer, refreshCart } = useStore()
  const nav = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    first_name: customer?.first_name ?? "",
    last_name: customer?.last_name ?? "",
    email: customer?.email ?? "",
    phone: "",
    address_1: "",
    city: "",
    postal_code: "",
    province: "",
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function placeOrder() {
    if (!cart) return
    setBusy(true)
    setError(null)
    try {
      await api.updateCart(cart.id, {
        email: form.email,
        shipping_address: {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          address_1: form.address_1,
          city: form.city,
          postal_code: form.postal_code,
          province: form.province || "Maharashtra",
          country_code: "in",
        },
      })
      await api.createPaymentSessions(cart.id)
      const res = await api.completeCart(cart.id)
      if (res.type === "order" && res.order) {
        localStorage.removeItem("younoya_cart_id")
        await refreshCart()
        nav(`/order/${res.order.id}`)
      } else {
        setError("Order could not be completed.")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed")
    } finally {
      setBusy(false)
    }
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="page">
        <p className="page__empty">Nothing to check out yet.</p>
        <Link className="btn" to="/shop">Browse the vault</Link>
      </div>
    )
  }

  return (
    <div className="page checkout">
      <header className="page__head">
        <p className="journey__eyebrow">Checkout</p>
        <h1 className="page__title">Where should the blessing travel?</h1>
      </header>

      <div className="checkout__grid">
        <div className="tile">
          <div className="field-row">
            <label className="field"><span>First name</span>
              <input value={form.first_name} onChange={set("first_name")} /></label>
            <label className="field"><span>Last name</span>
              <input value={form.last_name} onChange={set("last_name")} /></label>
          </div>
          <label className="field"><span>Email</span>
            <input type="email" value={form.email} onChange={set("email")} /></label>
          <label className="field"><span>Phone</span>
            <input value={form.phone} onChange={set("phone")} placeholder="+91…" /></label>
          <label className="field"><span>Address</span>
            <input value={form.address_1} onChange={set("address_1")} /></label>
          <div className="field-row">
            <label className="field"><span>City</span>
              <input value={form.city} onChange={set("city")} /></label>
            <label className="field"><span>State</span>
              <input value={form.province} onChange={set("province")} placeholder="Maharashtra" /></label>
          </div>
          <label className="field"><span>Pincode</span>
            <input inputMode="numeric" value={form.postal_code} onChange={set("postal_code")} /></label>

          {error && <p className="journey__error">{error}</p>}
          <button className="btn" disabled={busy} onClick={placeOrder}>
            {busy ? "Placing order…" : `Place order · ${api.formatINR(cart.subtotal)}`}
          </button>
          <p className="journey__fine">
            Payments open soon — your order is reserved with a pending payment for now.
          </p>
        </div>

        <aside className="checkout__sum">
          <h2>Order</h2>
          {(cart.items ?? []).map((li) => (
            <div className="checkout__line" key={li.id}>
              <span>{li.title} × {li.quantity}</span>
              <span>{api.formatINR(li.unit_price * li.quantity)}</span>
            </div>
          ))}
          <div className="checkout__total">
            <span>Total</span>
            <strong>{api.formatINR(cart.subtotal)}</strong>
          </div>
        </aside>
      </div>
    </div>
  )
}
