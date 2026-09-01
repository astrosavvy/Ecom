import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
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

export default function JournalEdit() {
  const { id } = useParams()
  const nav = useNavigate()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [cover, setCover] = useState<string>("")
  const [listImage, setListImage] = useState<string>("")
  const [customCoverUrl, setCustomCoverUrl] = useState("")
  const [customListUrl, setCustomListUrl] = useState("")
  const [published, setPublished] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState<"cover" | "list" | false>(false)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const listInput = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: { attributes: { class: "ad-editor__area" } },
  })

  useEffect(() => {
    if (!id) return
    api(`/admin/blog/posts/${id}`)
      .then((d: any) => {
        setTitle(d.post.title)
        setExcerpt(d.post.excerpt ?? "")
        const normCover = normalizeImageUrl(d.post.cover_image ?? "")
        const normList = normalizeImageUrl(d.post.list_image ?? "")
        setCover(normCover)
        setListImage(normList)
        setCustomCoverUrl(normCover)
        setCustomListUrl(normList)
        setPublished(d.post.published)
        editor?.commands.setContent(d.post.content || "")
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the post."))
  }, [id, editor])

  async function uploadImage(file: File, target: "cover" | "list") {
    setUploading(target)
    setError(null)
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
        throw new Error(t || "Upload failed. Try a different image or paste URL below.")
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
      } else throw new Error("Upload returned no URL.")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. You can paste a direct image URL.")
    } finally {
      setUploading(false)
    }
  }

  async function save(publish?: boolean) {
    if (!editor) return
    if (!title.trim()) {
      setError("Give the post a title first.")
      return
    }
    const html = editor.getHTML()
    if (!html || html === "<p></p>" || html.trim().length < 10) {
      setError("Add some content before saving.")
      return
    }
    setBusy(true)
    setError(null)
    const body: Record<string, unknown> = {
      title: title.trim(),
      content: html,
      excerpt: excerpt.trim() || undefined,
      cover_image: cover || undefined,
      list_image: listImage || undefined,
      published: publish ?? published,
    }
    try {
      if (id) {
        await api(`/admin/blog/posts/${id}`, { method: "PUT", body: JSON.stringify(body) })
      } else {
        const d = await api<{ post: { id: string } }>("/admin/blog/posts", { method: "POST", body: JSON.stringify(body) })
        nav(`/admin/journal/${d.post.id}`, { replace: true })
      }
      if (publish !== undefined) setPublished(publish)
      nav("/admin/journal")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad__page ad__page--wide">
      <header className="ad__head ad__head--row">
        <div>
          <Link to="/admin/journal" className="ad-link">← Journal</Link>
          <h1>{id ? "Edit post" : "New post"}</h1>
        </div>
        <div className="ad-actions">
          <button className="ad-btn-plain" disabled={busy || !!uploading} onClick={() => save(false)}>
            Save as draft
          </button>
          <button className="ad-btn" disabled={busy || !!uploading} onClick={() => save(true)}>
            {published ? "Update live post" : "Publish"}
          </button>
        </div>
      </header>
      {error && <p className="ad-error">{error}</p>}

      <section className="ad-card ad-editor">
        <input
          className="ad-editor__title"
          placeholder="Post title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="ad-editor__excerpt"
          placeholder="One-line summary shown in previews (optional)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="ad-editor__cover" style={{ flexDirection: "column", alignItems: "stretch" }}>
            {cover ? <img src={cover} alt="Cover 16:9" style={{ aspectRatio: "16/9", objectFit: "cover" }} /> : <div className="ad-editor__cover-empty" style={{ aspectRatio: "16/9" }}>No cover image<br /><small style={{ opacity: 0.7 }}>16:9 for article hero</small></div>}
            <div className="ad-editor__cover-actions">
              <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "cover")} />
              <button className="ad-btn-plain" disabled={!!uploading} onClick={() => fileInput.current?.click()}>{uploading === "cover" ? "Uploading…" : cover ? "Change cover (16:9)" : "Add cover (16:9)"}</button>
              {cover && <button className="ad-btn-plain ad-danger" onClick={() => { setCover(""); setCustomCoverUrl(""); }}>Remove</button>}
              <input
                type="url"
                placeholder="Or paste direct image URL"
                value={customCoverUrl}
                onChange={(e) => {
                  setCustomCoverUrl(e.target.value)
                  setCover(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "11px", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", marginTop: "4px", background: "#FFFBF0" }}
              />
            </div>
          </div>
          <div className="ad-editor__cover" style={{ flexDirection: "column", alignItems: "stretch" }}>
            {listImage ? <img src={listImage} alt="List 1:1" style={{ aspectRatio: "1", objectFit: "cover" }} /> : <div className="ad-editor__cover-empty" style={{ aspectRatio: "1" }}>No list image<br /><small style={{ opacity: 0.7 }}>1:1 for grid</small></div>}
            <div className="ad-editor__cover-actions">
              <input ref={listInput} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "list")} />
              <button className="ad-btn-plain" disabled={!!uploading} onClick={() => listInput.current?.click()}>{uploading === "list" ? "Uploading…" : listImage ? "Change list (1:1)" : "Add list (1:1)"}</button>
              {listImage && <button className="ad-btn-plain ad-danger" onClick={() => { setListImage(""); setCustomListUrl(""); }}>Remove</button>}
              <input
                type="url"
                placeholder="Or paste direct image URL"
                value={customListUrl}
                onChange={(e) => {
                  setCustomListUrl(e.target.value)
                  setListImage(normalizeImageUrl(e.target.value))
                }}
                style={{ width: "100%", fontSize: "11px", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(26,26,30,0.1)", marginTop: "4px", background: "#FFFBF0" }}
              />
            </div>
          </div>
        </div>
        {editor && (
          <>
            <div className="ad-editor__bar">
              <button type="button" className={editor.isActive("bold") ? "on" : ""} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
              <button type="button" className={editor.isActive("italic") ? "on" : ""} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
              <button type="button" className={editor.isActive("heading", { level: 2 }) ? "on" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
              <button type="button" className={editor.isActive("heading", { level: 3 }) ? "on" : ""} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
              <button type="button" className={editor.isActive("bulletList") ? "on" : ""} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
              <button type="button" className={editor.isActive("blockquote") ? "on" : ""} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
              <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</button>
            </div>
            <EditorContent editor={editor} />
          </>
        )}
        <p className="ad-note">Tip: write like an email — the storefront styles it beautifully.</p>
      </section>
    </div>
  )
}
