import React, { useEffect, useRef, useState } from "react"
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Package,
  IndianRupee,
  Layers,
  Sparkles,
  Tag,
} from "lucide-react"
import { api, getToken, formatINR } from "../api"
import { compressImage } from "../utils/imageCompressor"

const API = import.meta.env.VITE_API_URL || "https://api.younoya.com"

function normalizeImageUrl(url: string): string {
  if (!url) return ""
  const trimmed = url.trim()
  if (trimmed.includes("localhost:9000/static")) {
    return trimmed.replace("http://localhost:9000/static", "https://api.younoya.com/static")
  }
  if (trimmed.startsWith("/static")) {
    return `https://api.younoya.com${trimmed}`
  }
  return trimmed
}

export type ProductVariant = {
  id: string
  title: string
  sku?: string | null
  prices?: Array<{ amount: number; currency_code: string }>
  calculated_price?: { calculated_amount?: number }
}

export type Product = {
  id: string
  title: string
  handle: string
  subtitle?: string | null
  description?: string | null
  status: string
  thumbnail?: string | null
  images?: Array<{ url: string }>
  metadata?: Record<string, any> | null
  variants: ProductVariant[]
}

const INTENTION_OPTIONS = [
  { value: "confidence-power", label: "Confidence & Power" },
  { value: "vitality-balance", label: "Vitality & Balance" },
  { value: "love-connection", label: "Love & Connection" },
  { value: "wealth-prosperity", label: "Wealth & Prosperity" },
  { value: "protection", label: "Protection" },
]

const ELEMENT_OPTIONS = ["Earth", "Water", "Fire", "Air", "Ether"]

interface Props {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export default function ProductEditModal({ product, isOpen, onClose, onSaved }: Props) {
  if (!isOpen || !product) return null

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [title, setTitle] = useState(product.title || "")
  const [subtitle, setSubtitle] = useState(product.subtitle || "")
  const [description, setDescription] = useState(product.description || "")
  const [status, setStatus] = useState<"published" | "draft">(
    product.status === "published" ? "published" : "draft"
  )
  const [thumbnail, setThumbnail] = useState(
    product.thumbnail || product.images?.[0]?.url || ""
  )
  const [images, setImages] = useState<Array<{ url: string }>>(
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [{ url: product.thumbnail }]
      : []
  )
  const [newImageUrl, setNewImageUrl] = useState("")

  // Price & stock
  const variant = product.variants?.[0]
  const initialInr = variant?.prices?.find((p) => p.currency_code === "inr")?.amount
    ? Math.round(variant.prices.find((p) => p.currency_code === "inr")!.amount / 100)
    : 2499
  const [priceINR, setPriceINR] = useState<number | string>(initialInr)
  const [stock, setStock] = useState<number | string>(30)

  // Astrological intention & element
  const initialIntention =
    product.metadata?.gift_guide_intentions?.[0] || "confidence-power"
  const initialElement = product.metadata?.element || "Earth"
  const [intention, setIntention] = useState(initialIntention)
  const [element, setElement] = useState(initialElement)

  // Inventory identifiers
  const [inventoryItemId, setInventoryItemId] = useState<string | null>(null)
  const [locationId, setLocationId] = useState<string | null>(null)

  // Async indicators
  const [loadingStock, setLoadingStock] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Reset form whenever active product changes
  useEffect(() => {
    setTitle(product.title || "")
    setSubtitle(product.subtitle || "")
    setDescription(product.description || "")
    setStatus(product.status === "published" ? "published" : "draft")
    const initialThumb = product.thumbnail || product.images?.[0]?.url || ""
    setThumbnail(initialThumb)
    setImages(
      product.images && product.images.length > 0
        ? product.images
        : initialThumb
        ? [{ url: initialThumb }]
        : []
    )
    const inr = variant?.prices?.find((p) => p.currency_code === "inr")?.amount
      ? Math.round(variant.prices.find((p) => p.currency_code === "inr")!.amount / 100)
      : 2499
    setPriceINR(inr)
    setIntention(product.metadata?.gift_guide_intentions?.[0] || "confidence-power")
    setElement(product.metadata?.element || "Earth")
    setError(null)
    setSuccess(null)

    // Fetch stock from inventory items API
    if (variant?.sku) {
      setLoadingStock(true)
      api<{ inventory_items: Array<{ id: string; sku: string }> }>(
        `/admin/inventory-items?sku=${encodeURIComponent(variant.sku)}`
      )
        .then(async (res) => {
          const invItem = res.inventory_items?.[0]
          if (invItem) {
            setInventoryItemId(invItem.id)
            const locRes = await api<{
              inventory_levels: Array<{ location_id: string; stocked_quantity: number }>
            }>(`/admin/inventory-items/${invItem.id}/location-levels`)
            const level = locRes.inventory_levels?.[0]
            if (level) {
              setLocationId(level.location_id)
              setStock(level.stocked_quantity)
            } else {
              // Fetch default location
              const defLoc = await api<{ stock_locations: Array<{ id: string }> }>(
                "/admin/stock-locations"
              )
              if (defLoc.stock_locations?.[0]) {
                setLocationId(defLoc.stock_locations[0].id)
              }
            }
          }
        })
        .catch((e) => console.error("Could not fetch inventory stock:", e))
        .finally(() => setLoadingStock(false))
    } else {
      setLoadingStock(false)
    }
  }, [product])

  // Handle local image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const comp = await compressImage(file, { quality: 0.85, maxDimension: 1600 })
      const form = new FormData()
      form.append("files", comp.file)

      const res = await fetch(`${API}/admin/uploads`, {
        method: "POST",
        headers: { authorization: `Bearer ${getToken()}` },
        body: form,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Upload failed. Check file type and size.")
      }

      const d = await res.json()
      const rawUrl = d.files?.[0]?.url ?? d.file?.url ?? d[0]?.url
      if (!rawUrl) throw new Error("Upload did not return a valid URL.")

      const normalized = normalizeImageUrl(rawUrl)
      setThumbnail(normalized)
      setImages((prev) => [{ url: normalized }, ...prev.filter((i) => i.url !== normalized)])
      setSuccess("Image uploaded and compressed successfully.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Add custom URL to images
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    const normalized = normalizeImageUrl(newImageUrl.trim())
    if (!thumbnail) setThumbnail(normalized)
    setImages((prev) => [...prev, { url: normalized }])
    setNewImageUrl("")
  }

  // Remove image
  const handleRemoveImage = (urlToRemove: string) => {
    const filtered = images.filter((img) => img.url !== urlToRemove)
    setImages(filtered)
    if (thumbnail === urlToRemove) {
      setThumbnail(filtered[0]?.url || "")
    }
  }

  // Save product changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      // 1. Update core product
      const productPayload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        status,
        thumbnail: thumbnail.trim() || undefined,
        images: images.filter((img) => img.url.trim()).map((img) => ({ url: img.url.trim() })),
        metadata: {
          ...(product.metadata || {}),
          gift_guide_intentions: [intention],
          element,
          motif: subtitle.trim(),
        },
      }

      await api(`/admin/products/${product.id}`, {
        method: "POST",
        body: JSON.stringify(productPayload),
      })

      // 2. Update variant price (in paise)
      if (variant?.id && priceINR !== "" && !isNaN(Number(priceINR))) {
        const amountPaise = Math.round(Number(priceINR) * 100)
        await api(`/admin/products/${product.id}/variants/${variant.id}`, {
          method: "POST",
          body: JSON.stringify({
            prices: [{ amount: amountPaise, currency_code: "inr" }],
          }),
        })
      }

      // 3. Update stock quantity if inventory level exists
      if (inventoryItemId && locationId && stock !== "" && !isNaN(Number(stock))) {
        const stockQty = Math.max(0, Math.round(Number(stock)))
        await api(
          `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
          {
            method: "POST",
            body: JSON.stringify({
              stocked_quantity: stockQty,
            }),
          }
        )
      }

      setSuccess("Product updated and synced with store successfully!")
      setTimeout(() => {
        onSaved()
      }, 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(31, 25, 22, 0.45)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        className="ad-card"
        style={{
          width: "min(780px, 100%)",
          background: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid var(--ad-border-gold)",
          boxShadow: "0 24px 60px -12px rgba(44, 34, 28, 0.18)",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--ad-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--ad-surface-soft)",
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--ad-gold-strong)",
                fontWeight: 700,
              }}
            >
              PRODUCT & HEIRLOOM EDITOR
            </span>
            <h2
              style={{
                margin: "4px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                color: "var(--ad-ink)",
                fontWeight: 500,
              }}
            >
              Edit {title || "Product"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--ad-ink-soft)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="ad-alert ad-alert--danger" style={{ margin: "16px 24px 0" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="ad-alert ad-alert--success" style={{ margin: "16px 24px 0" }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Body */}
        <form
          onSubmit={handleSave}
          style={{
            padding: "24px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Visual Showcase Section */}
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
              Product Images & Gallery
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "16px", alignItems: "start" }}>
              {/* Primary Preview */}
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "12px",
                  background: "#FFFFFF",
                  border: "1px solid var(--ad-border)",
                  overflow: "hidden",
                  display: "grid",
                  placeItems: "center",
                  position: "relative",
                }}
              >
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.src = "/media/shop-wild-poise-card.webp"
                    }}
                  />
                ) : (
                  <ImageIcon size={32} color="var(--ad-ink-faint)" />
                )}
                {uploading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255,255,255,0.8)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <span className="ad-boot__ring" style={{ width: "24px", height: "24px" }} />
                  </div>
                )}
              </div>

              {/* Upload & URL Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileUpload}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="ad-btn-luxury"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{ padding: "8px 14px", fontSize: "12px" }}
                  >
                    <Upload size={14} />
                    <span>{uploading ? "Compressing & Uploading…" : "Upload New Photo"}</span>
                  </button>
                  <small style={{ color: "var(--ad-ink-soft)", alignSelf: "center", fontSize: "11px" }}>
                    Lossless WebP compression applied
                  </small>
                </div>

                <div className="ad-field">
                  <span>Primary Image URL</span>
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://younoya.com/media/products/..."
                  />
                </div>

                {/* Additional gallery URLs */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    className="ad-field"
                    style={{
                      flex: 1,
                      background: "#FFFFFF",
                      border: "1px solid var(--ad-border)",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: "13px",
                    }}
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Add extra gallery image URL…"
                  />
                  <button
                    type="button"
                    className="ad-btn-plain"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl.trim()}
                    style={{ border: "1px solid var(--ad-border-gold)", borderRadius: "10px", padding: "0 12px" }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {images.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          width: "44px",
                          height: "44px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: img.url === thumbnail ? "2px solid var(--ad-gold)" : "1px solid var(--ad-border)",
                        }}
                      >
                        <img
                          src={img.url}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }}
                          onClick={() => setThumbnail(img.url)}
                          title="Click to set as primary thumbnail"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.url)}
                          style={{
                            position: "absolute",
                            top: 1,
                            right: 1,
                            background: "rgba(0,0,0,0.6)",
                            border: "none",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            display: "grid",
                            placeItems: "center",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Core Info: Title, Subtitle, Handle */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
            <div className="ad-field">
              <span>Product Title</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. WILD POISE"
              />
            </div>

            <div className="ad-field">
              <span>Motif / Subtitle</span>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Fine Jewellery Brooch · Jaguar Motif"
              />
            </div>
          </div>

          {/* Description */}
          <div className="ad-field">
            <span>Description & Vedic Symbolism</span>
            <textarea
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--ad-border)",
                borderRadius: "12px",
                padding: "12px",
                color: "var(--ad-ink)",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                minHeight: "90px",
                outline: "none",
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the intention, material, craftsmanship, and astrological meaning of this keepsake…"
            />
          </div>

          {/* Price, Stock, and Status Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="ad-field">
              <span>Price in INR (₹)</span>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={priceINR}
                  onChange={(e) => setPriceINR(e.target.value)}
                  placeholder="2499"
                  style={{ paddingLeft: "32px" }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ad-ink-soft)",
                    fontWeight: 600,
                  }}
                >
                  ₹
                </span>
              </div>
            </div>

            <div className="ad-field">
              <span>Stock Quantity</span>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="30"
                  disabled={loadingStock}
                />
                {loadingStock && (
                  <small
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--ad-gold-strong)",
                      fontSize: "10px",
                    }}
                  >
                    loading…
                  </small>
                )}
              </div>
            </div>

            <div className="ad-field">
              <span>Publication Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
              >
                <option value="published">Published (Live Online)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Vedic Astrological Intention & Element */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="ad-field">
              <span>Gift Category / Intention</span>
              <select
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
              >
                {INTENTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ad-field">
              <span>Elemental Alignment</span>
              <select
                value={element}
                onChange={(e) => setElement(e.target.value)}
              >
                {ELEMENT_OPTIONS.map((el) => (
                  <option key={el} value={el}>
                    {el}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "1px solid var(--ad-border)",
              marginTop: "8px",
            }}
          >
            <a
              href="/shop"
              target="_blank"
              rel="noopener noreferrer"
              className="ad-btn-plain"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <ExternalLink size={13} />
              <span>Preview on Shop</span>
            </a>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                className="ad-btn-plain"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="ad-btn-luxury"
                disabled={saving || uploading}
              >
                {saving ? (
                  <>
                    <span className="ad-boot__ring" style={{ width: "14px", height: "14px" }} />
                    <span>Saving Changes…</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
