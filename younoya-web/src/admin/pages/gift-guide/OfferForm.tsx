import React, { useRef, useState } from "react"
import { Upload, Plus, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon, Package } from "lucide-react"
import { api, getToken } from "../../api"
import { compressImage } from "../../utils/imageCompressor"

export type OfferRow = {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  metadata?: Record<string, any>
  variant?: {
    id: string
    sku: string
    price: number | null
    inventoryItems: Array<{ inventory_item_id: string; required_quantity: number }>
  }
}

const INTENTION_OPTIONS = [
  { value: "confidence-power", label: "Confidence & Power" },
  { value: "vitality-balance", label: "Vitality & Balance" },
  { value: "love-connection", label: "Love & Connection" },
  { value: "wealth-prosperity", label: "Wealth & Prosperity" },
  { value: "protection", label: "Protection" },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const empty = {
  title: "",
  handle: "",
  sku: "",
  description: "",
  thumbnail: "",
  price: "4999",
  approved: true,
  intentions: ["confidence-power"] as string[],
  matrixKeys: "",
  components: [] as Array<{ variantId: string; quantity: number }>,
}

export default function OfferForm({
  selected,
  catalog,
  onSaved,
}: {
  selected: OfferRow | null
  catalog: OfferRow[]
  onSaved: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initial = selected
    ? {
        title: selected.title,
        handle: selected.handle,
        sku: selected.variant?.sku || "",
        description: selected.description || "",
        thumbnail: selected.thumbnail || "",
        price: selected.variant?.price ? String(selected.variant.price) : "4999",
        approved: selected.metadata?.gift_guide_approved === true,
        intentions: selected.metadata?.gift_guide_intentions || ["confidence-power"],
        matrixKeys: (selected.metadata?.gift_guide_matrix_keys || []).join(", "),
        components: selected.metadata?.gift_guide_component_variants || [],
      }
    : empty

  const [form, setForm] = useState(initial)
  const [component, setComponent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  const change = (field: string, value: any) => setForm((old) => ({ ...old, [field]: value }))

  const handleTitleChange = (val: string) => {
    change("title", val)
    if (!selected) {
      const slug = slugify(val)
      change("handle", slug)
      change("sku", `YN-SET-${slug.toUpperCase().slice(0, 24)}`)
    }
  }

  const options = catalog.filter(
    (row) =>
      row.variant?.id &&
      row.id !== selected?.id &&
      row.variant.inventoryItems?.length &&
      row.metadata?.recommendation_only !== true
  )

  async function upload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const prepared = await compressImage(file, { quality: 0.85, maxDimension: 1600 })
      const data = new FormData()
      data.append("files", prepared.file)
      const host = import.meta.env.VITE_API_URL || "https://api.younoya.com"
      const response = await fetch(`${host}/admin/uploads`, {
        method: "POST",
        headers: { authorization: `Bearer ${getToken()}` },
        body: data,
      })
      if (!response.ok) throw new Error("Image upload failed")
      const result = await response.json()
      const url = result.files?.[0]?.url || result.file?.url
      if (!url) throw new Error("Upload returned no image URL")
      change("thumbnail", new URL(url, host).href)
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not upload image")
    } finally {
      setUploading(false)
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.title.trim()) {
      setError("Please provide a name for this gift hamper.")
      return
    }

    setBusy(true)
    setError(null)
    try {
      await api(`/admin/gift-guide/offers${selected ? `/${selected.id}` : ""}`, {
        method: selected ? "PUT" : "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          matrixKeys: form.matrixKeys
            .split(",")
            .map((key) => key.trim())
            .filter(Boolean),
        }),
      })
      onSaved()
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not save the hamper")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="offer-form" onSubmit={submit}>
      {/* Head */}
      <div className="offer-form__head">
        <span>HAMPER & SET STUDIO</span>
        <h2>{selected ? `Edit ${selected.title}` : "Curate New Gift Hamper"}</h2>
        <p>
          Combine 2–3 products into a curated gift hamper or create an exclusive set for Aster’s Gift Finder.
        </p>
      </div>

      {error && (
        <div className="ad-alert ad-alert--danger">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Visual Showcase Card */}
      <div
        style={{
          padding: "16px 18px",
          background: "var(--ad-bg)",
          borderRadius: "14px",
          border: "1px solid var(--ad-border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-label)",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ad-gold-strong)",
            fontWeight: 700,
            display: "block",
            marginBottom: "12px",
          }}
        >
          Hamper Imagery & Photography
        </span>

        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: "16px", alignItems: "start" }}>
          <div
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "12px",
              background: "#FFFFFF",
              border: "1px solid var(--ad-border-gold)",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
            }}
          >
            {form.thumbnail ? (
              <img
                src={form.thumbnail}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = "/media/shop-wild-poise-card.webp"
                }}
              />
            ) : (
              <ImageIcon size={32} color="var(--ad-ink-faint)" />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="button"
                className="ad-btn-luxury"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{ padding: "8px 14px", fontSize: "12px" }}
              >
                <Upload size={14} />
                <span>{uploading ? "Compressing & Uploading…" : "Upload Hamper Photo"}</span>
              </button>
              <small style={{ color: "var(--ad-ink-soft)", fontSize: "11px" }}>
                Auto-compressed to lossless WebP
              </small>
            </div>

            <div className="ad-field">
              <span>Direct Image URL</span>
              <input
                required
                type="url"
                placeholder="https://younoya.com/media/..."
                value={form.thumbnail}
                onChange={(event) => change("thumbnail", event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="offer-form__grid">
        <div className="ad-field">
          <span>Hamper / Set Title</span>
          <input
            required
            value={form.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="e.g. Celestial Harmony Gift Hamper"
          />
        </div>

        <div className="ad-field">
          <span>Price in INR (₹)</span>
          <input
            required
            type="number"
            min="100"
            step="1"
            value={form.price}
            onChange={(event) => change("price", event.target.value)}
            placeholder="4999"
          />
        </div>

        <div className="ad-field">
          <span>URL Handle</span>
          <input
            required
            disabled={!!selected}
            value={form.handle}
            onChange={(event) => change("handle", event.target.value)}
            placeholder="e.g. celestial-harmony-gift-hamper"
          />
        </div>

        <div className="ad-field">
          <span>SKU</span>
          <input
            required
            disabled={!!selected}
            value={form.sku}
            onChange={(event) => change("sku", event.target.value)}
            placeholder="e.g. YN-SET-HARMONY"
          />
        </div>
      </div>

      {/* Full-Width Description */}
      <div className="ad-field">
        <span>Description & Intentional Story</span>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(event) => change("description", event.target.value)}
          placeholder="Describe the items in this hamper, their synergy, and why this combination was chosen…"
        />
      </div>

      {/* Included Pieces Kit Builder */}
      <div className="offer-form__kit">
        <div>
          <strong>Included Products in this Hamper ({form.components.length})</strong>
          <p>
            Select which standalone keepsakes are bundled into this hamper. Inventory is tracked against each included product.
          </p>
        </div>

        {form.components.map((part, index) => {
          const compProduct = catalog.find((row) => row.variant?.id === part.variantId)
          return (
            <div className="offer-form__component" key={`${part.variantId}-${index}`}>
              <span>
                {compProduct?.title || part.variantId} × {part.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  change(
                    "components",
                    form.components.filter((_, at) => at !== index)
                  )
                }
              >
                Remove
              </button>
            </div>
          )
        })}

        <div className="offer-form__add">
          <select value={component} onChange={(event) => setComponent(event.target.value)}>
            <option value="">Select a brand product to add into hamper…</option>
            {options.map((row) => (
              <option value={row.variant!.id} key={row.id}>
                {row.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ad-btn-luxury"
            disabled={!component}
            style={{ padding: "8px 16px", fontSize: "12px" }}
            onClick={() => {
              change("components", [...form.components, { variantId: component, quantity: 1 }])
              setComponent("")
            }}
          >
            <Plus size={14} />
            <span>Add Piece</span>
          </button>
        </div>
      </div>

      {/* Category Selection */}
      <div className="ad-field">
        <span>Gift Categories / Intentions</span>
        <fieldset>
          {INTENTION_OPTIONS.map((opt) => (
            <label key={opt.value}>
              <input
                type="checkbox"
                checked={form.intentions.includes(opt.value)}
                onChange={(event) =>
                  change(
                    "intentions",
                    event.target.checked
                      ? [...form.intentions, opt.value]
                      : form.intentions.filter((item) => item !== opt.value)
                  )
                }
              />
              {opt.label}
            </label>
          ))}
        </fieldset>
      </div>

      {/* Approval Status */}
      <label className="offer-form__approval">
        <input
          type="checkbox"
          checked={form.approved}
          onChange={(event) => change("approved", event.target.checked)}
        />
        <span>Approved for recommendations & live ordering</span>
      </label>

      {/* Submit Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
        <button className="ad-btn-luxury" disabled={busy} style={{ padding: "12px 24px" }}>
          {busy ? "Saving Hamper…" : selected ? "Save Hamper Changes" : "Create & Publish Hamper"}
        </button>
      </div>
    </form>
  )
}
