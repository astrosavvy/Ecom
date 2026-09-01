import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { api, getToken } from "../api"

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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const CATEGORY_OPTIONS = [
  "Love & Relationships",
  "Becoming & Career",
  "Shelter & Home",
  "Vedic Astrology",
  "Consecration & Rituals",
  "Gifting Guides",
]

export default function JournalEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  // Editorial states
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [isSlugCustomized, setIsSlugCustomized] = useState(false)
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [cover, setCover] = useState<string>("")
  const [listImage, setListImage] = useState<string>("")
  const [customCoverUrl, setCustomCoverUrl] = useState("")
  const [customListUrl, setCustomListUrl] = useState("")
  const [author, setAuthor] = useState("YOUNOYA Atelier")
  const [category, setCategory] = useState("Consecration & Rituals")
  const [tags, setTags] = useState("")
  const [published, setPublished] = useState(false)

  // UI / Action states
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<"cover" | "list" | false>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const listInput = useRef<HTMLInputElement>(null)

  // Auto-generate slug when title changes (if user hasn't manually customized slug)
  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
    if (!isSlugCustomized && isNew) {
      setSlug(slugify(newTitle))
    }
  }

  // Load existing article if editing
  useEffect(() => {
    if (!id) return
    setBusy(true)
    api(`/admin/blog/posts/${id}`)
      .then((d: any) => {
        if (!d.post) return
        const p = d.post
        setTitle(p.title)
        setSlug(p.slug || slugify(p.title))
        setIsSlugCustomized(true)
        setExcerpt(p.excerpt ?? "")
        setContent(p.content || "")
        const normCover = normalizeImageUrl(p.cover_image ?? "")
        const normList = normalizeImageUrl(p.list_image ?? "")
        setCover(normCover)
        setListImage(normList)
        setCustomCoverUrl(normCover)
        setCustomListUrl(normList)
        setAuthor(p.author || "YOUNOYA Atelier")
        setPublished(p.published)
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the article."))
      .finally(() => setBusy(false))
  }, [id])

  function insertFormat(tagOpen: string, tagClose: string) {
    const el = contentTextareaRef.current
    if (!el) return
    const start = el.selectionStart || 0
    const end = el.selectionEnd || 0
    const selected = el.value.substring(start, end) || "text"
    const replacement = `${tagOpen}${selected}${tagClose}`
    const nextValue = el.value.substring(0, start) + replacement + el.value.substring(end)
    setContent(nextValue)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length)
    }, 0)
  }

  async function uploadImage(file: File, target: "cover" | "list") {
    setUploading(target)
    setError(null)
    setSuccessMsg(null)
    try {
      const form = new FormData()
      form.append("files", file)
      const res = await fetch(`${API}/admin/uploads`, {
        method: "POST",
        headers: { authorization: `Bearer ${getToken()}` },
        body: form,
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error(t || "Upload failed. Try a different image or paste direct image URL.")
      }
      const data = await res.json()
      const rawUrl = data.files?.[0]?.url ?? data.file?.url ?? data[0]?.url
      if (rawUrl) {
        const normalized = normalizeImageUrl(rawUrl)
        if (target === "cover") {
          setCover(normalized)
          setCustomCoverUrl(normalized)
        } else {
          setListImage(normalized)
          setCustomListUrl(normalized)
        }
        setSuccessMsg(`Image uploaded successfully!`)
      } else {
        throw new Error("Upload returned no image URL.")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed. You can paste a direct image URL instead.")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(publishDirectly?: boolean) {
    if (!title.trim()) {
      setError("Please provide a title for the story.")
      return
    }

    if (!content.trim() || content.trim().length < 5) {
      setError("Please add article content before saving.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    const isPublished = publishDirectly !== undefined ? publishDirectly : published
    const finalSlug = slug.trim() ? slugify(slug.trim()) : slugify(title.trim())

    const body: Record<string, unknown> = {
      title: title.trim(),
      slug: finalSlug,
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      cover_image: cover.trim() || undefined,
      list_image: listImage.trim() || undefined,
      author: author.trim() || "YOUNOYA Atelier",
      published: isPublished,
    }

    try {
      if (id) {
        await api(`/admin/blog/posts/${id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        })
        setSuccessMsg(isPublished ? "Article published live to storefront!" : "Draft saved successfully.")
        if (publishDirectly !== undefined) setPublished(publishDirectly)
      } else {
        const d = await api<{ post: { id: string } }>("/admin/blog/posts", {
          method: "POST",
          body: JSON.stringify(body),
        })
        setSuccessMsg("Story created successfully! Redirecting to editor…")
        navigate(`/admin/journal/${d.post.id}`, { replace: true })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save post.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    if (!confirm(`Permanently delete "${title}"? This cannot be undone.`)) return
    try {
      await api(`/admin/blog/posts/${id}`, { method: "DELETE" })
      navigate("/admin/journal")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete article.")
    }
  }

  if (busy) {
    return (
      <div className="ad__page" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p style={{ color: "#8a8175" }}>Loading story editor…</p>
      </div>
    )
  }

  return (
    <div className="ad__page ad__page--wide" style={{ paddingBottom: "5rem" }}>
      {/* Top Breadcrumb & Action Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            to="/admin/journal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#5a534a",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              background: "#fff",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(26,26,30,0.08)",
            }}
          >
            ← Back to Articles
          </Link>
          <span className={`ad-chip ad-chip--${published ? "ok" : "wait"}`}>
            {published ? "● Live on Store" : "○ Draft Mode"}
          </span>
        </div>

        <div className="ad-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="ad-btn-plain"
            disabled={saving || !!uploading}
            onClick={() => handleSave(false)}
            style={{
              background: "#fff",
              border: "1px solid rgba(26,26,30,0.12)",
              padding: "9px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button
            type="button"
            className="ad-btn"
            disabled={saving || !!uploading}
            onClick={() => handleSave(true)}
            style={{
              background: "var(--yn-gold, #D4AF37)",
              color: "#07080E",
              fontWeight: 600,
              padding: "9px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
              fontSize: "0.875rem",
              boxShadow: "0 4px 14px -4px rgba(212, 175, 55, 0.45)",
            }}
          >
            {saving ? "Publishing…" : published ? "Update Live Story" : "★ Publish Live"}
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.25)", borderRadius: "10px", color: "#dc2626", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(52, 211, 153, 0.12)", border: "1px solid #34d399", borderRadius: "10px", color: "#065f46", marginBottom: "1.5rem", fontSize: "0.875rem", fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>
        {/* Left Column: Editorial Content (Title, Slug, Excerpt, Body) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Post Title & Slug Card */}
          <div className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(26,26,30,0.06)" }}>
            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", marginBottom: "6px", fontWeight: 700 }}>
                Article Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Consecration of the Rose Quartz Keepsake"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                style={{
                  width: "100%",
                  fontSize: "1.5rem",
                  fontWeight: 500,
                  padding: "10px 14px",
                  background: "#FFFBF0",
                  border: "1px solid rgba(26,26,30,0.1)",
                  borderRadius: "10px",
                  outline: "none",
                  color: "#1a1a1e",
                  fontFamily: "var(--font-display, Georgia, serif)",
                }}
              />
            </div>

            {/* Custom URL Slug Handle */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", fontWeight: 700 }}>
                  URL Slug / Handle *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(slugify(title))
                    setIsSlugCustomized(false)
                  }}
                  style={{ background: "none", border: "none", color: "var(--yn-gold, #D4AF37)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}
                >
                  Reset from Title
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", background: "#FFFBF0", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                <span style={{ padding: "10px 12px", background: "rgba(26,26,30,0.04)", fontSize: "0.8125rem", color: "#8a8175", borderRight: "1px solid rgba(26,26,30,0.08)", whiteSpace: "nowrap" }}>
                  https://younoya.com/journal/
                </span>
                <input
                  type="text"
                  placeholder="custom-article-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setIsSlugCustomized(true)
                  }}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "none",
                    background: "transparent",
                    fontSize: "0.875rem",
                    outline: "none",
                    color: "#1a1a1e",
                    fontFamily: "monospace",
                  }}
                />
              </div>
              <small style={{ display: "block", color: "#8a8175", fontSize: "0.75rem", marginTop: "4px" }}>
                Clean URL handle for readers, social media, and search engines.
              </small>
            </div>

            {/* Teaser Excerpt */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", marginBottom: "6px", fontWeight: 700 }}>
                Teaser Excerpt (1-2 sentences for preview cards & SEO)
              </label>
              <textarea
                placeholder="A compelling preview sentence summarizing this chapter or keepsake ritual..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "#FFFBF0",
                  border: "1px solid rgba(26,26,30,0.1)",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "0.875rem",
                  color: "#1a1a1e",
                  resize: "vertical",
                  lineHeight: "1.5",
                }}
              />
            </div>
          </div>

          {/* Article Body Content Card */}
          <div className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(26,26,30,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
              <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", fontWeight: 700 }}>
                Article Story Content *
              </label>
              {/* Write vs Preview Tabs */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid rgba(26,26,30,0.12)",
                    background: activeTab === "write" ? "var(--yn-gold, #D4AF37)" : "#FFFBF0",
                    color: activeTab === "write" ? "#07080E" : "#1a1a1e",
                  }}
                >
                  ✏️ Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1px solid rgba(26,26,30,0.12)",
                    background: activeTab === "preview" ? "var(--yn-gold, #D4AF37)" : "#FFFBF0",
                    color: activeTab === "preview" ? "#07080E" : "#1a1a1e",
                  }}
                >
                  👁️ Live Preview
                </button>
              </div>
            </div>

            {activeTab === "write" ? (
              <div>
                {/* Formatting Toolbar */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px", background: "#f5eee1", padding: "6px 8px", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.08)" }}>
                  <button type="button" onClick={() => insertFormat("<strong>", "</strong>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Bold"><b>B</b></button>
                  <button type="button" onClick={() => insertFormat("<em>", "</em>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Italic"><i>I</i></button>
                  <button type="button" onClick={() => insertFormat("<h2>", "</h2>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Heading 2">H2</button>
                  <button type="button" onClick={() => insertFormat("<h3>", "</h3>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Heading 3">H3</button>
                  <button type="button" onClick={() => insertFormat("<ul>\n  <li>", "</li>\n</ul>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Bullet List">• List</button>
                  <button type="button" onClick={() => insertFormat("<blockquote>", "</blockquote>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Quote">❝ Quote</button>
                  <button type="button" onClick={() => insertFormat("<hr />\n", "")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Divider Line">― Line</button>
                  <button type="button" onClick={() => insertFormat("<p>", "</p>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }} title="Paragraph">Paragraph</button>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={16}
                  placeholder="Write the full narrative of the article here. Use the formatting buttons above for bold, headings, lists, and quotes..."
                  style={{
                    width: "100%",
                    minHeight: "360px",
                    padding: "16px",
                    background: "#FFFBF0",
                    border: "1px solid rgba(26,26,30,0.1)",
                    borderRadius: "10px",
                    outline: "none",
                    fontFamily: "var(--font-body, Inter, sans-serif)",
                    fontSize: "0.9375rem",
                    lineHeight: "1.7",
                    color: "#1a1a1e",
                    resize: "vertical",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  minHeight: "360px",
                  padding: "24px",
                  background: "#FFFBF0",
                  border: "1px solid rgba(26,26,30,0.1)",
                  borderRadius: "10px",
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  color: "#1a1a1e",
                  lineHeight: "1.8",
                }}
              >
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <p style={{ color: "#8a8175", fontStyle: "italic" }}>
                    No content written yet. Switch to the 'Write' tab to compose your story.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Media, Tags, Taxonomy & Publishing Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Cover Hero Image (16:9) Card */}
          <div className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(26,26,30,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.875rem", color: "#1a1a1e" }}>Cover Image (16:9)</strong>
              <small style={{ color: "#8a8175" }}>Article hero banner</small>
            </div>

            {cover ? (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <img
                  src={cover}
                  alt="16:9 Cover Preview"
                  style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)" }}
                  onError={() => setError("Cover image failed to load. Please check URL.")}
                />
                <button
                  type="button"
                  onClick={() => { setCover(""); setCustomCoverUrl(""); }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.75)", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={{ width: "100%", aspectRatio: "16/9", display: "grid", placeItems: "center", border: "1px dashed rgba(26,26,30,0.2)", borderRadius: "8px", background: "#FFFBF0", color: "#8a8175", textAlign: "center", padding: "12px", marginBottom: "10px", fontSize: "0.8125rem" }}>
                No cover image selected
                <br /><small style={{ opacity: 0.7 }}>1920×1080 recommended</small>
              </div>
            )}

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")}
            />
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <button
                type="button"
                className="ad-btn-plain"
                disabled={!!uploading}
                onClick={() => fileInput.current?.click()}
                style={{ fontSize: "0.8125rem", padding: "7px 14px", background: "#f5eee1", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", cursor: "pointer", width: "100%", textAlign: "center" }}
              >
                {uploading === "cover" ? "Uploading…" : "📁 Upload 16:9 Image"}
              </button>
            </div>
            <div>
              <input
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value)
                  setCover(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "0.75rem", padding: "7px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", background: "#FFFBF0" }}
              />
            </div>
          </div>

          {/* Listing Thumbnail Image (1:1) Card */}
          <div className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(26,26,30,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.875rem", color: "#1a1a1e" }}>Grid Image (1:1)</strong>
              <small style={{ color: "#8a8175" }}>Card listing square</small>
            </div>

            {listImage ? (
              <div style={{ position: "relative", marginBottom: "10px", width: "130px", margin: "0 auto 10px" }}>
                <img
                  src={listImage}
                  alt="1:1 List Preview"
                  style={{ width: "130px", height: "130px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)" }}
                  onError={() => setError("1:1 image failed to load. Please check URL.")}
                />
                <button
                  type="button"
                  onClick={() => { setListImage(""); setCustomListUrl(""); }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.75)", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={{ width: "100%", aspectRatio: "16/9", display: "grid", placeItems: "center", border: "1px dashed rgba(26,26,30,0.2)", borderRadius: "8px", background: "#FFFBF0", color: "#8a8175", textAlign: "center", padding: "12px", marginBottom: "10px", fontSize: "0.8125rem" }}>
                No grid image selected
                <br /><small style={{ opacity: 0.7 }}>600×600 square recommended</small>
              </div>
            )}

            <input
              ref={listInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "list")}
            />
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <button
                type="button"
                className="ad-btn-plain"
                disabled={!!uploading}
                onClick={() => listInput.current?.click()}
                style={{ fontSize: "0.8125rem", padding: "7px 14px", background: "#f5eee1", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", cursor: "pointer", width: "100%", textAlign: "center" }}
              >
                {uploading === "list" ? "Uploading…" : "📁 Upload 1:1 Image"}
              </button>
            </div>
            <div>
              <input
                type="url"
                placeholder="Or paste image URL (https://...)"
                value={customListUrl}
                onChange={(e) => {
                  setCustomListUrl(e.target.value)
                  setListImage(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "0.75rem", padding: "7px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", background: "#FFFBF0" }}
              />
            </div>
          </div>

          {/* Category & Tags Card */}
          <div className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(26,26,30,0.06)" }}>
            <strong style={{ display: "block", fontSize: "0.875rem", color: "#1a1a1e", marginBottom: "10px" }}>
              Chapter & Categories
            </strong>
            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", marginBottom: "6px", fontWeight: 600 }}>
              Primary Chapter
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)", background: "#FFFBF0", fontSize: "0.8125rem", color: "#1a1a1e", outline: "none", marginBottom: "14px" }}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", marginBottom: "6px", fontWeight: 600 }}>
              Topic Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Consecration, Rose Quartz, Moon Sign"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)", background: "#FFFBF0", fontSize: "0.8125rem", color: "#1a1a1e", outline: "none" }}
            />
          </div>

          {/* Publishing Details Card */}
          <div className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid rgba(26,26,30,0.06)" }}>
            <strong style={{ display: "block", fontSize: "0.875rem", color: "#1a1a1e", marginBottom: "12px" }}>
              Publishing Details
            </strong>

            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", marginBottom: "6px", fontWeight: 600 }}>
              Author Name
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)", background: "#FFFBF0", fontSize: "0.8125rem", color: "#1a1a1e", outline: "none", marginBottom: "14px" }}
            />

            <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", marginBottom: "8px", fontWeight: 600 }}>
              Visibility Status
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", cursor: "pointer", color: "#1a1a1e" }}>
                <input
                  type="radio"
                  name="visibility"
                  checked={published}
                  onChange={() => setPublished(true)}
                />
                Live on Store
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8125rem", cursor: "pointer", color: "#1a1a1e" }}>
                <input
                  type="radio"
                  name="visibility"
                  checked={!published}
                  onChange={() => setPublished(false)}
                />
                Draft
              </label>
            </div>
          </div>

          {/* Delete Action (only if editing existing) */}
          {!isNew && (
            <div style={{ padding: "12px", border: "1px dashed rgba(220,38,38,0.25)", borderRadius: "12px", background: "rgba(220,38,38,0.02)", textAlign: "center" }}>
              <button
                type="button"
                onClick={handleDelete}
                style={{ background: "none", border: "none", color: "#dc2626", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}
              >
                Delete This Article
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
