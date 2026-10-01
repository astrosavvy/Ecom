import React, { useState } from "react"
import { Scale, Plus, Edit2, Trash2, X, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react"

type Rule = {
  id: string
  name: string
  conditions: {
    rashi?: string
    dasha?: string
    theme?: string
  }
  products: Array<{ name: string; priority: "high" | "medium" }>
  active: boolean
}

const INITIAL_RULES: Rule[] = [
  {
    id: "1",
    name: "Aries Career Alignment",
    conditions: { rashi: "Mesha (Aries)", theme: "Career & Growth" },
    products: [
      { name: "WILD POISE (Jaguar Brooch)", priority: "high" },
      { name: "VIVID TOUCAN MUSE", priority: "medium" },
    ],
    active: true,
  },
  {
    id: "2",
    name: "Venus Dasha Love & Devotion",
    conditions: { dasha: "Venus", theme: "Love & Connection" },
    products: [
      { name: "FLAMINGO GRACE", priority: "high" },
      { name: "FLAMINGO AURA", priority: "medium" },
    ],
    active: true,
  },
  {
    id: "3",
    name: "Saturn Dasha Wealth & Grounding",
    conditions: { dasha: "Saturn", theme: "Money & Prosperity" },
    products: [
      { name: "GOLDEN INSTINCT", priority: "high" },
      { name: "THE INNER KINGDOM", priority: "medium" },
    ],
    active: true,
  },
]

export default function RecommendationRules() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES)
  const [showModal, setShowModal] = useState(false)
  const [editRule, setEditRule] = useState<Rule | null>(null)
  const [form, setForm] = useState<Partial<Rule>>({
    name: "",
    conditions: { rashi: "Mesha (Aries)", dasha: "Venus", theme: "Career & Growth" },
    products: [{ name: "WILD POISE", priority: "high" }],
    active: true,
  })

  const openModal = (r: Rule | null = null) => {
    if (r) {
      setEditRule(r)
      setForm({ ...r })
    } else {
      setEditRule(null)
      setForm({
        name: "",
        conditions: { rashi: "Mesha (Aries)", dasha: "Venus", theme: "Career & Growth" },
        products: [{ name: "WILD POISE", priority: "high" }],
        active: true,
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setEditRule(null)
    setShowModal(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim()) return

    if (editRule) {
      setRules((prev) =>
        prev.map((r) => (r.id === editRule.id ? ({ ...r, ...form } as Rule) : r))
      )
    } else {
      const newRule: Rule = {
        id: String(Date.now()),
        name: form.name!,
        conditions: form.conditions || {},
        products: form.products || [],
        active: form.active ?? true,
      }
      setRules((prev) => [...prev, newRule])
    }
    closeModal()
  }

  const toggleActive = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this recommendation rule?")) {
      setRules((prev) => prev.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="ad__page ad__page--wide">
      <header className="ad__head ad__head--row">
        <div>
          <div className="ad-eyebrow">GIFT FINDER LOGIC</div>
          <h1 className="ad-page-title">Quiz Recommendation Rules</h1>
          <p className="ad-page-subtitle">
            Configure how visitor astrological signs, dashas, and intentions map to recommended brand products.
          </p>
        </div>

        <button type="button" className="ad-btn-luxury" onClick={() => openModal()}>
          <Plus size={15} />
          <span>New Quiz Rule</span>
        </button>
      </header>

      {/* Rules List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {rules.map((r) => (
          <div
            key={r.id}
            className="ad-card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 24px",
              background: "#FFFFFF",
              border: "1px solid var(--ad-border)",
              borderRadius: "18px",
              boxShadow: "0 4px 18px -10px rgba(44, 34, 28, 0.05)",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    color: "var(--ad-ink)",
                    fontWeight: 500,
                  }}
                >
                  {r.name}
                </h3>
                <button
                  type="button"
                  onClick={() => toggleActive(r.id)}
                  className={`ad-chip ${r.active ? "ad-chip--ok" : "ad-chip--mut"}`}
                  style={{ cursor: "pointer", border: "none" }}
                  title="Click to toggle active status"
                >
                  {r.active ? "Active" : "Inactive"}
                </button>
              </div>

              {/* Conditions Row */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                {Object.entries(r.conditions).map(([k, v]) => (
                  <span
                    key={k}
                    style={{
                      background: "rgba(44, 34, 28, 0.04)",
                      border: "1px solid var(--ad-border)",
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "var(--ad-ink-soft)",
                    }}
                  >
                    <strong style={{ textTransform: "capitalize", color: "var(--ad-gold-strong)" }}>{k}:</strong> {v}
                  </span>
                ))}
              </div>

              {/* Products Row */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ad-ink-faint)", fontWeight: 600 }}>
                  Recommended:
                </span>
                {r.products.map((p, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "12px",
                      color: "var(--ad-ink)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "var(--ad-gold-light)",
                      border: "1px solid var(--ad-border-gold)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    <span style={{ color: p.priority === "high" ? "var(--ad-gold-strong)" : "var(--ad-ink-soft)" }}>★</span>
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => openModal(r)}
                className="ad-btn-plain"
                style={{ padding: "6px 12px", color: "var(--ad-gold-strong)" }}
              >
                Edit Rule
              </button>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                className="ad-btn-plain"
                style={{ padding: "6px 12px", color: "var(--ad-rose)" }}
              >
                Delete
              </button>
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
              maxWidth: "550px",
              boxShadow: "0 20px 40px -15px rgba(31, 25, 22, 0.2)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--ad-ink)", fontWeight: 500 }}>
                {editRule ? "Edit Quiz Rule" : "Create New Quiz Rule"}
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
                <span>Rule Name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Leo Confidence Boost"
                />
              </div>

              <div
                style={{
                  background: "var(--ad-surface-soft)",
                  border: "1px solid var(--ad-border)",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ad-gold-strong)" }}>
                  Trigger Conditions
                </span>

                <div className="ad-field">
                  <span>If Zodiac / Rashi</span>
                  <select
                    value={form.conditions?.rashi || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        conditions: { ...form.conditions, rashi: e.target.value },
                      })
                    }
                  >
                    <option value="">Any Zodiac Sign</option>
                    <option value="Mesha (Aries)">Mesha (Aries)</option>
                    <option value="Vrishabha (Taurus)">Vrishabha (Taurus)</option>
                    <option value="Mithuna (Gemini)">Mithuna (Gemini)</option>
                    <option value="Karka (Cancer)">Karka (Cancer)</option>
                    <option value="Simha (Leo)">Simha (Leo)</option>
                    <option value="Kanya (Virgo)">Kanya (Virgo)</option>
                    <option value="Tula (Libra)">Tula (Libra)</option>
                    <option value="Vrishchika (Scorpio)">Vrishchika (Scorpio)</option>
                    <option value="Dhanu (Sagittarius)">Dhanu (Sagittarius)</option>
                    <option value="Makara (Capricorn)">Makara (Capricorn)</option>
                    <option value="Kumbha (Aquarius)">Kumbha (Aquarius)</option>
                    <option value="Meena (Pisces)">Meena (Pisces)</option>
                  </select>
                </div>

                <div className="ad-field">
                  <span>And Planetary Dasha</span>
                  <select
                    value={form.conditions?.dasha || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        conditions: { ...form.conditions, dasha: e.target.value },
                      })
                    }
                  >
                    <option value="">Any Dasha</option>
                    <option value="Sun">Sun (Surya)</option>
                    <option value="Moon">Moon (Chandra)</option>
                    <option value="Mars">Mars (Mangal)</option>
                    <option value="Mercury">Mercury (Budh)</option>
                    <option value="Jupiter">Jupiter (Guru)</option>
                    <option value="Venus">Venus (Shukra)</option>
                    <option value="Saturn">Saturn (Shani)</option>
                    <option value="Rahu">Rahu</option>
                    <option value="Ketu">Ketu</option>
                  </select>
                </div>

                <div className="ad-field">
                  <span>Then Category</span>
                  <select
                    value={form.conditions?.theme || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        conditions: { ...form.conditions, theme: e.target.value },
                      })
                    }
                  >
                    <option value="Career & Growth">Career & Growth</option>
                    <option value="Love & Connection">Love & Connection</option>
                    <option value="Money & Prosperity">Money & Prosperity</option>
                    <option value="Calm & Balance">Calm & Balance</option>
                    <option value="New Beginnings">New Beginnings</option>
                    <option value="Confidence">Confidence & Power</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" onClick={closeModal} className="ad-btn-plain">
                  Cancel
                </button>
                <button type="submit" className="ad-btn-luxury">
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
