import { useEffect, useState } from "react"
import { api, formatINR } from "../api"

type Variant = { id: string; title: string; prices?: Array<{ amount: number; currency_code: string }>; calculated_price?: { calculated_amount?: number } }
type Product = {
  id: string
  title: string
  handle: string
  status: string
  thumbnail?: string | null
  images?: Array<{ url: string }>
  variants: Variant[]
}

export default function Products() {
  const [rows, setRows] = useState<Product[]>([])
  const [q, setQ] = useState("")
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setBusy(true)
      api(`/admin/products?limit=50${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`)
        .then((d: any) => {
          setRows(d.products ?? [])
          setError(null)
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Could not load products."))
        .finally(() => setBusy(false))
    }, q ? 250 : 0)
    return () => window.clearTimeout(id)
  }, [q])

  function priceOf(p: Product): number | undefined {
    const v = p.variants?.[0]
    const inr = v?.prices?.find((x) => x.currency_code === "inr") ?? v?.prices?.[0]
    return inr?.amount ?? v?.calculated_price?.calculated_amount
  }

  return (
    <div className="ad__page">
      <header className="ad__head">
        <h1>Products</h1>
        <p>The full catalogue. Price and stock editing arrives in the next update.</p>
      </header>
      <input className="ad-search" placeholder="Search gifts…" value={q} onChange={(e) => setQ(e.target.value)} />
      {error && <p className="ad-error">{error}</p>}
      <div className="ad-grid">
        {busy && rows.length === 0 && <p className="ad-empty">Loading…</p>}
        {!busy && rows.length === 0 && <p className="ad-empty">No products found.</p>}
        {rows.map((p) => (
          <div className="ad-product" key={p.id}>
            <div className="ad-product__img">
              <img src={p.thumbnail || p.images?.[0]?.url || "/products/placeholder.webp"} alt="" loading="lazy" />
            </div>
            <div className="ad-product__body">
              <strong>{p.title}</strong>
              <span>{formatINR(priceOf(p))}</span>
            </div>
            <span className={`ad-chip ad-chip--${p.status === "published" ? "ok" : "mut"}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
