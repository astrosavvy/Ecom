import React, { useEffect, useMemo, useState } from "react"
import {
  Search,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Edit3,
  Package,
  Plus,
} from "lucide-react"
import { api, formatINR } from "../api"
import ProductEditModal, { type Product } from "../components/ProductEditModal"

const INTENTION_LABELS: Record<string, string> = {
  "all": "All Categories",
  "confidence-power": "Confidence & Power",
  "vitality-balance": "Vitality & Balance",
  "love-connection": "Love & Connection",
  "wealth-prosperity": "Wealth & Prosperity",
  "protection": "Protection",
}

const HEIRLOOM_METADATA: Record<string, { chapter: string; motif: string; intention: string; element: string }> = {
  "wild-poise": { chapter: "01", motif: "Jaguar", intention: "confidence-power", element: "Earth" },
  "the-golden-flight": { chapter: "02", motif: "Red Phoenix", intention: "confidence-power", element: "Fire" },
  "the-verdant-rising": { chapter: "03", motif: "Green Phoenix", intention: "vitality-balance", element: "Earth" },
  "flamingo-grace": { chapter: "04", motif: "Flamingo", intention: "love-connection", element: "Water" },
  "vivid-toucan-muse": { chapter: "05", motif: "Toucan", intention: "confidence-power", element: "Air" },
  "golden-instinct": { chapter: "06", motif: "Squirrel", intention: "wealth-prosperity", element: "Earth" },
  "fire-and-radiance": { chapter: "07", motif: "Scorpion", intention: "protection", element: "Fire" },
  "flamingo-aura": { chapter: "08", motif: "Flamingo", intention: "vitality-balance", element: "Water" },
  "cats-eye": { chapter: "09", motif: "Cat", intention: "protection", element: "Air" },
  "the-inner-kingdom": { chapter: "10", motif: "Leopard Pair", intention: "wealth-prosperity", element: "Earth" },
}

export default function Products() {
  const [rows, setRows] = useState<Product[]>([])
  const [q, setQ] = useState("")
  const [intentionFilter, setIntentionFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [busy, setBusy] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Interactive Product Editor Drawer / Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [creatingProduct, setCreatingProduct] = useState(false)

  const loadProducts = () => {
    setBusy(true)
    api<{ products: Product[] }>(`/admin/products?limit=50${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`)
      .then((d) => {
        setRows(d.products ?? [])
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load collection."))
      .finally(() => setBusy(false))
  }

  useEffect(() => {
    const id = window.setTimeout(loadProducts, q ? 250 : 0)
    return () => window.clearTimeout(id)
  }, [q])

  const handleSyncCatalog = async () => {
    setSyncing(true)
    setNotice(null)
    setError(null)
    try {
      const res = await api<{ count: number; message: string }>("/admin/gift-guide/catalog", { method: "POST" })
      setNotice(`Synchronized ${res.count} authentic brand products with Medusa.`)
      loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Catalog synchronization failed.")
    } finally {
      setSyncing(false)
    }
  }

  function priceOf(p: Product): number | undefined {
    const v = p.variants?.[0]
    const inr = v?.prices?.find((x) => x.currency_code === "inr") ?? v?.prices?.[0]
    return inr?.amount ?? v?.calculated_price?.calculated_amount
  }

  const filteredRows = useMemo(() => {
    if (intentionFilter === "all") return rows
    return rows.filter((p) => {
      const meta = HEIRLOOM_METADATA[p.handle] || {}
      const itemIntentions = p.metadata?.gift_guide_intentions || (meta.intention ? [meta.intention] : [])
      return itemIntentions.includes(intentionFilter)
    })
  }, [rows, intentionFilter])

  return (
    <div className="ad__page ad__page--wide">
      {/* Editorial Header */}
      <header className="ad__head ad__head--row">
        <div>
          <div className="ad-eyebrow">CATALOGUE & INVENTORY</div>
          <h1 className="ad-page-title">Product Collection</h1>
          <p className="ad-page-subtitle">
            Astrology-guided intentional keepsakes and brooches. Click any product to edit image, title, price, stock, and intention.
          </p>
        </div>

        <div className="ad-head-actions">
          <button
            type="button"
            className="ad-btn-luxury"
            onClick={() => {
              setCreatingProduct(true)
              setEditingProduct(null)
            }}
            title="Create a new brand product or keepsake"
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>

          <button
            type="button"
            className={`ad-btn-luxury ${syncing ? "ad-btn--loading" : ""}`}
            onClick={handleSyncCatalog}
            disabled={syncing || busy}
            title="Import or update authentic brooches into Medusa"
          >
            <RefreshCw size={14} className={syncing ? "ad-spin-icon" : ""} />
            <span>{syncing ? "Syncing..." : "Sync Catalog"}</span>
          </button>

          <div className="ad-view-toggle">
            <button
              type="button"
              className={`ad-view-btn ${viewMode === "grid" ? "is-active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              className={`ad-view-btn ${viewMode === "table" ? "is-active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
              aria-label="Table view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Atelier Metric Bar */}
      <div className="ad-metrics-ribbon">
        <div className="ad-metric-pill">
          <span className="ad-metric-num">{rows.length}</span>
          <span className="ad-metric-lbl">Total Products</span>
        </div>
        <div className="ad-metric-divider" />
        <div className="ad-metric-pill">
          <span className="ad-metric-num">{rows.filter((r) => r.status === "published").length}</span>
          <span className="ad-metric-lbl">Published Online</span>
        </div>
        <div className="ad-metric-divider" />
        <div className="ad-metric-pill">
          <span className="ad-metric-num">INR (₹)</span>
          <span className="ad-metric-lbl">Pricing Currency</span>
        </div>
        <div className="ad-metric-divider" />
        <div className="ad-metric-pill">
          <span className="ad-metric-num">5</span>
          <span className="ad-metric-lbl">Gift Categories</span>
        </div>
      </div>

      {/* Alerts */}
      {notice && (
        <div className="ad-alert ad-alert--success">
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="ad-alert-close">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="ad-alert ad-alert--danger">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ad-alert-close">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="ad-filter-bar">
        <div className="ad-search-wrap">
          <Search size={16} className="ad-search-icon" />
          <input
            className="ad-search-input"
            placeholder="Search products by name, handle, or motif…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <button type="button" className="ad-search-clear" onClick={() => setQ("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="ad-intention-pills">
          {Object.entries(INTENTION_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`ad-pill ${intentionFilter === key ? "is-selected" : ""}`}
              onClick={() => setIntentionFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Stage */}
      {busy && rows.length === 0 ? (
        <div className="ad-stage-empty">
          <span className="ad-boot__ring" />
          <p>Loading boutique collection…</p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="ad-stage-empty">
          <Sparkles size={28} className="ad-empty-icon" />
          <h3>No Products Found</h3>
          <p>No products match your current search or category filter.</p>
          {(q || intentionFilter !== "all") && (
            <button
              type="button"
              className="ad-btn-plain"
              onClick={() => {
                setQ("")
                setIntentionFilter("all")
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Luxury Grid View with Click-to-Edit */
        <div className="ad-heirloom-grid">
          {filteredRows.map((p, idx) => {
            const meta = HEIRLOOM_METADATA[p.handle]
            const chapter = meta?.chapter || String(idx + 1).padStart(2, "0")
            const motif = meta?.motif || p.subtitle || "Fine Jewellery Brooch"
            const element = meta?.element || (p.metadata?.element as string) || "Earth"
            const intentionKey = meta?.intention || p.metadata?.gift_guide_intentions?.[0]
            const intentionText = intentionKey ? INTENTION_LABELS[intentionKey] : undefined

            return (
              <div
                className="ad-heirloom-card"
                key={p.id}
                onClick={() => setEditingProduct(p)}
                style={{ cursor: "pointer", position: "relative" }}
                title="Click to edit image, price, stock & details"
              >
                <div className="ad-heirloom-card__visual">
                  <span className="ad-heirloom-card__chapter">PIECE {chapter}</span>
                  <span
                    className={`ad-badge ad-badge--${
                      p.status === "published" ? "published" : "draft"
                    }`}
                  >
                    {p.status}
                  </span>
                  <img
                    src={p.thumbnail || p.images?.[0]?.url || "/products/placeholder.webp"}
                    alt={p.title}
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (!img.src.includes("placeholder")) {
                        img.src = "/media/shop-wild-poise-card.webp"
                      }
                    }}
                  />
                  <div className="ad-heirloom-card__visual-sheen" />
                </div>

                <div className="ad-heirloom-card__content">
                  <div className="ad-heirloom-card__meta">
                    <span className="ad-heirloom-motif">{motif}</span>
                    <span className="ad-heirloom-element">· {element}</span>
                  </div>

                  <h3 className="ad-heirloom-title">{p.title}</h3>

                  {intentionText && (
                    <div className="ad-heirloom-intention">
                      <Tag size={11} />
                      <span>{intentionText}</span>
                    </div>
                  )}

                  <div className="ad-heirloom-card__footer">
                    <div className="ad-heirloom-price">
                      <small>Price</small>
                      <strong>{formatINR(priceOf(p))}</strong>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        type="button"
                        className="ad-btn-luxury"
                        style={{ padding: "6px 12px", fontSize: "11px" }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingProduct(p)
                        }}
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>

                      <a
                        href="/shop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ad-heirloom-view-btn"
                        onClick={(e) => e.stopPropagation()}
                        title="View on shop"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Luxury Table View with Click-to-Edit */
        <div className="ad-card ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Chapter & Motif</th>
                <th>Category / Intention</th>
                <th>Element</th>
                <th>Status</th>
                <th className="ad-right">Price</th>
                <th className="ad-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((p, idx) => {
                const meta = HEIRLOOM_METADATA[p.handle]
                const chapter = meta?.chapter || String(idx + 1).padStart(2, "0")
                const motif = meta?.motif || p.subtitle || "Brooch"
                const element = meta?.element || (p.metadata?.element as string) || "Earth"
                const intentionKey = meta?.intention || p.metadata?.gift_guide_intentions?.[0]
                const intentionText = intentionKey ? INTENTION_LABELS[intentionKey] : "—"

                return (
                  <tr
                    key={p.id}
                    onClick={() => setEditingProduct(p)}
                    style={{ cursor: "pointer" }}
                    title="Click to edit image, price, stock & details"
                  >
                    <td>
                      <div className="ad-table-product">
                        <img
                          src={p.thumbnail || p.images?.[0]?.url || "/products/placeholder.webp"}
                          alt=""
                          className="ad-table-img"
                        />
                        <div>
                          <strong>{p.title}</strong>
                          <span className="ad-table-handle">{p.handle}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ad-table-motif">
                        <span className="ad-table-chap">PIECE {chapter}</span>
                        <span>{motif}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ad-table-tag">{intentionText}</span>
                    </td>
                    <td>
                      <span className="ad-table-element">{element}</span>
                    </td>
                    <td>
                      <span
                        className={`ad-badge ad-badge--${
                          p.status === "published" ? "published" : "draft"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="ad-right">
                      <strong className="ad-table-price">{formatINR(priceOf(p))}</strong>
                    </td>
                    <td className="ad-right" onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                        <button
                          type="button"
                          className="ad-btn-plain"
                          style={{
                            border: "1px solid var(--ad-border-gold)",
                            borderRadius: "8px",
                            padding: "4px 10px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                          onClick={() => setEditingProduct(p)}
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <a
                          href="/shop"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ad-link-icon-btn"
                          title="View on shop"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Interactive Product Editor Modal (Create or Edit) */}
      <ProductEditModal
        product={editingProduct}
        isNew={creatingProduct}
        isOpen={!!editingProduct || creatingProduct}
        onClose={() => {
          setEditingProduct(null)
          setCreatingProduct(false)
        }}
        onSaved={() => {
          setNotice(creatingProduct ? "New product created and synced successfully!" : "Product updated and synced with store successfully!")
          setEditingProduct(null)
          setCreatingProduct(false)
          loadProducts()
        }}
      />
    </div>
  )
}
