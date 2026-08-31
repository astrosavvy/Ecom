import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api, fmtDate } from "../api"

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  published: boolean
  published_at?: string | null
  author: string
  created_at: string
}

export default function Journal() {
  const [posts, setPosts] = useState<Post[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function load() {
    setBusy(true)
    api("/admin/blog/posts?limit=50")
      .then((d: any) => setPosts(d.posts ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load posts."))
      .finally(() => setBusy(false))
  }
  useEffect(load, [])

  async function toggle(p: Post) {
    await api(`/admin/blog/posts/${p.id}`, { method: "PUT", body: JSON.stringify({ published: !p.published }) })
    load()
  }

  async function remove(p: Post) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    await api(`/admin/blog/posts/${p.id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="ad__page">
      <header className="ad__head ad__head--row">
        <div>
          <h1>Journal</h1>
          <p>Stories, rituals and gifting guides for the storefront.</p>
        </div>
        <Link to="/admin/journal/new" className="ad-btn">+ New post</Link>
      </header>
      {error && <p className="ad-error">{error}</p>}
      <section className="ad-card">
        <table className="ad-table">
          <thead><tr><th>Title</th><th>Created</th><th>Status</th><th className="ad-right">Actions</th></tr></thead>
          <tbody>
            {busy && posts.length === 0 && <tr><td colSpan={4} className="ad-empty">Loading…</td></tr>}
            {!busy && posts.length === 0 && <tr><td colSpan={4} className="ad-empty">No posts yet — write the first one.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link to={`/admin/journal/${p.id}`} className="ad-link">{p.title}</Link></td>
                <td>{fmtDate(p.created_at)}</td>
                <td><span className={`ad-chip ad-chip--${p.published ? "ok" : "wait"}`}>{p.published ? "Live" : "Draft"}</span></td>
                <td className="ad-right">
                  <div className="ad-actions">
                    <button className="ad-btn-plain" onClick={() => toggle(p)}>{p.published ? "Unpublish" : "Publish"}</button>
                    <button className="ad-btn-plain ad-danger" onClick={() => remove(p)}>Delete</button>
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
