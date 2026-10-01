import React, { useEffect, useState } from "react"
import {
  Tag,
  BookOpen,
  Sparkles,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react"
import { api } from "../api"
import type { Product } from "../components/ProductEditModal"

export default function ProductMetadata() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"editorial" | "themes" | "details" | "seo">("editorial")

  // Form state
  const [story, setStory] = useState("")
  const [symbolism, setSymbolism] = useState("")
  const [materials, setMaterials] = useState("")
  const [dimensions, setDimensions] = useState("")
  const [careInstructions, setCareInstructions] = useState("")
  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])

  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load real products from Medusa
  useEffect(() => {
    setBusy(true)
    api<{ products: Product[] }>("/admin/products?limit=50")
      .then((res) => {
        const prods = res.products ?? []
        setProducts(prods)
        if (prods.length > 0 && !selectedProductId) {
          setSelectedProductId(prods[0].id)
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load products."))
      .finally(() => setBusy(false))
  }, [])

  // Sync form with selected product
  useEffect(() => {
    if (!selectedProductId) return
    const p = products.find((x) => x.id === selectedProductId)
    if (!p) return

    const meta = p.metadata || {}
    setStory(meta.editorial_story || p.description || "")
    setSymbolism(meta.symbolic_significance || meta.motif || p.subtitle || "")
    setMaterials(meta.materials || "Gold-finish brass, fine enamelling, crystal stones")
    setDimensions(meta.dimensions || '2.8" × 2.0" × 0.8"')
    setCareInstructions(meta.care_instructions || "Store in airtight velvet pouch. Wipe gently with dry microfiber cloth.")
    setSeoTitle(meta.seo_title || `${p.title} — Fine Jewellery Keepsake | YOUNOYA`)
    setSeoDescription(meta.seo_description || p.description?.slice(0, 155) || "")
    setSelectedThemes(meta.gift_guide_intentions || ["confidence-power"])
    setNotice(null)
    setError(null)
  }, [selectedProductId, products])

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) return

    setSaving(true)
    setError(null)
    setNotice(null)

    try {
      const p = selectedProduct
      const updatedMetadata = {
        ...(p?.metadata || {}),
        editorial_story: story.trim(),
        symbolic_significance: symbolism.trim(),
        materials: materials.trim(),
        dimensions: dimensions.trim(),
        care_instructions: careInstructions.trim(),
        seo_title: seoTitle.trim(),
        seo_description: seoDescription.trim(),
        gift_guide_intentions: selectedThemes,
      }

      await api(`/admin/products/${selectedProductId}`, {
        method: "POST",
        body: JSON.stringify({
          metadata: updatedMetadata,
        }),
      })

      setNotice("Product details and metadata saved successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product details.")
    } finally {
      setSaving(false)
    }
  }

  const toggleTheme = (themeKey: string) => {
    setSelectedThemes((prev) =>
      prev.includes(themeKey) ? prev.filter((t) => t !== themeKey) : [...prev, themeKey]
    )
  }

  return (
    <div className="ad__page ad__page--wide">
      <header className="ad__head">
        <div className="ad-eyebrow">PRODUCT DETAILS & SPECIFICATIONS</div>
        <h1 className="ad-page-title">Product Details & Stories</h1>
        <p className="ad-page-subtitle">
          Manage extended product information: Vedic stories, material specifications, gift categories, and SEO tags.
        </p>
      </header>

      {/* Product Selector */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ minWidth: "320px", flex: 1, maxWidth: "480px" }}>
          <div className="ad-field">
            <span>Select Product to Edit</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={busy}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--ad-border-gold)",
                color: "var(--ad-ink)",
                padding: "10px 14px",
                borderRadius: "12px",
                width: "100%",
                fontWeight: 500,
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.handle})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedProduct && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              background: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid var(--ad-border)",
            }}
          >
            <img
              src={selectedProduct.thumbnail || selectedProduct.images?.[0]?.url || "/products/placeholder.webp"}
              alt=""
              style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.src = "/media/shop-wild-poise-card.webp"
              }}
            />
            <div>
              <strong style={{ display: "block", fontSize: "13px", color: "var(--ad-ink)" }}>
                {selectedProduct.title}
              </strong>
              <small style={{ color: "var(--ad-ink-soft)", fontSize: "11px" }}>
                Status: {selectedProduct.status}
              </small>
            </div>
          </div>
        )}
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

      {selectedProduct && (
        <div
          className="ad-card"
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid var(--ad-border)",
            overflow: "hidden",
            boxShadow: "0 4px 20px -10px rgba(44, 34, 28, 0.05)",
          }}
        >
          {/* Tab Bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--ad-border)",
              background: "var(--ad-surface-soft)",
              overflowX: "auto",
            }}
          >
            {[
              { id: "editorial", label: "Story & Significance" },
              { id: "themes", label: "Gift Categories" },
              { id: "details", label: "Materials & Care" },
              { id: "seo", label: "Search & SEO" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid var(--ad-gold-strong)" : "2px solid transparent",
                  color: activeTab === tab.id ? "var(--ad-ink)" : "var(--ad-ink-soft)",
                  padding: "14px 20px",
                  cursor: "pointer",
                  fontFamily: "var(--font-label)",
                  fontSize: "12px",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  transition: "all var(--fc-dur-micro) ease",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} style={{ padding: "28px" }}>
            {activeTab === "editorial" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="ad-field">
                  <span>Editorial Story & Backstory</span>
                  <textarea
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--ad-border)",
                      color: "var(--ad-ink)",
                      padding: "12px",
                      borderRadius: "12px",
                      minHeight: "120px",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      outline: "none",
                    }}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Enter the authentic narrative and historical backstory of this keepsake…"
                  />
                </div>

                <div className="ad-field">
                  <span>Symbolic & Astrological Significance</span>
                  <textarea
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--ad-border)",
                      color: "var(--ad-ink)",
                      padding: "12px",
                      borderRadius: "12px",
                      minHeight: "100px",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      outline: "none",
                    }}
                    value={symbolism}
                    onChange={(e) => setSymbolism(e.target.value)}
                    placeholder="What does this piece represent according to Vedic symbolism and intentional gifting?"
                  />
                </div>
              </div>
            )}

            {activeTab === "themes" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <p style={{ color: "var(--ad-ink-soft)", margin: "0 0 8px", fontSize: "13px" }}>
                  Select which gift categories this product belongs to:
                </p>

                {[
                  { key: "confidence-power", label: "Confidence & Power" },
                  { key: "vitality-balance", label: "Vitality & Balance" },
                  { key: "love-connection", label: "Love & Connection" },
                  { key: "wealth-prosperity", label: "Wealth & Prosperity" },
                  { key: "protection", label: "Protection" },
                ].map((th) => {
                  const isChecked = selectedThemes.includes(th.key)
                  return (
                    <label
                      key={th.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: isChecked ? "var(--ad-gold-light)" : "var(--ad-bg)",
                        borderRadius: "10px",
                        border: isChecked ? "1px solid var(--ad-border-gold)" : "1px solid var(--ad-border)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTheme(th.key)}
                        style={{ width: "16px", height: "16px", accentColor: "var(--ad-gold-strong)" }}
                      />
                      <span style={{ color: "var(--ad-ink)", fontWeight: isChecked ? 600 : 400, flex: 1, fontSize: "14px" }}>
                        {th.label}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}

            {activeTab === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="ad-field">
                  <span>Materials & Craftsmanship</span>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. Natural Enamel, 22K Gold Finish Brass, Hand-set Crystals"
                  />
                </div>

                <div className="ad-field">
                  <span>Dimensions & Weight</span>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder='e.g. 5.5cm × 3.8cm · 28 grams'
                  />
                </div>

                <div className="ad-field">
                  <span>Care & Preservation Instructions</span>
                  <textarea
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--ad-border)",
                      color: "var(--ad-ink)",
                      padding: "12px",
                      borderRadius: "12px",
                      minHeight: "90px",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    value={careInstructions}
                    onChange={(e) => setCareInstructions(e.target.value)}
                    placeholder="How to care for this piece over time…"
                  />
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="ad-field">
                  <span>SEO Meta Title</span>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Search engine title tag…"
                  />
                </div>

                <div className="ad-field">
                  <span>SEO Meta Description</span>
                  <textarea
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--ad-border)",
                      color: "var(--ad-ink)",
                      padding: "12px",
                      borderRadius: "12px",
                      minHeight: "80px",
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description shown in Google search results (150-160 characters)…"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div
              style={{
                marginTop: "28px",
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "20px",
                borderTop: "1px solid var(--ad-border)",
              }}
            >
              <button
                type="submit"
                className="ad-btn-luxury"
                disabled={saving}
              >
                {saving ? "Saving Changes…" : "Save Details"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
