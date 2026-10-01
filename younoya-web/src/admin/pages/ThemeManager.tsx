import React, { useState } from "react"
import { FolderHeart, Plus, Edit2, Trash2, X, Tag } from "lucide-react"

type Theme = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  productCount: number
  icon: string
}

const INITIAL_THEMES: Theme[] = [
  { id: "1", name: "Love & Connection", slug: "love-connection", category: "Relationship", description: "Products associated with romantic relationships, partnerships, and emotional bonds.", productCount: 8, icon: "💕" },
  { id: "2", name: "Career & Growth", slug: "career-growth", category: "Career", description: "Products symbolizing professional advancement, ambition, and recognition.", productCount: 6, icon: "📈" },
  { id: "3", name: "Money & Prosperity", slug: "money-prosperity", category: "Finance", description: "Products associated with financial abundance, wealth retention, and opportunity.", productCount: 5, icon: "💰" },
  { id: "4", name: "Calm & Balance", slug: "calm-balance", category: "Wellbeing", description: "Products supporting emotional equilibrium, mindfulness, and inner peace.", productCount: 4, icon: "🧘" },
  { id: "5", name: "New Beginnings", slug: "new-beginnings", category: "Growth", description: "Products symbolizing transformation, fresh starts, and change.", productCount: 3, icon: "🌱" },
  { id: "6", name: "Confidence", slug: "confidence", category: "Self", description: "Products associated with self-assurance, courage, and personal power.", productCount: 3, icon: "💪" },
  { id: "7", name: "Focus & Direction", slug: "focus-direction", category: "Mindset", description: "Products supporting clarity, decision-making, and purposeful action.", productCount: 4, icon: "🎯" },
  { id: "8", name: "Home & Harmony", slug: "home-harmony", category: "Vastu & Living", description: "Products for creating balanced, positive, and blessed living spaces.", productCount: 5, icon: "🏠" },
]

export default function ThemeManager() {
  const [themes, setThemes] = useState<Theme[]>(INITIAL_THEMES)
  const [showModal, setShowModal] = useState(false)
  const [editTheme, setEditTheme] = useState<Theme | null>(null)
  const [form, setForm] = useState({ name: "", slug: "", category: "Relationship", description: "", icon: "✨" })

  const openModal = (t: Theme | null = null) => {
    if (t) {
      setEditTheme(t)
      setForm({ name: t.name, slug: t.slug, category: t.category, description: t.description, icon: t.icon })
    } else {
      setEditTheme(null)
      setForm({ name: "", slug: "", category: "Relationship", description: "", icon: "✨" })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setEditTheme(null)
    setShowModal(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return

    if (editTheme) {
      setThemes((prev) =>
        prev.map((item) => (item.id === editTheme.id ? { ...item, ...form } : item))
      )
    } else {
      const newTheme: Theme = {
        id: String(Date.now()),
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        productCount: 0,
      }
      setThemes((prev) => [...prev, newTheme])
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this gift category?")) {
      setThemes((prev) => prev.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="ad__page ad__page--wide">
      <header className="ad__head ad__head--row">
        <div>
          <div className="ad-eyebrow">GIFT CATEGORIES & INTENTIONS</div>
          <h1 className="ad-page-title">Gift Categories</h1>
          <p className="ad-page-subtitle">
            Manage intention themes that categorize products for customer gifting and astrology recommendations.
          </p>
        </div>

        <button type="button" className="ad-btn-luxury" onClick={() => openModal()}>
          <Plus size={15} />
          <span>New Category</span>
        </button>
      </header>

      {/* Grid of Clean Luxury Cards */}
      <div className="ad-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {themes.map((t) => (
          <div
            key={t.id}
            className="ad-card"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 22px",
              background: "#FFFFFF",
              border: "1px solid var(--ad-border)",
              borderRadius: "18px",
              boxShadow: "0 4px 18px -10px rgba(44, 34, 28, 0.05)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{t.icon}</span>
              <span
                className="ad-chip"
                style={{
                  background: "rgba(44, 34, 28, 0.04)",
                  color: "var(--ad-ink-soft)",
                  border: "1px solid var(--ad-border)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                {t.category}
              </span>
            </div>

            <h3 style={{ margin: "0 0 6px 0", fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--ad-ink)", fontWeight: 500 }}>
              {t.name}
            </h3>

            <p style={{ color: "var(--ad-ink-soft)", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px 0", flex: 1 }}>
              {t.description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--ad-border-subtle)",
                paddingTop: "12px",
                marginTop: "auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--ad-ink-faint)", fontSize: "12px" }}>
                <Tag size={12} />
                <span>{t.productCount} products</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => openModal(t)}
                  className="ad-btn-plain"
                  style={{ padding: "4px 8px", fontSize: "12px", color: "var(--ad-gold-strong)" }}
                  title="Edit category"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="ad-btn-plain"
                  style={{ padding: "4px 8px", fontSize: "12px", color: "var(--ad-rose)" }}
                  title="Delete category"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Luxury Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(31, 25, 22, 0.45)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: "20px",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#FFFFFF",
              padding: "28px 32px",
              borderRadius: "20px",
              border: "1px solid var(--ad-border-gold)",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 40px -15px rgba(31, 25, 22, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--ad-ink)", fontWeight: 500 }}>
                {editTheme ? "Edit Gift Category" : "New Gift Category"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: "none", border: "none", color: "var(--ad-ink-soft)", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="ad-field">
                <span>Category Name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Love & Connection"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="ad-field">
                  <span>Slug (URL identifier)</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="e.g. love-connection"
                  />
                </div>

                <div className="ad-field">
                  <span>Icon / Symbol</span>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. 💕 or ✨"
                  />
                </div>
              </div>

              <div className="ad-field">
                <span>Group Classification</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Relationship">Relationship</option>
                  <option value="Career">Career & Success</option>
                  <option value="Finance">Finance & Wealth</option>
                  <option value="Wellbeing">Wellbeing & Peace</option>
                  <option value="Vastu & Living">Home & Vastu</option>
                  <option value="Growth">Growth & Transformation</option>
                  <option value="Self">Self & Confidence</option>
                </select>
              </div>

              <div className="ad-field">
                <span>Description</span>
                <textarea
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--ad-border)",
                    borderRadius: "12px",
                    padding: "12px",
                    color: "var(--ad-ink)",
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    minHeight: "80px",
                    outline: "none",
                  }}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the intention and symbolism of this gift category…"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={closeModal} className="ad-btn-plain">
                  Cancel
                </button>
                <button type="submit" className="ad-btn-luxury">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
