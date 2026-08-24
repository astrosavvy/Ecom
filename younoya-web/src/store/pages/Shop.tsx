import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function Shop() {
  const { addToCart } = useStore()
  const [products, setProducts] = useState<api.Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)

  useEffect(() => {
    api.listProducts({ limit: 24 }).then((r) => setProducts(r.products)).finally(() => setLoading(false))
  }, [])

  async function handleAdd(p: api.Product) {
    const variant = p.variants?.[0]
    if (!variant) return
    setAdding(p.id)
    try {
      await addToCart(variant.id)
    } finally {
      setAdding(null)
    }
  }

  return (
    <div className="page">
      <header className="page__head">
        <p className="journey__eyebrow">The vault</p>
        <h1 className="page__title">Every piece awaits its sankalpa</h1>
        <p className="page__sub">Consecrated keepsakes, each aligned to planets, rashis and intentions.</p>
      </header>

      {loading ? (
        <p className="page__empty">Opening the vault…</p>
      ) : (
        <div className="shop__grid">
          {products.map((p) => {
            const md = p.metadata ?? {}
            const price = api.variantPrice(p).amount
            return (
              <article className="shopcard" key={p.id}>
                <Link to={`/product/${p.handle}`} className="shopcard__img">
                  <img src={p.thumbnail ?? ""} alt={p.title} loading="lazy" />
                </Link>
                <div className="shopcard__body">
                  <Link to={`/product/${p.handle}`}><h3>{p.title}</h3></Link>
                  {typeof md.subtitle === "string" && <p className="shopcard__sub">{md.subtitle}</p>}
                  <div className="shopcard__foot">
                    <span>{api.formatINR(price)}</span>
                    <button className="btn btn--sm" onClick={() => handleAdd(p)} disabled={adding === p.id}>
                      {adding === p.id ? "…" : "Add"}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
