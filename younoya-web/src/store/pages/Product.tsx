import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function Product() {
  const { handle } = useParams()
  const nav = useNavigate()
  const { addToCart } = useStore()
  const [product, setProduct] = useState<api.Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.getProduct(handle!).then(setProduct).finally(() => setLoading(false))
  }, [handle])

  if (loading) return <div className="page"><p className="page__empty">Lifting the lid…</p></div>
  if (!product) return <div className="page"><p className="page__empty">Not found in the vault.</p></div>

  const md = (product.metadata ?? {}) as Record<string, unknown>
  const vp = api.variantPrice(product)
  const price = vp.amount
  const original = vp.original ?? (typeof md.original_price_inr === "number" ? (md.original_price_inr as number) : null)

  async function add() {
    const variant = product?.variants?.[0]
    if (!variant) return
    setBusy(true)
    try {
      await addToCart(variant.id)
      nav("/cart")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page product">
      <div className="product__img">
        <img src={product.thumbnail ?? ""} alt={product.title} />
      </div>
      <div className="product__info">
        <p className="journey__eyebrow">{String(md.badge ?? "Consecrated")}</p>
        <h1 className="page__title">{product.title}</h1>
        {typeof md.subtitle === "string" && <p className="page__sub">{md.subtitle}</p>}
        <div className="product__price">
          <span className="product__now">{api.formatINR(price)}</span>
          {original && <span className="product__was">{api.formatINR(original)}</span>}
        </div>

        {typeof md.gemstone_crystal === "string" && (
          <p className="product__meta"><strong>Stone</strong> {md.gemstone_crystal}</p>
        )}
        {typeof md.sacred_deity === "string" && (
          <p className="product__meta"><strong>Deity</strong> {md.sacred_deity}</p>
        )}
        {typeof md.consecration_mantra === "string" && (
          <p className="product__meta"><strong>Consecration</strong> {md.consecration_mantra}</p>
        )}
        {Array.isArray(md.compatible_rashis) && (
          <p className="product__meta">
            <strong>Rashis</strong> {(md.compatible_rashis as string[]).join(", ")}
          </p>
        )}
        {Array.isArray(md.synergy_tags) && (
          <p className="product__meta">
            <strong>Intentions</strong> {(md.synergy_tags as string[]).join(" · ")}
          </p>
        )}

        <p className="product__desc">{product.description}</p>

        <button className="btn" onClick={add} disabled={busy || !product.variants?.length}>
          {busy ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </div>
  )
}
