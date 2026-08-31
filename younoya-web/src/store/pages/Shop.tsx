import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function Shop() {
  const { addToCart } = useStore()
  const [products, setProducts] = useState<api.Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState<string | null>(null)
  const [search] = useSearchParams()
  const chapter = search.get("chapter")
  const intention = search.get("intention")

  useEffect(() => {
    api.listProducts({ limit: 24 }).then((r) => setProducts(r.products)).finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    if (!chapter && !intention) return true
    const md = p.metadata as any
    const tags = [...(md.synergy_tags || []), ...(md.occasions || []), ...(md.compatible_rashis || [])].map((s: string) => String(s).toLowerCase())
    const want = (chapter || intention || "").toLowerCase()
    if (chapter === "love") return tags.some((t: string) => t.includes("love") || t.includes("venus") || t.includes("shukra"))
    if (chapter === "becoming") return tags.some((t: string) => t.includes("career") || t.includes("confidence") || t.includes("focus"))
    if (chapter === "shelter") return tags.some((t: string) => t.includes("calm") || t.includes("home") || t.includes("vastu"))
    return want ? tags.some((t: string) => t.includes(want)) : true
  })

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

      {(chapter || intention) && <p style={{ fontFamily: "var(--yn-font-label)", fontSize: 11, color: "var(--yn-gold-strong)", marginBottom: 12 }}>Filtered by {chapter || intention} · {filtered.length} keepsakes · <Link to="/shop" style={{ color: "var(--yn-gold-strong)", textDecoration: "underline" }}>Clear</Link></p>}
      {loading ? (
        <p className="page__empty">Opening the vault…</p>
      ) : (
        <div className="shop__grid">
          {filtered.map((p) => {
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
                    {api.purchaseType(p) === "enquire" ? (
                      <Link to={`/product/${p.handle}#enquire`} className="btn btn--sm" style={{ textDecoration: "none" }}>Enquire</Link>
                    ) : (
                      <button className="btn btn--sm" onClick={() => handleAdd(p)} disabled={adding === p.id}>
                        {adding === p.id ? "…" : "Add"}
                      </button>
                    )}
                  </div>
                  {api.purchaseType(p) === "enquire" && <p style={{ fontFamily: "var(--yn-font-label)", fontSize: 9, color: "rgba(26,26,30,0.5)", marginTop: 4, textAlign: "center" }}>Remedial · check dasha</p>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
