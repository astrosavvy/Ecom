import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
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
  const [cover, setCover] = useState<string>("")
  const [listImage, setListImage] = useState<string>("")
  const [customCoverUrl, setCustomCoverUrl] = useState("")
  const [customListUrl, setCustomListUrl] = useState("")
  const [author, setAuthor] = useState("YOUNOYA")
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<"cover" | "list" | false>(false)
  const [useFallbackTextarea, setUseFallbackTextarea] = useState(false)
  const [fallbackContent, setFallbackContent] = useState("")

  const editorRef = useRef<HTMLDivElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const listInput = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: { attributes: { class: "ad-editor__area" } },
    onUpdate: ({ editor }) => {
      setFallbackContent(editor.getHTML())
    },
  })

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
        setCover(normalizeImageUrl(p.cover_image ?? ""))
        setListImage(normalizeImageUrl(p.list_image ?? ""))
        setCustomCoverUrl(normalizeImageUrl(p.cover_image ?? ""))
        setCustomListUrl(normalizeImageUrl(p.list_image ?? ""))
        setAuthor(p.author || "YOUNOYA")
        setPublished(p.published)
        setFallbackContent(p.content || "")
        editor?.commands.setContent(p.content || "")
        editorRef.current?.scrollIntoView({ behavior: "smooth" })
      })
      .catch(() => setError("Could not load selected post."))
  }, [editingId, editor])

  function resetForm() {
    setEditingId(null)
    setTitle("")
    setExcerpt("")
    setCover("")
    setListImage("")
    setCustomCoverUrl("")
    setCustomListUrl("")
    setAuthor("YOUNOYA")
    setPublished(false)
    setFallbackContent("")
    editor?.commands.setContent("")
    setError(null)
    setSuccessMsg(null)
    setSearchParams({})
  }

  function startEdit(p: Post) {
    setEditingId(p.id)
    setTitle(p.title)
    setExcerpt(p.excerpt ?? "")
    setCover(normalizeImageUrl(p.cover_image ?? ""))
    setListImage(normalizeImageUrl(p.list_image ?? ""))
    setCustomCoverUrl(normalizeImageUrl(p.cover_image ?? ""))
    setCustomListUrl(normalizeImageUrl(p.list_image ?? ""))
    setAuthor(p.author || "YOUNOYA")
    setPublished(p.published)
    setFallbackContent(p.content || "")
    editor?.commands.setContent(p.content || "")
    setSuccessMsg(null)
    setError(null)
    setSearchParams({ edit: p.id })
    editorRef.current?.scrollIntoView({ behavior: "smooth" })
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

    const htmlContent = useFallbackTextarea
      ? fallbackContent
      : editor?.getHTML() || fallbackContent

    if (!htmlContent || htmlContent === "<p></p>" || htmlContent.trim().length < 5) {
      setError("Please add some article content before publishing or saving.")
      return
    }

    setSaving(true)
    setError(null)
    setSuccessMsg(null)

    const isPublished = publishDirectly !== undefined ? publishDirectly : published
    const body: Record<string, unknown> = {
      title: title.trim(),
      content: htmlContent,
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
    <div className="ad__page ad__page--wide">
      {/* Top Header */}
      <header className="ad__head ad__head--row">
        <div>
          <h1>Journal Studio</h1>
          <p>Write stories, ritual guides, and keepsakes chronicles for the YOUNOYA journal.</p>
        </div>
        <div className="ad-actions">
          {editingId ? (
            <button className="ad-btn-plain" onClick={resetForm}>
              + Write New Post
            </button>
          ) : (
            <span className="ad-chip ad-chip--ok">Ready to Write</span>
          )}
        </div>
      </header>

      {error && <p className="ad-error" style={{ marginBottom: "1rem" }}>{error}</p>}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(52, 211, 153, 0.12)", border: "1px solid #34d399", borderRadius: "10px", color: "#065f46", marginBottom: "1.25rem", fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Main Authoring Form */}
      <section className="ad-card ad-editor" ref={editorRef} style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(26,26,30,0.06)", paddingBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, color: "var(--yn-gold, #D4AF37)" }}>
              {editingId ? "Editing Article" : "Write New Article"}
            </span>
            <h2 style={{ fontSize: "1.25rem", margin: "4px 0 0", color: "#1a1a1e" }}>
              {title ? title : "Untitled Post"}
            </h2>
          </div>
          <div className="ad-actions">
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
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              className="ad-btn"
              type="button"
              style={{ background: "#D4AF37", color: "#07080E", fontWeight: 600 }}
              disabled={saving || !!uploading}
              onClick={() => handleSave(true)}
            >
              {saving ? "Publishing…" : published && editingId ? "Update Live Post" : "★ Publish to Store"}
            </button>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", marginBottom: "4px", fontWeight: 600 }}>
            Post Title *
          </label>
          <input
            className="ad-editor__title"
            placeholder="e.g. Consecration of the Rose Quartz Atelier"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {/* Excerpt Input */}
        <div>
          <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", marginBottom: "4px", fontWeight: 600 }}>
            Teaser Summary / Excerpt (Optional preview sentence)
          </label>
          <textarea
            className="ad-editor__excerpt"
            placeholder="A short teaser shown on journal cards and search previews..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            style={{ width: "100%" }}
          />
        </div>

        {/* Dual Image Uploaders */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "8px" }}>
          {/* 16:9 Cover Hero */}
          <div style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.08)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.8125rem", color: "#1a1a1e" }}>Cover Image (16:9)</strong>
              <small style={{ color: "#6b645c" }}>Hero background</small>
            </div>
            
            {cover ? (
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <img
                  src={cover}
                  alt="16:9 Cover Preview"
                  style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)" }}
                  onError={() => setError("16:9 Cover preview failed to load. Check image URL.")}
                />
                <button
                  type="button"
                  onClick={() => { setCover(""); setCustomCoverUrl(""); }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="ad-editor__cover-empty" style={{ width: "100%", aspectRatio: "16/9", marginBottom: "10px" }}>
                No cover image selected
                <br /><small style={{ opacity: 0.7 }}>Recommended: 1920×1080 or 1200×675</small>
              </div>
            )}

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")}
            />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
              <button
                type="button"
                className="ad-btn-plain"
                disabled={!!uploading}
                onClick={() => fileInput.current?.click()}
                style={{ fontSize: "0.8125rem", padding: "6px 12px" }}
              >
                {uploading === "cover" ? "Uploading…" : "Upload 16:9 file"}
              </button>
            </div>

            {/* Direct Image URL input fallback */}
            <div style={{ marginTop: "6px" }}>
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value)
                  setCover(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "0.75rem", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", background: "#FFFBF0" }}
              />
            </div>
          </div>

          {/* 1:1 List Image */}
          <div style={{ background: "#fff", border: "1px solid rgba(26,26,30,0.08)", borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "0.8125rem", color: "#1a1a1e" }}>Grid Image (1:1)</strong>
              <small style={{ color: "#6b645c" }}>Card listing</small>
            </div>

            {listImage ? (
              <div style={{ position: "relative", marginBottom: "10px", width: "140px", margin: "0 auto" }}>
                <img
                  src={listImage}
                  alt="1:1 List Preview"
                  style={{ width: "140px", height: "140px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.1)" }}
                  onError={() => setError("1:1 List preview failed to load. Check image URL.")}
                />
                <button
                  type="button"
                  onClick={() => { setListImage(""); setCustomListUrl(""); }}
                  style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="ad-editor__cover-empty" style={{ width: "100%", aspectRatio: "2/1", marginBottom: "10px" }}>
                No grid image selected
                <br /><small style={{ opacity: 0.7 }}>Recommended: 600×600 square</small>
              </div>
            )}

            <input
              ref={listInput}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "list")}
            />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
              <button
                type="button"
                className="ad-btn-plain"
                disabled={!!uploading}
                onClick={() => listInput.current?.click()}
                style={{ fontSize: "0.8125rem", padding: "6px 12px" }}
              >
                {uploading === "list" ? "Uploading…" : "Upload 1:1 file"}
              </button>
            </div>

            {/* Direct Image URL input fallback */}
            <div style={{ marginTop: "6px" }}>
              <input
                type="url"
                placeholder="Or paste direct image URL (https://...)"
                value={customListUrl}
                onChange={(e) => {
                  setCustomListUrl(e.target.value)
                  setListImage(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "0.75rem", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.12)", background: "#FFFBF0" }}
              />
            </div>
          </div>
        </div>

        {/* Content Editor Section */}
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b645c", fontWeight: 600 }}>
              Article Body Content *
            </label>
            <button
              type="button"
              onClick={() => setUseFallbackTextarea(!useFallbackTextarea)}
              style={{ background: "none", border: "none", color: "var(--yn-gold, #D4AF37)", fontSize: "0.75rem", cursor: "pointer", textDecoration: "underline" }}
            >
              {useFallbackTextarea ? "Switch to visual rich editor" : "Switch to plain HTML editor"}
            </button>
          </div>

          {!useFallbackTextarea && editor ? (
            <>
              <div className="ad-editor__bar" style={{ marginBottom: "6px" }}>
                <button type="button" className={editor.isActive("bold") ? "on" : ""} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
                <button type="button" className={editor.isActive("italic") ? "on" : ""} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
                <button type="button" className={editor.isActive("heading", { level: 2 }) ? "on" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
                <button type="button" className={editor.isActive("heading", { level: 3 }) ? "on" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
                <button type="button" className={editor.isActive("bulletList") ? "on" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
                <button type="button" className={editor.isActive("blockquote") ? "on" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝ Quote</button>
                <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>― Line</button>
              </div>
              <EditorContent editor={editor} />
            </>
          ) : (
            <textarea
              className="ad-editor__area"
              value={fallbackContent}
              onChange={(e) => {
                setFallbackContent(e.target.value)
                editor?.commands.setContent(e.target.value)
              }}
              rows={12}
              placeholder="Write story content (HTML or plain text paragraph tags)..."
              style={{ width: "100%", fontFamily: "monospace", fontSize: "0.875rem" }}
            />
          )}
        </div>

        {/* Bottom Bar Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid rgba(26,26,30,0.06)", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ fontSize: "0.8125rem", color: "#6b645c" }}>Author:</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", fontSize: "0.8125rem", width: "140px" }}
            />
            <span className={`ad-chip ad-chip--${published ? "ok" : "wait"}`}>
              {published ? "Status: Live" : "Status: Draft"}
            </span>
          </div>

          <div className="ad-actions">
            {editingId && (
              <button className="ad-btn-plain" type="button" onClick={resetForm} disabled={saving}>
                Clear / New Post
              </button>
            )}
            <button
              className="ad-btn-plain"
              type="button"
              disabled={saving || !!uploading}
              onClick={() => handleSave(false)}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              className="ad-btn"
              type="button"
              style={{ background: "#D4AF37", color: "#07080E", fontWeight: 600 }}
              disabled={saving || !!uploading}
              onClick={() => handleSave(true)}
            >
              {saving ? "Publishing…" : published && editingId ? "Update Live Post" : "★ Publish to Store"}
            </button>
          </div>
        </div>
      </section>

      {/* Existing Posts Table */}
      <section className="ad-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", margin: 0, color: "#1a1a1e" }}>All Articles ({posts.length})</h2>
            <p style={{ fontSize: "0.8125rem", color: "#6b645c", margin: "2px 0 0" }}>
              Click 'Edit' to load any story into the studio above.
            </p>
          </div>
        </div>

        <table className="ad-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Status</th>
              <th className="ad-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {busy && posts.length === 0 && (
              <tr><td colSpan={6} className="ad-empty">Loading articles…</td></tr>
            )}
            {!busy && posts.length === 0 && (
              <tr><td colSpan={6} className="ad-empty">No posts yet — write your first story above!</td></tr>
            )}
            {posts.map((p) => (
              <tr key={p.id} style={editingId === p.id ? { background: "rgba(212, 175, 55, 0.08)" } : undefined}>
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
