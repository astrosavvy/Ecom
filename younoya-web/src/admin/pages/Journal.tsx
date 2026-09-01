import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { api, fmtDate, getToken } from "../api"

const API = import.meta.env.VITE_API_URL || "https://api.younoya.com"

type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  cover_image?: string | null
  list_image?: string | null
  published: boolean
  published_at?: string | null
  author: string
  created_at: string
}

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

export default function Journal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const editIdFromUrl = searchParams.get("edit")

  const [posts, setPosts] = useState<Post[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Form states
  const [editingId, setEditingId] = useState<string | null>(editIdFromUrl)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [cover, setCover] = useState<string>("")
  const [listImage, setListImage] = useState<string>("")
  const [customCoverUrl, setCustomCoverUrl] = useState("")
  const [customListUrl, setCustomListUrl] = useState("")
  const [author, setAuthor] = useState("YOUNOYA")
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<"cover" | "list" | false>(false)
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const editorRef = useRef<HTMLDivElement>(null)
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const listInput = useRef<HTMLInputElement>(null)

  function loadPosts() {
    setBusy(true)
    api("/admin/blog/posts?limit=50")
      .then((d: any) => setPosts(d.posts ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load posts."))
      .finally(() => setBusy(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  // Sync editing post when editingId changes
  useEffect(() => {
    if (!editingId) return
    api(`/admin/blog/posts/${editingId}`)
      .then((d: any) => {
        if (!d.post) return
        const p: Post = d.post
        setTitle(p.title)
        setExcerpt(p.excerpt ?? "")
        setContent(p.content || "")
        setCover(normalizeImageUrl(p.cover_image ?? ""))
        setListImage(normalizeImageUrl(p.list_image ?? ""))
        setCustomCoverUrl(normalizeImageUrl(p.cover_image ?? ""))
        setCustomListUrl(normalizeImageUrl(p.list_image ?? ""))
        setAuthor(p.author || "YOUNOYA")
        setPublished(p.published)
        editorRef.current?.scrollIntoView({ behavior: "smooth" })
      })
      .catch(() => setError("Could not load selected post."))
  }, [editingId])

  function resetForm() {
    setEditingId(null)
    setTitle("")
    setExcerpt("")
    setContent("")
    setCover("")
    setListImage("")
    setCustomCoverUrl("")
    setCustomListUrl("")
    setAuthor("YOUNOYA")
    setPublished(false)
    setError(null)
    setSuccessMsg(null)
    setSearchParams({})
  }

  function startEdit(p: Post) {
    setEditingId(p.id)
    setTitle(p.title)
    setExcerpt(p.excerpt ?? "")
    setContent(p.content || "")
    setCover(normalizeImageUrl(p.cover_image ?? ""))
    setListImage(normalizeImageUrl(p.list_image ?? ""))
    setCustomCoverUrl(normalizeImageUrl(p.cover_image ?? ""))
    setCustomListUrl(normalizeImageUrl(p.list_image ?? ""))
    setAuthor(p.author || "YOUNOYA")
    setPublished(p.published)
    setSuccessMsg(null)
    setError(null)
    setSearchParams({ edit: p.id })
    editorRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
        throw new Error(t || "Upload failed. Try a different image or paste image URL below.")
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
      setError("Please provide a title for the blog post.")
      return
    }

    if (!content.trim() || content.trim().length < 5) {
      setError("Please add article content before publishing or saving.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    const isPublished = publishDirectly !== undefined ? publishDirectly : published
    const body: Record<string, unknown> = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      cover_image: cover.trim() || undefined,
      list_image: listImage.trim() || undefined,
      author: author.trim() || "YOUNOYA",
      published: isPublished,
    }

    try {
      if (editingId) {
        await api(`/admin/blog/posts/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        })
        setSuccessMsg(isPublished ? "Article updated and published to storefront!" : "Draft updated successfully.")
      } else {
        const d = await api<{ post: { id: string } }>("/admin/blog/posts", {
          method: "POST",
          body: JSON.stringify(body),
        })
        setSuccessMsg(isPublished ? "New article published live to storefront!" : "New draft saved successfully.")
        setEditingId(d.post.id)
      }
      if (publishDirectly !== undefined) setPublished(publishDirectly)
      loadPosts()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save post.")
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(p: Post) {
    try {
      await api(`/admin/blog/posts/${p.id}`, {
        method: "PUT",
        body: JSON.stringify({ published: !p.published }),
      })
      loadPosts()
      if (editingId === p.id) {
        setPublished(!p.published)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not toggle publish state.")
    }
  }

  async function removePost(p: Post) {
    if (!confirm(`Delete "${p.title}"? This action cannot be undone.`)) return
    try {
      await api(`/admin/blog/posts/${p.id}`, { method: "DELETE" })
      if (editingId === p.id) {
        resetForm()
      }
      loadPosts()
      setSuccessMsg(`Deleted "${p.title}".`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete post.")
    }
  }

  return (
    <div className="ad__page ad__page--wide" style={{ paddingBottom: "4rem" }}>
      {/* Top Header */}
      <header className="ad__head ad__head--row" style={{ alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 4px", color: "#1a1a1e" }}>Journal Studio</h1>
          <p style={{ margin: 0, color: "#6b645c", fontSize: "0.9375rem" }}>
            Write stories, ritual guides, and keepsakes chronicles for the storefront.
          </p>
        </div>
        <div className="ad-actions">
          {editingId ? (
            <button className="ad-btn-plain" onClick={resetForm}>
              + Write New Post
            </button>
          ) : (
            <span className="ad-chip ad-chip--ok">Editor Ready</span>
          )}
        </div>
      </header>

      {error && (
        <div className="ad-error" style={{ padding: "10px 14px", background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.3)", borderRadius: "8px", color: "#dc2626", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(52, 211, 153, 0.12)", border: "1px solid #34d399", borderRadius: "10px", color: "#065f46", marginBottom: "1.25rem", fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Main Authoring Card */}
      <section
        className="ad-card"
        ref={editorRef}
        style={{
          background: "#FFFBF0",
          border: "1px solid rgba(212, 175, 55, 0.25)",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "2.5rem",
          boxShadow: "0 4px 20px -6px rgba(0,0,0,0.08)"
        }}
      >
        {/* Editor Title Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(26,26,30,0.08)", paddingBottom: "14px", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, color: "var(--yn-gold, #D4AF37)", display: "block" }}>
              {editingId ? "Editing Existing Post" : "Compose New Story"}
            </span>
            <h2 style={{ fontSize: "1.35rem", margin: "4px 0 0", color: "#1a1a1e", fontWeight: 500 }}>
              {title ? title : "Untitled Story"}
            </h2>
          </div>
          <div className="ad-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {editingId && (
              <button className="ad-btn-plain" type="button" onClick={resetForm} disabled={saving}>
                Cancel Edit
              </button>
            )}
            <button
              className="ad-btn-plain"
              type="button"
              disabled={saving || !!uploading}
              onClick={() => handleSave(false)}
              style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.15)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              className="ad-btn"
              type="button"
              style={{ background: "var(--yn-gold, #D4AF37)", color: "#07080E", fontWeight: 600, padding: "8px 20px", borderRadius: "8px", cursor: "pointer", border: "none" }}
              disabled={saving || !!uploading}
              onClick={() => handleSave(true)}
            >
              {saving ? "Publishing…" : published && editingId ? "Update Live Post" : "★ Publish Live"}
            </button>
          </div>
        </div>

        {/* Post Title */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", marginBottom: "6px", fontWeight: 700 }}>
            Post Title *
          </label>
          <input
            className="ad-editor__title"
            placeholder="e.g. Consecration of the Rose Quartz Atelier"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", fontSize: "1.5rem", padding: "10px 14px", background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "10px", outline: "none", color: "#1a1a1e" }}
          />
        </div>

        {/* Excerpt */}
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", marginBottom: "6px", fontWeight: 700 }}>
            Teaser Excerpt (1-2 sentences shown on journal grid cards and SEO)
          </label>
          <textarea
            placeholder="A short teaser summary for preview cards..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            style={{ width: "100%", padding: "10px 14px", background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "10px", outline: "none", fontSize: "0.875rem", color: "#1a1a1e", resize: "vertical" }}
          />
        </div>

        {/* Dual Image Uploaders */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px", marginBottom: "20px" }}>
          {/* 16:9 Cover Hero */}
          <div style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.08)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.875rem", color: "#1a1a1e" }}>Cover Image (16:9)</strong>
              <small style={{ color: "#8a8175" }}>Article hero header</small>
            </div>
            
            {cover ? (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <img
                  src={cover}
                  alt="16:9 Cover Preview"
                  style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)" }}
                  onError={() => setError("Cover image URL failed to load. Please verify link.")}
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
              <div style={{ width: "100%", aspectRatio: "16/9", display: "grid", placeItems: "center", border: "1px dashed rgba(26,26,30,0.2)", borderRadius: "8px", background: "rgba(255,251,240,0.6)", color: "#8a8175", textAlign: "center", padding: "12px", marginBottom: "10px", fontSize: "0.8125rem" }}>
                No cover image selected
                <br /><small style={{ opacity: 0.7 }}>1920×1080 or 1200×675 recommended</small>
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
                style={{ fontSize: "0.8125rem", padding: "7px 14px", background: "#f3ede2", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", cursor: "pointer" }}
              >
                {uploading === "cover" ? "Uploading…" : "📁 Upload 16:9 Image"}
              </button>
            </div>
            <div>
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value)
                  setCover(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "0.75rem", padding: "7px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", background: "#FFFBF0" }}
              />
            </div>
          </div>

          {/* 1:1 List Image */}
          <div style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.08)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.875rem", color: "#1a1a1e" }}>Grid Image (1:1)</strong>
              <small style={{ color: "#8a8175" }}>Card listing square</small>
            </div>

            {listImage ? (
              <div style={{ position: "relative", marginBottom: "10px", width: "140px", margin: "0 auto" }}>
                <img
                  src={listImage}
                  alt="1:1 List Preview"
                  style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)" }}
                  onError={() => setError("1:1 image URL failed to load. Please verify link.")}
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
              <div style={{ width: "100%", aspectRatio: "16/9", display: "grid", placeItems: "center", border: "1px dashed rgba(26,26,30,0.2)", borderRadius: "8px", background: "rgba(255,251,240,0.6)", color: "#8a8175", textAlign: "center", padding: "12px", marginBottom: "10px", fontSize: "0.8125rem" }}>
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
                style={{ fontSize: "0.8125rem", padding: "7px 14px", background: "#f3ede2", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", cursor: "pointer" }}
              >
                {uploading === "list" ? "Uploading…" : "📁 Upload 1:1 Image"}
              </button>
            </div>
            <div>
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                value={customListUrl}
                onChange={(e) => {
                  setCustomListUrl(e.target.value)
                  setListImage(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "0.75rem", padding: "7px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", background: "#FFFBF0" }}
              />
            </div>
          </div>
        </div>

        {/* Content Formatting Toolbar & Editor Tabs */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b645c", fontWeight: 700 }}>
              Article Body Content *
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid rgba(26,26,30,0.15)",
                  background: activeTab === "write" ? "var(--yn-gold, #D4AF37)" : "#fff",
                  color: activeTab === "write" ? "#07080E" : "#1a1a1e"
                }}
              >
                ✏️ Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid rgba(26,26,30,0.15)",
                  background: activeTab === "preview" ? "var(--yn-gold, #D4AF37)" : "#fff",
                  color: activeTab === "preview" ? "#07080E" : "#1a1a1e"
                }}
              >
                👁️ Live Preview
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <div>
              {/* Quick formatting buttons */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px", background: "#f3ede2", padding: "6px 8px", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.08)" }}>
                <button type="button" onClick={() => insertFormat("<strong>", "</strong>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}><b>B</b></button>
                <button type="button" onClick={() => insertFormat("<em>", "</em>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}><i>I</i></button>
                <button type="button" onClick={() => insertFormat("<h2>", "</h2>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>H2</button>
                <button type="button" onClick={() => insertFormat("<h3>", "</h3>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>H3</button>
                <button type="button" onClick={() => insertFormat("<ul>\n  <li>", "</li>\n</ul>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>• List</button>
                <button type="button" onClick={() => insertFormat("<blockquote>", "</blockquote>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>❝ Quote</button>
                <button type="button" onClick={() => insertFormat("<hr />\n", "")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>― Line</button>
                <button type="button" onClick={() => insertFormat("<p>", "</p>")} style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.1)", borderRadius: "4px", padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>Paragraph</button>
              </div>

              <textarea
                ref={contentTextareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                placeholder="Write your article story here (supports paragraphs, headings, lists, quotes)..."
                style={{
                  width: "100%",
                  minHeight: "280px",
                  padding: "14px 16px",
                  background: "#fff",
                  border: "1px solid rgba(26,26,30,0.12)",
                  borderRadius: "10px",
                  outline: "none",
                  fontFamily: "var(--font-body, Inter, sans-serif)",
                  fontSize: "0.9375rem",
                  lineHeight: "1.7",
                  color: "#1a1a1e",
                  resize: "vertical"
                }}
              />
            </div>
          ) : (
            <div
              style={{
                minHeight: "280px",
                padding: "20px 24px",
                background: "#fff",
                border: "1px solid rgba(26,26,30,0.12)",
                borderRadius: "10px",
                fontFamily: "var(--font-body, Inter, sans-serif)",
                color: "#1a1a1e",
                lineHeight: "1.7"
              }}
            >
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p style={{ color: "#8a8175", fontStyle: "italic" }}>No content written yet. Switch to the 'Write' tab to compose your story.</p>
              )}
            </div>
          )}
        </div>

        {/* Author & Actions Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid rgba(26,26,30,0.08)", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "0.8125rem", color: "#6b645c", fontWeight: 600 }}>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", fontSize: "0.8125rem", width: "160px", background: "#fff" }}
            />
            <span className={`ad-chip ad-chip--${published ? "ok" : "wait"}`}>
              {published ? "● Live on Store" : "○ Draft Mode"}
            </span>
          </div>

          <div className="ad-actions" style={{ display: "flex", gap: "10px" }}>
            {editingId && (
              <button className="ad-btn-plain" type="button" onClick={resetForm} disabled={saving}>
                Reset
              </button>
            )}
            <button
              className="ad-btn-plain"
              type="button"
              disabled={saving || !!uploading}
              onClick={() => handleSave(false)}
              style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.15)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              className="ad-btn"
              type="button"
              style={{ background: "var(--yn-gold, #D4AF37)", color: "#07080E", fontWeight: 600, padding: "8px 20px", borderRadius: "8px", cursor: "pointer", border: "none" }}
              disabled={saving || !!uploading}
              onClick={() => handleSave(true)}
            >
              {saving ? "Publishing…" : published && editingId ? "Update Live Post" : "★ Publish Live"}
            </button>
          </div>
        </div>
      </section>

      {/* Published & Draft Articles Table */}
      <section className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", margin: 0, color: "#1a1a1e" }}>All Articles ({posts.length})</h2>
            <p style={{ fontSize: "0.8125rem", color: "#6b645c", margin: "2px 0 0" }}>
              Click 'Edit' on any story to load it into the studio above.
            </p>
          </div>
        </div>

        <table className="ad-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Status</th>
              <th className="ad-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {busy && posts.length === 0 && (
              <tr><td colSpan={6} className="ad-empty">Loading articles…</td></tr>
            )}
            {!busy && posts.length === 0 && (
              <tr><td colSpan={6} className="ad-empty">No posts yet — write your first story in the studio above!</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} style={editingId === p.id ? { background: "rgba(212, 175, 55, 0.1)" } : undefined}>
                <td>
                  {p.list_image || p.cover_image ? (
                    <img
                      src={normalizeImageUrl(p.list_image || p.cover_image || "")}
                      alt=""
                      style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "rgba(26,26,30,0.06)", display: "grid", placeItems: "center", fontSize: "12px" }}>
                      ✎
                    </div>
                  )}
                </td>
                <td>
                  <strong style={{ display: "block", color: "#1a1a1e" }}>{p.title}</strong>
                  <small style={{ color: "#6b645c" }}>/{p.slug}</small>
                </td>
                <td>{p.author || "YOUNOYA"}</td>
                <td>{fmtDate(p.created_at)}</td>
                <td>
                  <span className={`ad-chip ad-chip--${p.published ? "ok" : "wait"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="ad-right">
                  <div className="ad-actions">
                    <button
                      className="ad-btn-plain"
                      onClick={() => startEdit(p)}
                      title="Load into editor above"
                    >
                      Edit
                    </button>
                    <button
                      className="ad-btn-plain"
                      onClick={() => togglePublish(p)}
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="ad-btn-plain ad-danger"
                      onClick={() => removePost(p)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
