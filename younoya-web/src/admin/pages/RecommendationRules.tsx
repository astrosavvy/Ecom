import React, { useEffect, useState } from "react"
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Star,
  Gift,
  Tag,
  BookOpen,
  Layers,
} from "lucide-react"
import { api, formatINR } from "../api"
import type { Product } from "../components/ProductEditModal"

export type RecommendationItem = {
  productId: string
  title: string
  handle: string
  thumbnail?: string
  priceINR?: number
  category: string
  reason: string
}

export type HamperRule = {
  id: string
  name: string
  targetCategory: string
  zodiacSign?: string
  dashaPeriod?: string
  active: boolean
  lead: RecommendationItem
  secondary1: RecommendationItem
  secondary2: RecommendationItem
}

const CATEGORY_OPTIONS = [
  { value: "confidence-power", label: "Confidence & Power" },
  { value: "vitality-balance", label: "Vitality & Balance" },
  { value: "love-connection", label: "Love & Connection" },
  { value: "wealth-prosperity", label: "Wealth & Prosperity" },
  { value: "protection", label: "Protection" },
]

const ZODIAC_OPTIONS = [
  "All Signs",
  "Mesha (Aries)",
  "Vrishabha (Taurus)",
  "Mithuna (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrischika (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Meena (Pisces)",
]

const INITIAL_RULES: HamperRule[] = [
  {
    id: "rule_1",
    name: "Career Rising & Ambition Set",
    targetCategory: "confidence-power",
    zodiacSign: "Mesha (Aries)",
    dashaPeriod: "Sun",
    active: true,
    lead: {
      productId: "prod_01M3W4767JCGK886Z50Z3R788W",
      title: "THE GOLDEN FLIGHT",
      handle: "the-golden-flight",
      thumbnail: "/media/shop-golden-flight-card.webp",
      priceINR: 2550,
      category: "Confidence & Power",
      reason: "Curated as the lead gift because the Phoenix represents transformative career ascension, fierce vision, and fiery determination.",
    },
    secondary1: {
      productId: "prod_01M3W475K0YB0PN0EW46HFKATN",
      title: "WILD POISE",
      handle: "wild-poise",
      thumbnail: "/media/shop-wild-poise-card.webp",
      priceINR: 2499,
      category: "Confidence & Power",
      reason: "Brings steady poise and stealth composure to complement the fiery leadership of your lead piece.",
    },
    secondary2: {
      productId: "prod_01M3W47JSDM2H57B0W2YF8J679",
      title: "THE INNER KINGDOM",
      handle: "the-inner-kingdom",
      thumbnail: "/media/shop-inner-kingdom-card.webp",
      priceINR: 2499,
      category: "Wealth & Prosperity",
      reason: "Anchors material prosperity and sustained security in your personal work sanctuary.",
    },
  },
  {
    id: "rule_2",
    name: "Devotion, Love & Heart Harmony Set",
    targetCategory: "love-connection",
    zodiacSign: "Vrishabha (Taurus)",
    dashaPeriod: "Venus",
    active: true,
    lead: {
      productId: "prod_01M3W47FHHZ02Z5YQ4S9X29N15",
      title: "FLAMINGO GRACE",
      handle: "flamingo-grace",
      thumbnail: "/media/shop-flamingo-grace-card.webp",
      priceINR: 2250,
      category: "Love & Connection",
      reason: "The quintessential heart-chakra keepsake, channeling Venusian elegance, emotional warmth, and fidelity.",
    },
    secondary1: {
      productId: "prod_01M3W47J4094R85XQ1Z87H5M59",
      title: "FLAMINGO AURA",
      handle: "flamingo-aura",
      thumbnail: "/media/shop-flamingo-aura-card.webp",
      priceINR: 1950,
      category: "Vitality & Balance",
      reason: "Introduces gentle water-element equilibrium, soothing daily stress and opening reciprocal communication.",
    },
    secondary2: {
      productId: "prod_01M3W47H6610Z06H6TXZMGB776",
      title: "GOLDEN INSTINCT",
      handle: "golden-instinct",
      thumbnail: "/media/shop-golden-instinct-card.webp",
      priceINR: 1850,
      category: "Wealth & Prosperity",
      reason: "Symbolizes gathering mutual blessings, thoughtful nurturing, and lasting domestic harmony.",
    },
  },
]

export default function RecommendationRules() {
  const [rules, setRules] = useState<HamperRule[]>(() => {
    try {
      const cached = localStorage.getItem("yn_hamper_rules")
      return cached ? JSON.parse(cached) : INITIAL_RULES
    } catch {
      return INITIAL_RULES
    }
  })

  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState<HamperRule | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState("")
  const [targetCategory, setTargetCategory] = useState("confidence-power")
  const [zodiacSign, setZodiacSign] = useState("All Signs")
  const [dashaPeriod, setDashaPeriod] = useState("All Periods")
  const [active, setActive] = useState(true)

  // 1 Primary Hamper State
  const [leadProduct, setLeadProduct] = useState("")
  const [leadCategory, setLeadCategory] = useState("Confidence & Power")
  const [leadReason, setLeadReason] = useState("")

  // Secondary #1 State
  const [sec1Product, setSec1Product] = useState("")
  const [sec1Category, setSec1Category] = useState("Vitality & Balance")
  const [sec1Reason, setSec1Reason] = useState("")

  // Secondary #2 State
  const [sec2Product, setSec2Product] = useState("")
  const [sec2Category, setSec2Category] = useState("Wealth & Prosperity")
  const [sec2Reason, setSec2Reason] = useState("")

  // Load available catalog products
  useEffect(() => {
    api<{ products: Product[] }>("/admin/products?limit=50")
      .then((res) => {
        setProducts(res.products || [])
      })
      .catch((e) => console.error("Could not fetch products for rules:", e))
  }, [])

  // Sync to local storage
  const saveRulesToStorage = (updated: HamperRule[]) => {
    setRules(updated)
    try {
      localStorage.setItem("yn_hamper_rules", JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  const openModal = (r: HamperRule | null = null) => {
    if (r) {
      setEditingRule(r)
      setName(r.name)
      setTargetCategory(r.targetCategory)
      setZodiacSign(r.zodiacSign || "All Signs")
      setDashaPeriod(r.dashaPeriod || "All Periods")
      setActive(r.active)

      setLeadProduct(r.lead.handle)
      setLeadCategory(r.lead.category)
      setLeadReason(r.lead.reason)

      setSec1Product(r.secondary1.handle)
      setSec1Category(r.secondary1.category)
      setSec1Reason(r.secondary1.reason)

      setSec2Product(r.secondary2.handle)
      setSec2Category(r.secondary2.category)
      setSec2Reason(r.secondary2.reason)
    } else {
      setEditingRule(null)
      setName("")
      setTargetCategory("confidence-power")
      setZodiacSign("All Signs")
      setDashaPeriod("All Periods")
      setActive(true)

      const p0 = products[0]?.handle || "wild-poise"
      const p1 = products[1]?.handle || "the-golden-flight"
      const p2 = products[2]?.handle || "the-verdant-rising"

      setLeadProduct(p0)
      setLeadCategory("Confidence & Power")
      setLeadReason("Curated as the primary centerpiece gift for its profound symbolic resonance and bold energy.")

      setSec1Product(p1)
      setSec1Category("Vitality & Balance")
      setSec1Reason("A complementary harmony piece to nurture wellbeing and inner alignment.")

      setSec2Product(p2)
      setSec2Category("Wealth & Prosperity")
      setSec2Reason("An auspicious grounding piece chosen to invite steady abundance.")
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRule(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const findProd = (handleOrId: string) => {
      const match = products.find((p) => p.handle === handleOrId || p.id === handleOrId)
      return {
        productId: match?.id || handleOrId,
        title: match?.title || handleOrId.toUpperCase().replace(/-/g, " "),
        handle: match?.handle || handleOrId,
        thumbnail: match?.thumbnail || match?.images?.[0]?.url || "/media/shop-wild-poise-card.webp",
        priceINR: match?.variants?.[0]?.prices?.[0]?.amount
          ? Math.round(match.variants[0].prices[0].amount / 100)
          : 2499,
      }
    }

    const leadInfo = findProd(leadProduct)
    const sec1Info = findProd(sec1Product)
    const sec2Info = findProd(sec2Product)

    const updatedLead: RecommendationItem = {
      ...leadInfo,
      category: leadCategory,
      reason: leadReason.trim(),
    }

    const updatedSec1: RecommendationItem = {
      ...sec1Info,
      category: sec1Category,
      reason: sec1Reason.trim(),
    }

    const updatedSec2: RecommendationItem = {
      ...sec2Info,
      category: sec2Category,
      reason: sec2Reason.trim(),
    }

    const ruleData: HamperRule = {
      id: editingRule ? editingRule.id : `rule_${Date.now()}`,
      name: name.trim(),
      targetCategory,
      zodiacSign: zodiacSign !== "All Signs" ? zodiacSign : undefined,
      dashaPeriod: dashaPeriod !== "All Periods" ? dashaPeriod : undefined,
      active,
      lead: updatedLead,
      secondary1: updatedSec1,
      secondary2: updatedSec2,
    }

    let nextRules: HamperRule[]
    if (editingRule) {
      nextRules = rules.map((r) => (r.id === editingRule.id ? ruleData : r))
    } else {
      nextRules = [ruleData, ...rules]
    }

    saveRulesToStorage(nextRules)

    // Sync to Medusa backend rules API
    try {
      await api("/admin/rules", {
        method: "POST",
        body: JSON.stringify({
          name: ruleData.name,
          conditions: {
            category: ruleData.targetCategory,
            zodiac: ruleData.zodiacSign,
            dasha: ruleData.dashaPeriod,
          },
          actions: {
            lead: ruleData.lead,
            secondaries: [ruleData.secondary1, ruleData.secondary2],
          },
        }),
      })
    } catch {
      /* preserved in local storage if backend table format differs */
    }

    setNotice("Gift recommendation rule saved successfully!")
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this recommendation set?")) {
      const filtered = rules.filter((r) => r.id !== id)
      saveRulesToStorage(filtered)
    }
  }

  return (
    <div className="ad__page ad__page--wide">
      {/* Studio Header */}
      <header className="ad__head ad__head--row">
        <div>
          <div className="ad-eyebrow">CURATION & GIFT RECOMMENDATIONS</div>
          <h1 className="ad-page-title">Gift Hampers & Recommendations</h1>
          <p className="ad-page-subtitle">
            Configure the exact trio of recommendations (1 Primary Lead Hamper + 2 Alternative Hampers with distinct reasons) for Aster’s Gift Finder.
          </p>
        </div>

        <button type="button" className="ad-btn-luxury" onClick={() => openModal()}>
          <Plus size={15} />
          <span>New Recommendation Rule</span>
        </button>
      </header>

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

      {/* Rules List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="ad-card"
            style={{
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid var(--ad-border-gold)",
              padding: "24px",
              boxShadow: "0 4px 20px -8px rgba(44, 34, 28, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Rule Top Bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    background: "var(--ad-gold-light)",
                    color: "var(--ad-ink)",
                    fontFamily: "var(--font-label)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--ad-border-gold)",
                  }}
                >
                  {rule.targetCategory.replace("-", " & ")}
                </span>
                <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--ad-ink)", fontWeight: 500 }}>
                  {rule.name}
                </h3>
                {rule.zodiacSign && (
                  <small style={{ color: "var(--ad-ink-soft)", fontSize: "12px" }}>
                    · {rule.zodiacSign}
                  </small>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="ad-btn-plain"
                  style={{ border: "1px solid var(--ad-border)", borderRadius: "8px", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}
                  onClick={() => openModal(rule)}
                >
                  <Edit2 size={13} />
                  <span>Edit Rule</span>
                </button>
                <button
                  type="button"
                  className="ad-btn-plain"
                  style={{ border: "1px solid var(--ad-border)", borderRadius: "8px", padding: "6px 10px", color: "var(--ad-rose)" }}
                  onClick={() => handleDelete(rule.id)}
                  title="Remove this rule"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Recommendation Trio Showcase Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "16px" }}>
              {/* 1. Primary Recommendation */}
              <div
                style={{
                  background: "var(--ad-surface-soft)",
                  borderRadius: "14px",
                  border: "1.5px solid var(--ad-gold)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "var(--ad-gold)",
                      color: "#FFFFFF",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    <Star size={11} fill="#FFFFFF" />
                    PRIMARY LEAD HAMPER
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-gold-strong)" }}>
                    {rule.lead.category}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={rule.lead.thumbnail}
                    alt={rule.lead.title}
                    style={{ width: "52px", height: "52px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--ad-border)" }}
                    onError={(e) => { e.currentTarget.src = "/media/shop-wild-poise-card.webp" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "var(--ad-ink)" }}>
                      {rule.lead.title}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--ad-ink-soft)" }}>
                      {formatINR((rule.lead.priceINR || 2499) * 100)}
                    </span>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--ad-border)" }}>
                  <small style={{ display: "block", color: "var(--ad-ink-soft)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "4px" }}>
                    Lead Recommendation Reason:
                  </small>
                  <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, color: "var(--ad-ink)" }}>
                    "{rule.lead.reason}"
                  </p>
                </div>
              </div>

              {/* 2. Secondary Recommendation #1 */}
              <div
                style={{
                  background: "var(--ad-bg)",
                  borderRadius: "14px",
                  border: "1px solid var(--ad-border)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ad-ink-soft)" }}>
                    ALTERNATIVE RECOMMENDATION 1
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-ink)" }}>
                    {rule.secondary1.category}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={rule.secondary1.thumbnail}
                    alt={rule.secondary1.title}
                    style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--ad-border)" }}
                    onError={(e) => { e.currentTarget.src = "/media/shop-wild-poise-card.webp" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--ad-ink)" }}>
                      {rule.secondary1.title}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--ad-ink-soft)" }}>
                      {formatINR((rule.secondary1.priceINR || 2499) * 100)}
                    </span>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--ad-border)", flex: 1 }}>
                  <small style={{ display: "block", color: "var(--ad-ink-soft)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "4px" }}>
                    Reason 1:
                  </small>
                  <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, color: "var(--ad-ink)" }}>
                    "{rule.secondary1.reason}"
                  </p>
                </div>
              </div>

              {/* 3. Secondary Recommendation #2 */}
              <div
                style={{
                  background: "var(--ad-bg)",
                  borderRadius: "14px",
                  border: "1px solid var(--ad-border)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ad-ink-soft)" }}>
                    ALTERNATIVE RECOMMENDATION 2
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--ad-ink)" }}>
                    {rule.secondary2.category}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={rule.secondary2.thumbnail}
                    alt={rule.secondary2.title}
                    style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--ad-border)" }}
                    onError={(e) => { e.currentTarget.src = "/media/shop-wild-poise-card.webp" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "var(--ad-ink)" }}>
                      {rule.secondary2.title}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--ad-ink-soft)" }}>
                      {formatINR((rule.secondary2.priceINR || 2499) * 100)}
                    </span>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--ad-border)", flex: 1 }}>
                  <small style={{ display: "block", color: "var(--ad-ink-soft)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "4px" }}>
                    Reason 2:
                  </small>
                  <p style={{ margin: 0, fontSize: "12px", lineHeight: 1.5, color: "var(--ad-ink)" }}>
                    "{rule.secondary2.reason}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spacious Studio Modal */}
      {showModal && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal-card">
            <div className="ad-modal-header">
              <div>
                <span style={{ fontFamily: "var(--font-label)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ad-gold-strong)", fontWeight: 700 }}>
                  RECOMMENDATION ENGINE CONFIGURATION
                </span>
                <h2 style={{ margin: "4px 0 0", fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--ad-ink)", fontWeight: 500 }}>
                  {editingRule ? "Edit Hamper Recommendation Rule" : "New Hamper Recommendation Rule"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: "none", border: "none", color: "var(--ad-ink-soft)", cursor: "pointer", padding: "6px" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="ad-modal-body">
              {/* Rule Identity */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
                <div className="ad-field">
                  <span>Rule Name</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Executive Career Advancement Hamper Trio"
                  />
                </div>

                <div className="ad-field">
                  <span>Trigger Gift Category</span>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 1. Primary Hamper Section */}
              <div style={{ background: "var(--ad-surface-soft)", padding: "18px 20px", borderRadius: "14px", border: "1.5px solid var(--ad-gold)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <Star size={16} color="var(--ad-gold-strong)" fill="var(--ad-gold-strong)" />
                  <strong style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ad-ink)" }}>
                    1. Primary Lead Gift Hamper / Piece
                  </strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "14px", marginBottom: "12px" }}>
                  <div className="ad-field">
                    <span>Select Product or Hamper</span>
                    <select
                      value={leadProduct}
                      onChange={(e) => setLeadProduct(e.target.value)}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.handle}>
                          {p.title} ({p.handle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ad-field">
                    <span>Category Tag</span>
                    <input
                      type="text"
                      value={leadCategory}
                      onChange={(e) => setLeadCategory(e.target.value)}
                      placeholder="e.g. Confidence & Power"
                    />
                  </div>
                </div>

                <div className="ad-field">
                  <span>Primary Recommendation Reason (Shown to customer)</span>
                  <textarea
                    required
                    value={leadReason}
                    onChange={(e) => setLeadReason(e.target.value)}
                    placeholder="Explain why this lead piece is recommended for their situation, astrology, or life moment…"
                  />
                </div>
              </div>

              {/* 2. Secondary Recommendation 1 */}
              <div style={{ background: "var(--ad-bg)", padding: "18px 20px", borderRadius: "14px", border: "1px solid var(--ad-border)" }}>
                <strong style={{ display: "block", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ad-ink-soft)", marginBottom: "12px" }}>
                  2. Alternative Recommendation 1 (2nd Category)
                </strong>

                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "14px", marginBottom: "12px" }}>
                  <div className="ad-field">
                    <span>Select Product or Hamper</span>
                    <select
                      value={sec1Product}
                      onChange={(e) => setSec1Product(e.target.value)}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.handle}>
                          {p.title} ({p.handle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ad-field">
                    <span>Category Tag</span>
                    <input
                      type="text"
                      value={sec1Category}
                      onChange={(e) => setSec1Category(e.target.value)}
                      placeholder="e.g. Vitality & Balance"
                    />
                  </div>
                </div>

                <div className="ad-field">
                  <span>Distinct Reason 1</span>
                  <textarea
                    required
                    value={sec1Reason}
                    onChange={(e) => setSec1Reason(e.target.value)}
                    placeholder="Distinct reason for this second recommendation…"
                  />
                </div>
              </div>

              {/* 3. Secondary Recommendation 2 */}
              <div style={{ background: "var(--ad-bg)", padding: "18px 20px", borderRadius: "14px", border: "1px solid var(--ad-border)" }}>
                <strong style={{ display: "block", fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ad-ink-soft)", marginBottom: "12px" }}>
                  3. Alternative Recommendation 2 (3rd Category)
                </strong>

                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "14px", marginBottom: "12px" }}>
                  <div className="ad-field">
                    <span>Select Product or Hamper</span>
                    <select
                      value={sec2Product}
                      onChange={(e) => setSec2Product(e.target.value)}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.handle}>
                          {p.title} ({p.handle})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="ad-field">
                    <span>Category Tag</span>
                    <input
                      type="text"
                      value={sec2Category}
                      onChange={(e) => setSec2Category(e.target.value)}
                      placeholder="e.g. Wealth & Prosperity"
                    />
                  </div>
                </div>

                <div className="ad-field">
                  <span>Distinct Reason 2</span>
                  <textarea
                    required
                    value={sec2Reason}
                    onChange={(e) => setSec2Reason(e.target.value)}
                    placeholder="Distinct reason for this third recommendation…"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="ad-modal-footer" style={{ margin: "10px -28px -28px", borderRadius: "0 0 20px 20px" }}>
                <button type="button" className="ad-btn-plain" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="ad-btn-luxury">
                  Save Recommendation Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
