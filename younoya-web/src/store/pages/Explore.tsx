import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { formatINR } from "../../lib/api"
import { useStore } from "../../lib/store"
import type { RecommendationItem } from "../../lib/api"

function GiftCard({
  item,
  featured,
  onAdd,
  adding,
}: {
  item: RecommendationItem
  featured?: boolean
  onAdd: () => void
  adding: boolean
}) {
  return (
    <article className={`gift${featured ? " gift--main" : ""}`}>
      <div className="gift__img">
        <img src={item.thumbnail ?? "/products/placeholder.webp"} alt={item.title} loading="lazy" />
        <span className="gift__score">{item.score}% match</span>
      </div>
      <div className="gift__body">
        <h3>{item.title}</h3>
        {item.gemstone_crystal && <p className="gift__gem">{item.gemstone_crystal}</p>}
        <ul className="gift__why">
          {item.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <div className="gift__foot">
          <span className="gift__price">{formatINR(item.price)}</span>
          <button className="btn btn--sm" onClick={onAdd} disabled={adding}>
            {adding ? "Adding…" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Explore() {
  const nav = useNavigate()
  const { lastResult, addToCart } = useStore()
  const [adding, setAdding] = useState<string | null>(null)

  if (!lastResult) {
    return (
      <div className="page">
        <p className="page__empty">No reading yet.</p>
        <button className="btn" onClick={() => nav("/journey")}>Begin the journey</button>
      </div>
    )
  }

  const r = lastResult

  async function handleAdd(item: RecommendationItem) {
    setAdding(item.id)
    try {
      // fetch variant id for this product
      const { getProduct } = await import("../../lib/api")
      const p = await getProduct(item.handle)
      const variant = p?.variants?.[0]
      if (variant) await addToCart(variant.id)
      nav("/cart")
    } finally {
      setAdding(null)
    }
  }

  return (
    <div className="page explore">
      <header className="page__head">
        <p className="journey__eyebrow">The reading</p>
        <h1 className="page__title">
          For {r.profile.full_name} — {r.profile.moon_sign} moon, {r.profile.sun_sign} sun
        </h1>
        <p className="page__sub">
          {r.profile.nakshatra ? `Born under ${r.profile.nakshatra}. ` : ""}
          {r.profile.approximate ? "Birth time unknown — chart cast for noon." : "Chart cast to the minute."}
          {r.synergy_note ? ` ${r.synergy_note}` : ""}
        </p>
      </header>

      {r.main && (
        <section className="explore__main">
          <GiftCard item={r.main} featured onAdd={() => handleAdd(r.main!)} adding={adding === r.main.id} />
        </section>
      )}

      {r.suggestions.length > 0 && (
        <>
          <h2 className="explore__subhead">If these speak to you</h2>
          <div className="explore__grid">
            {r.suggestions.map((s) => (
              <GiftCard key={s.id} item={s} onAdd={() => handleAdd(s)} adding={adding === s.id} />
            ))}
          </div>
        </>
      )}

      <div className="explore__actions">
        <button className="btn btn--ghost" onClick={() => nav("/shop")}>Browse the full vault</button>
        <button className="btn btn--ghost" onClick={() => nav("/journey")}>New reading</button>
      </div>
    </div>
  )
}
