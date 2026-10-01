import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  FileText,
  Sparkles,
  ExternalLink,
  Upload,
  Trash2,
  Copy,
  Check,
  Eye,
  Columns,
  Search,
  Image as ImageIcon,
  Tag,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Wand2,
} from "lucide-react"
import { api, getToken } from "../api"
import { compressImage } from "../utils/imageCompressor"
import RichTextEditor from "../components/RichTextEditor"
import "../styles/SanityJournal.css"

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

  // Sanity Studio View Mode
  const [viewMode, setViewMode] = useState<"document" | "split" | "seo">("document")

  // UI / Action states
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<"cover" | "list" | false>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState(false)

  const fileInput = useRef<HTMLInputElement>(null)
  const listInput = useRef<HTMLInputElement>(null)

  // Real-time word count & estimated read time
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]+>/g, " ").trim()
    return text ? text.split(/\s+/).filter(Boolean).length : 0
  }, [content])
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
    if (!isSlugCustomized && isNew) {
      setSlug(slugify(newTitle))
    }
  }

  // Keyboard shortcut: Cmd+S / Ctrl+S to save/publish
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        handleSave(published)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [title, content, slug, excerpt, cover, listImage, author, published])

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

  async function uploadImage(file: File, target: "cover" | "list") {
    setUploading(target)
    setError(null)
    setSuccessMsg(null)
    try {
      let fileToUpload = file
      try {
        const compressed = await compressImage(file, { quality: 0.82 })
        fileToUpload = compressed.file
      } catch (compErr) {
        console.warn("[Image Compressor] Compression skipped, using original file:", compErr)
      }

      const form = new FormData()
      form.append("files", fileToUpload)
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
        setSuccessMsg(`Image optimized & uploaded successfully.`)
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
        setSuccessMsg(isPublished ? "Story published live to storefront." : "Draft saved successfully.")
        if (publishDirectly !== undefined) setPublished(publishDirectly)
      } else {
        const d = await api<{ post: { id: string } }>("/admin/blog/posts", {
          method: "POST",
          body: JSON.stringify(body),
        })
        setSuccessMsg("Story created successfully. Opening studio editor…")
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

  function handleCopySlug() {
    const fullUrl = `https://younoya.com/journal/${slug}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedSlug(true)
    setTimeout(() => setCopiedSlug(false), 2000)
  }

  if (busy) {
    return (
      <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "5rem 1rem", textAlign: "center" }}>
        <p style={{ color: "var(--ad-ink-soft)" }}>Opening Sanity Studio Document Editor…</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: viewMode === "split" ? "1440px" : "1140px", margin: "0 auto", paddingBottom: "5rem", transition: "max-width 0.2s ease" }}>
      {/* ── Sanity Studio App Bar (Document Header) ── */}
      <header className="sanity-bar">
        <div className="sanity-bar__left">
          <Link to="/admin/journal" className="sanity-bar__back">
            <ArrowLeft size={14} /> Back
          </Link>

          <span className="sanity-bar__doc-type">
            <FileText size={12} /> Story
          </span>

          <span className={`sanity-bar__status-pill ${published ? "published" : "draft"}`}>
            <span className="sanity-bar__dot" />
            {published ? "Published" : "Draft"}
          </span>

          {published && slug && (
            <a
              href={`https://younoya.com/journal/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="sanity-bar__live-link"
              title="Open public story page"
            >
              Live on Site <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* View Mode Switcher (Sanity Studio style) */}
        <div className="sanity-view-tabs">
          <button
            type="button"
            className={`sanity-view-tab ${viewMode === "document" ? "is-active" : ""}`}
            onClick={() => setViewMode("document")}
          >
            <FileText size={13} /> Document
          </button>
          <button
            type="button"
            className={`sanity-view-tab ${viewMode === "split" ? "is-active" : ""}`}
            onClick={() => setViewMode("split")}
          >
            <Columns size={13} /> Split Preview
          </button>
          <button
            type="button"
            className={`sanity-view-tab ${viewMode === "seo" ? "is-active" : ""}`}
            onClick={() => setViewMode("seo")}
          >
            <Search size={13} /> SEO & Social
          </button>
        </div>

        {/* Action Controls */}
        <div className="sanity-bar__actions">
          <button
            type="button"
            disabled={saving || !!uploading}
            onClick={() => handleSave(false)}
            className="sanity-btn-ghost"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>

          <button
            type="button"
            disabled={saving || !!uploading}
            onClick={() => handleSave(true)}
            className={`sanity-btn-primary ${published ? "is-published" : ""}`}
          >
            {saving ? "Publishing…" : published ? "Update Live" : "Publish"}
            <span className="kbd-hint">⌘S</span>
          </button>
        </div>
      </header>

      {/* Status Alerts */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "var(--ad-rose-bg)", border: "1px solid var(--ad-rose)", borderRadius: "10px", color: "var(--ad-rose)", marginBottom: "1.5rem", fontSize: "13px" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {successMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "var(--ad-sage-bg)", border: "1px solid var(--ad-sage)", borderRadius: "10px", color: "var(--ad-sage)", marginBottom: "1.5rem", fontSize: "13px", fontWeight: 500 }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* ── SEO & Social Preview View ── */}
      {viewMode === "seo" && (
        <div className="sanity-card" style={{ marginBottom: 24 }}>
          <div className="sanity-card__head">
            <h2 className="sanity-card__title">
              <Search size={15} /> Search Engine & Social Media Simulation
            </h2>
            <span className="sanity-card__badge">Live Snippet</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            <div>
              <label className="sanity-label" style={{ marginBottom: 8 }}>Google SERP Snippet Preview</label>
              <div className="sanity-serp-preview">
                <span className="sanity-serp-badge">
                  <ExternalLink size={10} /> Google Search
                </span>
                <div className="sanity-serp-url">
                  https://younoya.com › journal › {slug || "story-slug"}
                </div>
                <div className="sanity-serp-title">
                  {title || "Untitled Story"} | YOUNOYA Journal
                </div>
                <div className="sanity-serp-desc">
                  {excerpt || "A compelling preview sentence summarizing this chapter or keepsake ritual for readers and seekers..."}
                </div>
              </div>
            </div>

            <div>
              <label className="sanity-label" style={{ marginBottom: 8 }}>Social Share Card (OpenGraph)</label>
              <div style={{ background: "#FFFFFF", border: "1px solid var(--ad-border)", borderRadius: "12px", overflow: "hidden" }}>
                {cover ? (
                  <img src={cover} alt="Social Card" style={{ width: "100%", aspectRatio: "1.91/1", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "1.91/1", background: "var(--ad-bg)", display: "grid", placeItems: "center", color: "var(--ad-ink-soft)", fontSize: 12 }}>
                    Cover image will display on social cards
                  </div>
                )}
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ad-ink-soft)", marginBottom: 4 }}>
                    younoya.com
                  </div>
                  <strong style={{ fontSize: 14, color: "var(--ad-ink)", display: "block", marginBottom: 4 }}>
                    {title || "Story Title"}
                  </strong>
                  <p style={{ fontSize: 12, color: "var(--ad-ink-soft)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {excerpt || "Excerpt preview text..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Studio Document Workspace ── */}
      <div className={`sanity-studio-layout ${viewMode === "split" ? "split-view" : ""}`}>
        {/* Left / Main Document Canvas */}
        <div className="sanity-doc-canvas">
          {/* Main Story Meta Card */}
          <div className="sanity-card">
            {/* Title Field */}
            <div className="sanity-field">
              <label className="sanity-label">
                <span>Article Title *</span>
                <span className="hint">Main editorial headline</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Consecration of the Rose Quartz Keepsake"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="sanity-input-title"
              />
            </div>

            {/* Sanity Slug Box */}
            <div className="sanity-field">
              <label className="sanity-label">
                <span>Slug / URL Identifier *</span>
                <span className="hint">Canonical web address</span>
              </label>
              <div className="sanity-slug-box">
                <span className="sanity-slug-prefix">younoya.com/journal/</span>
                <input
                  type="text"
                  placeholder="custom-article-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value)
                    setIsSlugCustomized(true)
                  }}
                  className="sanity-slug-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSlug(slugify(title))
                    setIsSlugCustomized(false)
                  }}
                  className="sanity-slug-action"
                  title="Generate slug from article title"
                >
                  <Wand2 size={12} /> Generate
                </button>
                <button
                  type="button"
                  onClick={handleCopySlug}
                  className="sanity-slug-action"
                  title="Copy full URL"
                >
                  {copiedSlug ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            {/* Excerpt Field */}
            <div className="sanity-field">
              <label className="sanity-label">
                <span>Teaser Excerpt</span>
                <span className="hint">{excerpt.length}/160 characters</span>
              </label>
              <textarea
                placeholder="A compelling preview sentence summarizing this chapter or keepsake ritual..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="sanity-textarea"
              />
            </div>
          </div>

          {/* Portable Text / Body Content Card */}
          <div className="sanity-card">
            <div className="sanity-card__head">
              <h2 className="sanity-card__title">
                <FileText size={15} /> Story Content *
              </h2>
              <span className="sanity-card__badge">
                <Clock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                {wordCount.toLocaleString()} words · {readTime} min read
              </span>
            </div>

            <RichTextEditor
              key={id || "new"}
              content={content}
              onChange={setContent}
              placeholder="Compose your chapter with intentional prose. Select text to add product backlinks or press Ctrl+K..."
            />
          </div>
        </div>

        {/* ── Split Preview Right Panel (If Active) ── */}
        {viewMode === "split" ? (
          <aside className="sanity-live-preview">
            <div className="sanity-live-preview__bar">
              <span>Live Storefront Preview</span>
              <span>younoya.com/journal/{slug || "slug"}</span>
            </div>
            <div className="sanity-live-preview__scroll">
              <span className="sanity-live-preview__category">{category}</span>
              <h1 className="sanity-live-preview__title">{title || "Untitled Story"}</h1>
              <div className="sanity-live-preview__meta">
                <span>By {author}</span>
                <span>•</span>
                <span>{readTime} min read</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              {cover && (
                <img src={cover} alt="Preview Banner" className="sanity-live-preview__cover" />
              )}

              {excerpt && (
                <div className="sanity-live-preview__excerpt">
                  "{excerpt}"
                </div>
              )}

              <div
                className="article-prose"
                style={{ lineHeight: 1.8, fontSize: "15px", color: "var(--ad-ink)" }}
                dangerouslySetInnerHTML={{ __html: content || "<p style='color: #8a8175; font-style: italic'>Your formatted story content will render here in real time...</p>" }}
              />
            </div>
          </aside>
        ) : (
          /* ── Right Inspector Panel (Sanity Studio Inspector) ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* 16:9 Cover Hero Banner */}
            <div className="sanity-card">
              <div className="sanity-card__head">
                <h3 className="sanity-card__title">
                  <ImageIcon size={14} /> Cover Image (16:9)
                </h3>
                <span className="sanity-card__badge">Hero Banner</span>
              </div>

              <div className="sanity-asset-box">
                {cover ? (
                  <div className="sanity-asset-preview" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={cover}
                      alt="16:9 Cover Preview"
                      onError={() => setError("Cover image failed to load. Please verify image URL.")}
                    />
                    <div className="sanity-asset-overlay">
                      <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        className="sanity-asset-action-btn"
                        title="Replace image"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCover(""); setCustomCoverUrl(""); }}
                        className="sanity-asset-action-btn danger"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="sanity-asset-empty" style={{ aspectRatio: "16/9" }}>
                    <div>
                      <ImageIcon size={22} style={{ opacity: 0.5, marginBottom: 6 }} />
                      <p style={{ margin: "0 0 2px", fontWeight: 600 }}>No cover image selected</p>
                      <small style={{ color: "var(--ad-ink-soft)" }}>1920×1080 recommended</small>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")}
                />

                <button
                  type="button"
                  disabled={!!uploading}
                  onClick={() => fileInput.current?.click()}
                  className="sanity-asset-btn"
                >
                  <Upload size={13} />
                  {uploading === "cover" ? "Optimizing & Uploading…" : "Upload 16:9 Asset"}
                </button>

                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://…)"
                  value={customCoverUrl}
                  onChange={(e) => {
                    setCustomCoverUrl(e.target.value)
                    setCover(normalizeImageUrl(e.target.value))
                  }}
                  className="sanity-input-url"
                />
              </div>
            </div>

            {/* 1:1 Listing Square Thumbnail */}
            <div className="sanity-card">
              <div className="sanity-card__head">
                <h3 className="sanity-card__title">
                  <ImageIcon size={14} /> Grid Image (1:1)
                </h3>
                <span className="sanity-card__badge">Listing Square</span>
              </div>

              <div className="sanity-asset-box">
                {listImage ? (
                  <div className="sanity-asset-preview" style={{ width: 140, height: 140, margin: "0 auto" }}>
                    <img
                      src={listImage}
                      alt="1:1 List Preview"
                      onError={() => setError("1:1 image failed to load. Please verify URL.")}
                    />
                    <div className="sanity-asset-overlay">
                      <button
                        type="button"
                        onClick={() => { setListImage(""); setCustomListUrl(""); }}
                        className="sanity-asset-action-btn danger"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="sanity-asset-empty" style={{ aspectRatio: "16/9" }}>
                    <div>
                      <p style={{ margin: "0 0 2px", fontWeight: 600 }}>No grid image selected</p>
                      <small style={{ color: "var(--ad-ink-soft)" }}>600×600 square</small>
                    </div>
                  </div>
                )}

                <input
                  ref={listInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "list")}
                />

                <button
                  type="button"
                  disabled={!!uploading}
                  onClick={() => listInput.current?.click()}
                  className="sanity-asset-btn"
                >
                  <Upload size={13} />
                  {uploading === "list" ? "Optimizing & Uploading…" : "Upload 1:1 Asset"}
                </button>

                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://…)"
                  value={customListUrl}
                  onChange={(e) => {
                    setCustomListUrl(e.target.value)
                    setListImage(normalizeImageUrl(e.target.value))
                  }}
                  className="sanity-input-url"
                />
              </div>
            </div>

            {/* Categorization & Metadata */}
            <div className="sanity-card">
              <div className="sanity-card__head">
                <h3 className="sanity-card__title">
                  <Tag size={14} /> Chapter & Categories
                </h3>
              </div>

              <div className="sanity-field">
                <label className="sanity-label">Primary Chapter</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--ad-border)",
                    background: "#FFFFFF",
                    fontSize: "13px",
                    color: "var(--ad-ink)",
                    outline: "none",
                  }}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sanity-field">
                <label className="sanity-label">Topic Tags</label>
                <input
                  type="text"
                  placeholder="e.g. Consecration, Rose Quartz, Moon Sign"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--ad-border)",
                    background: "#FFFFFF",
                    fontSize: "13px",
                    color: "var(--ad-ink)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Publishing & Attribution */}
            <div className="sanity-card">
              <div className="sanity-card__head">
                <h3 className="sanity-card__title">
                  <User size={14} /> Publishing Details
                </h3>
              </div>

              <div className="sanity-field">
                <label className="sanity-label">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--ad-border)",
                    background: "#FFFFFF",
                    fontSize: "13px",
                    color: "var(--ad-ink)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div className="sanity-field">
                <label className="sanity-label">Visibility Status</label>
                <div style={{ display: "flex", gap: "16px", marginTop: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "var(--ad-ink)", fontWeight: 500 }}>
                    <input
                      type="radio"
                      name="visibility"
                      checked={published}
                      onChange={() => setPublished(true)}
                    />
                    Live on Store
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "var(--ad-ink)", fontWeight: 500 }}>
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

              {!isNew && (
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--ad-border)" }}>
                  <button
                    type="button"
                    onClick={handleDelete}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "transparent",
                      border: "none",
                      color: "var(--ad-rose)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Trash2 size={13} /> Delete Article Permanently
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
