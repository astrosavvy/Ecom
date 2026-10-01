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
const DEFAULT_SALES_CHANNEL_ID = "sc_01M1BRNHJ21JZT84E1CJVWVB9V"
const DEFAULT_LOCATION_ID = "sloc_01M1BRNJ25CACX2636BXMGT0GV" // European Warehouse

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
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
  isNew?: boolean
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export default function ProductEditModal({ product, isNew = false, isOpen, onClose, onSaved }: Props) {
  if (!isOpen) return null

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [handle, setHandle] = useState("")
  const [isHandleCustomized, setIsHandleCustomized] = useState(false)
  const [subtitle, setSubtitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"published" | "draft">("published")
  const [thumbnail, setThumbnail] = useState("")
  const [images, setImages] = useState<Array<{ url: string }>>([])
  const [newImageUrl, setNewImageUrl] = useState("")

  // Price & stock
  const [priceINR, setPriceINR] = useState<number | string>(2499)
  const [stock, setStock] = useState<number | string>(30)

  // Astrological intention & element
  const [intention, setIntention] = useState("confidence-power")
  const [element, setElement] = useState("Earth")

  // Inventory identifiers
  const [inventoryItemId, setInventoryItemId] = useState<string | null>(null)
  const [locationId, setLocationId] = useState<string | null>(null)

  // Async indicators
  const [loadingStock, setLoadingStock] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Reset form whenever active product or isNew changes
  useEffect(() => {
    setError(null)
    setSuccess(null)
    setNewImageUrl("")

    if (isNew || !product) {
      setTitle("")
      setHandle("")
      setIsHandleCustomized(false)
      setSubtitle("")
      setDescription("")
      setStatus("published")
      setThumbnail("/media/shop-wild-poise-card.webp")
      setImages([{ url: "/media/shop-wild-poise-card.webp" }])
      setPriceINR(2499)
      setStock(30)
      setIntention("confidence-power")
      setElement("Earth")
      setInventoryItemId(null)
      setLocationId(DEFAULT_LOCATION_ID)
      setLoadingStock(false)
      return
    }

    // Existing product edit mode
    setTitle(product.title || "")
    setHandle(product.handle || "")
    setIsHandleCustomized(true)
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

    const variant = product.variants?.[0]
    const inr = variant?.prices?.find((p) => p.currency_code === "inr")?.amount
      ? Math.round(variant.prices.find((p) => p.currency_code === "inr")!.amount / 100)
      : 2499
    setPriceINR(inr)
    setIntention(product.metadata?.gift_guide_intentions?.[0] || "confidence-power")
    setElement(product.metadata?.element || "Earth")

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
              setLocationId(DEFAULT_LOCATION_ID)
            }
          }
        })
        .catch((e) => console.error("Could not fetch inventory stock:", e))
        .finally(() => setLoadingStock(false))
    } else {
      setLoadingStock(false)
    }
  }, [product, isNew])

  // Handle title change & auto-slugify handle if new
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (isNew && !isHandleCustomized) {
      setHandle(slugify(val))
    }
  }

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

  // Save product changes (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Please provide a product title.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const finalHandle = handle.trim() ? slugify(handle) : slugify(title)
    const amountPaise = Math.round(Number(priceINR || 0) * 100)
    const stockQty = Math.max(0, Math.round(Number(stock || 0)))

    try {
      if (isNew) {
        // --- 1. CREATE MODE ---
        const generatedSku = `YN-${finalHandle.toUpperCase().slice(0, 30)}`

        // Step A: Create inventory item
        const invRes = await api<{ inventory_item: { id: string } }>("/admin/inventory-items", {
          method: "POST",
          body: JSON.stringify({
            sku: generatedSku,
            title: title.trim(),
          }),
        })
        const newInvId = invRes.inventory_item.id

        // Step B: Set initial stock at European Warehouse
        await api(`/admin/inventory-items/${newInvId}/location-levels`, {
          method: "POST",
          body: JSON.stringify({
            location_id: DEFAULT_LOCATION_ID,
            stocked_quantity: stockQty,
          }),
        })

        // Step C: Create product linked to variant, price, and inventory item
        const createPayload = {
          title: title.trim(),
          subtitle: subtitle.trim(),
          handle: finalHandle,
          description: description.trim(),
          status,
          thumbnail: thumbnail.trim() || undefined,
          images: images.filter((img) => img.url.trim()).map((img) => ({ url: img.url.trim() })),
          sales_channels: [{ id: DEFAULT_SALES_CHANNEL_ID }],
          options: [{ title: "Edition", values: ["Standard"] }],
          variants: [
            {
              title: "Standard",
              sku: generatedSku,
              manage_inventory: true,
              allow_backorder: false,
              options: { Edition: "Standard" },
              prices: [{ amount: amountPaise, currency_code: "inr" }],
              inventory_items: [{ inventory_item_id: newInvId, required_quantity: 1 }],
            },
          ],
          metadata: {
            gift_guide_intentions: [intention],
            element,
            motif: subtitle.trim(),
          },
        }

        await api("/admin/products", {
          method: "POST",
          body: JSON.stringify(createPayload),
        })

        setSuccess("Product created and published to store successfully!")
      } else if (product) {
        // --- 2. UPDATE MODE ---
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

        // Update variant price
        const variant = product.variants?.[0]
        if (variant?.id && amountPaise > 0) {
          await api(`/admin/products/${product.id}/variants/${variant.id}`, {
            method: "POST",
            body: JSON.stringify({
              prices: [{ amount: amountPaise, currency_code: "inr" }],
            }),
          })
        }

        // Update inventory level stock
        if (inventoryItemId && locationId) {
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
      }

      setTimeout(() => {
        onSaved()
      }, 700)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ad-modal-backdrop">
      <div className="ad-modal-card">
        {/* Studio Header */}
        <div className="ad-modal-header">
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
              {isNew ? "CATALOGUE STUDIO · CREATE" : "CATALOGUE STUDIO · EDIT"}
            </span>
            <h2
              style={{
                margin: "4px 0 0",
                fontFamily: "var(--font-display)",
                fontSize: "26px",
                color: "var(--ad-ink)",
                fontWeight: 500,
              }}
            >
              {isNew ? "Add New Brand Product" : `Edit ${title || "Product"}`}
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
          <div className="ad-alert ad-alert--danger" style={{ margin: "16px 28px 0" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="ad-alert ad-alert--success" style={{ margin: "16px 28px 0" }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* Studio Form Body */}
        <form onSubmit={handleSave} className="ad-modal-body">
          {/* Visual Showcase Card */}
          <div
            style={{
              padding: "18px 20px",
              background: "var(--ad-bg)",
              borderRadius: "16px",
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
                marginBottom: "14px",
              }}
            >
              Product Imagery & Photography
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "20px", alignItems: "start" }}>
              {/* Primary Visual Preview */}
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "14px",
                  background: "#FFFFFF",
                  border: "1px solid var(--ad-border-gold)",
                  boxShadow: "0 6px 18px -6px rgba(44, 34, 28, 0.08)",
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
                  <ImageIcon size={36} color="var(--ad-ink-faint)" />
                )}
                {uploading && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255,255,255,0.85)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <span className="ad-boot__ring" style={{ width: "26px", height: "26px" }} />
                  </div>
                )}
              </div>

              {/* Upload Controls & URL */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileUpload}
                />

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="ad-btn-luxury"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{ padding: "9px 16px", fontSize: "12px" }}
                  >
                    <Upload size={14} />
                    <span>{uploading ? "Compressing & Uploading…" : "Upload High-Res Photo"}</span>
                  </button>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--ad-sage)",
                      background: "var(--ad-sage-bg)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontWeight: 600,
                    }}
                  >
                    Lossless WebP Auto-Compressed
                  </span>
                </div>

                <div className="ad-field">
                  <span>Direct Image URL</span>
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
                    style={{
                      flex: 1,
                      background: "#FFFFFF",
                      border: "1px solid var(--ad-border)",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "13px",
                      color: "var(--ad-ink)",
                    }}
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste extra gallery image URL…"
                  />
                  <button
                    type="button"
                    className="ad-btn-plain"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl.trim()}
                    style={{ border: "1px solid var(--ad-border-gold)", borderRadius: "10px", padding: "0 14px" }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {images.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "2px" }}>
                    {images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          width: "48px",
                          height: "48px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: img.url === thumbnail ? "2px solid var(--ad-gold-strong)" : "1px solid var(--ad-border)",
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
                            top: 2,
                            right: 2,
                            background: "rgba(0,0,0,0.65)",
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
          <div style={{ display: "grid", gridTemplateColumns: isNew ? "1.2fr 1fr 1fr" : "1.4fr 1fr", gap: "18px" }}>
            <div className="ad-field">
              <span>Product Title</span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
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

            {isNew && (
              <div className="ad-field">
                <span>URL Handle</span>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => {
                    setIsHandleCustomized(true)
                    setHandle(e.target.value)
                  }}
                  placeholder="e.g. wild-poise"
                />
              </div>
            )}
          </div>

          {/* Description & Vedic Meaning (Full-Width, Uncramped) */}
          <div className="ad-field">
            <span>Description & Vedic Symbolism</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the intention, materials, craftsmanship, and astrological meaning of this keepsake…"
            />
          </div>

          {/* Price, Stock, and Publication Status Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px" }}>
            <div className="ad-field">
              <span>Price in INR (₹)</span>
              <div style={{ position: "relative", width: "100%" }}>
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
                    left: "14px",
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
              <span>Warehouse Stock Quantity</span>
              <div style={{ position: "relative", width: "100%" }}>
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
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--ad-gold-strong)",
                      fontSize: "11px",
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
                <option value="published">Published (Live on Storefront)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Astrological Intention & Element Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <div className="ad-field">
              <span>Gift Category / Vedic Intention</span>
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

          {/* Studio Footer */}
          <div className="ad-modal-footer" style={{ margin: "10px -28px -28px", borderRadius: "0 0 20px 20px" }}>
            {!isNew ? (
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
            ) : (
              <span style={{ fontSize: "12px", color: "var(--ad-ink-soft)" }}>
                New products are instantly synced to your catalog.
              </span>
            )}

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
                    <span>{isNew ? "Creating Product…" : "Saving Changes…"}</span>
                  </>
                ) : (
                  <span>{isNew ? "Create & Publish Product" : "Save Changes"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
