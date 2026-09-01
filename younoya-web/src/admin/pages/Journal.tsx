import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { api, fmtDate } from "../api"

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

const CATEGORIES = [
  "All",
  "Love & Relationships",
  "Becoming & Career",
  "Shelter & Home",
  "Vedic Astrology",
  "Consecration & Rituals",
  "Gifting Guides",
]

export default function Journal() {
  const [posts, setPosts] = useState<Post[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [categoryFilter, setCategoryFilter] = useState("All")

  function loadPosts() {
    setBusy(true)
    api("/admin/blog/posts?limit=50")
      .then((d: any) => {
        setPosts(d.posts ?? [])
        setError(null)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load posts."))
      .finally(() => setBusy(false))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function togglePublish(p: Post) {
    try {
      await api(`/admin/blog/posts/${p.id}`, {
        method: "PUT",
        body: JSON.stringify({ published: !p.published }),
      })
      setSuccessMsg(`"${p.title}" is now ${!p.published ? "Live on Storefront" : "Draft"}.`)
      loadPosts()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status.")
    }
  }

  async function removePost(p: Post) {
    if (!confirm(`Are you sure you want to delete "${p.title}"? This cannot be undone.`)) return
    try {
      await api(`/admin/blog/posts/${p.id}`, { method: "DELETE" })
      setSuccessMsg(`Deleted "${p.title}".`)
      loadPosts()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete post.")
    }
  }

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // Status filter
      if (statusFilter === "published" && !p.published) return false
      if (statusFilter === "draft" && p.published) return false

      // Category filter matching
      if (categoryFilter !== "All") {
        const cat = categoryFilter.toLowerCase()
        const text = `${p.title} ${p.excerpt || ""} ${p.content || ""}`.toLowerCase()
        if (cat.includes("love") && !text.includes("love") && !text.includes("relationship")) return false
        if (cat.includes("becoming") && !text.includes("career") && !text.includes("becoming") && !text.includes("work")) return false
        if (cat.includes("shelter") && !text.includes("home") && !text.includes("shelter") && !text.includes("vastu")) return false
        if (cat.includes("astrology") && !text.includes("astro") && !text.includes("vedic") && !text.includes("star") && !text.includes("dasha")) return false
        if (cat.includes("consecration") && !text.includes("consecrat") && !text.includes("ritual") && !text.includes("108")) return false
        if (cat.includes("gifting") && !text.includes("gift")) return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.author && p.author.toLowerCase().includes(q)) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q))
        if (!matches) return false
      }

      return true
    })
  }, [posts, statusFilter, categoryFilter, searchQuery])

  return (
    <div className="ad__page ad__page--wide" style={{ paddingBottom: "4rem" }}>
      {/* Top Header with + New Article Action */}
      <header className="ad__head ad__head--row" style={{ alignItems: "center", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", margin: "0 0 6px", color: "#1a1a1e", fontWeight: 400 }}>Journal & Stories</h1>
          <p style={{ margin: 0, color: "#6b645c", fontSize: "0.9375rem" }}>
            Publish rituals, keepsakes guides, and astrological chapters to the storefront.
          </p>
        </div>
        <div className="ad-actions" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            to="/admin/journal/new"
            className="ad-btn"
            style={{
              background: "var(--yn-gold, #D4AF37)",
              color: "#07080E",
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: "10px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.875rem",
              boxShadow: "0 4px 14px -4px rgba(212, 175, 55, 0.4)",
            }}
          >
            <span>+</span> Write New Article
          </Link>
        </div>
      </header>

      {/* Status Alerts */}
      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.25)", borderRadius: "10px", color: "#dc2626", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
          {error}
        </div>
      )}
      {successMsg && (
        <div style={{ padding: "12px 16px", background: "rgba(52, 211, 153, 0.12)", border: "1px solid #34d399", borderRadius: "10px", color: "#065f46", marginBottom: "1.25rem", fontSize: "0.875rem", fontWeight: 500 }}>
          ✓ {successMsg}
        </div>
      )}

      {/* Filter and Search Bar Card */}
      <div
        className="ad-card"
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid rgba(26,26,30,0.06)",
        }}
      >
        {/* Search Input */}
        <div style={{ flex: "1", minWidth: "260px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search stories by title, slug, or author…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(26,26,30,0.1)",
              background: "#FFFBF0",
              fontSize: "0.875rem",
              outline: "none",
              color: "#1a1a1e",
            }}
          />
        </div>

        {/* Status Dropdown */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label style={{ fontSize: "0.8125rem", color: "#6b645c", fontWeight: 600 }}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(26,26,30,0.1)",
              background: "#FFFBF0",
              fontSize: "0.8125rem",
              color: "#1a1a1e",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">All ({posts.length})</option>
            <option value="published">Live on Store ({posts.filter((p) => p.published).length})</option>
            <option value="draft">Drafts ({posts.filter((p) => !p.published).length})</option>
          </select>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "1.25rem" }}>
        {CATEGORIES.map((cat) => {
          const active = categoryFilter === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.8125rem",
                fontWeight: active ? 600 : 500,
                border: active ? "1px solid var(--yn-gold, #D4AF37)" : "1px solid rgba(26,26,30,0.08)",
                background: active ? "rgba(212, 175, 55, 0.12)" : "#fff",
                color: active ? "#B8860B" : "#5a534a",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Articles Table Card */}
      <section className="ad-card" style={{ background: "#fff", borderRadius: "16px", padding: "18px 22px", border: "1px solid rgba(26,26,30,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid rgba(26,26,30,0.06)", paddingBottom: "12px" }}>
          <div>
            <h2 style={{ fontSize: "1.125rem", margin: 0, color: "#1a1a1e", fontWeight: 500 }}>
              Stories List ({filteredPosts.length})
            </h2>
          </div>
          <Link
            to="/admin/journal/new"
            style={{ fontSize: "0.8125rem", color: "var(--yn-gold, #D4AF37)", textDecoration: "none", fontWeight: 600 }}
          >
            + New Article →
          </Link>
        </div>

        <table className="ad-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "56px" }}>Media</th>
              <th>Title & URL Slug</th>
              <th>Author</th>
              <th>Created</th>
              <th>Status</th>
              <th className="ad-right" style={{ width: "170px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {busy && posts.length === 0 && (
              <tr>
                <td colSpan={6} className="ad-empty" style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#8a8175" }}>
                  Loading articles…
                </td>
              </tr>
            )}
            {!busy && filteredPosts.length === 0 && (
              <tr>
                <td colSpan={6} className="ad-empty" style={{ padding: "3rem 1rem", textAlign: "center" }}>
                  <p style={{ color: "#6b645c", fontSize: "0.9375rem", margin: "0 0 1rem" }}>
                    {searchQuery || categoryFilter !== "All" || statusFilter !== "all"
                      ? "No articles match the selected filters."
                      : "No articles published yet. Ready to start your journal?"}
                  </p>
                  <Link
                    to="/admin/journal/new"
                    className="ad-btn"
                    style={{
                      background: "var(--yn-gold, #D4AF37)",
                      color: "#07080E",
                      fontWeight: 600,
                      padding: "8px 18px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      display: "inline-block",
                      fontSize: "0.8125rem",
                    }}
                  >
                    + Compose Your First Story
                  </Link>
                </td>
              </tr>
            )}
            {filteredPosts.map((p) => {
              const displayImg = p.list_image || p.cover_image
              return (
                <tr key={p.id}>
                  <td>
                    {displayImg ? (
                      <img
                        src={normalizeImageUrl(displayImg)}
                        alt=""
                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: "1px solid rgba(26,26,30,0.08)" }}
                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "8px",
                          background: "#FFFBF0",
                          border: "1px dashed rgba(26,26,30,0.15)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "14px",
                          color: "#8a8175",
                        }}
                      >
                        ✎
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ display: "block", color: "#1a1a1e", fontSize: "0.9375rem" }}>
                      {p.title}
                    </strong>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "2px" }}>
                      <code style={{ fontSize: "0.75rem", color: "#8a8175", background: "rgba(26,26,30,0.04)", padding: "1px 6px", borderRadius: "4px" }}>
                        /{p.slug}
                      </code>
                      {p.published && (
                        <a
                          href={`https://younoya.com/journal/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: "0.75rem", color: "var(--yn-gold, #D4AF37)", textDecoration: "underline" }}
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: "0.8125rem", color: "#5a534a" }}>
                    {p.author || "YOUNOYA"}
                  </td>
                  <td style={{ fontSize: "0.8125rem", color: "#5a534a" }}>
                    {fmtDate(p.created_at)}
                  </td>
                  <td>
                    <span className={`ad-chip ad-chip--${p.published ? "ok" : "wait"}`}>
                      {p.published ? "● Live" : "○ Draft"}
                    </span>
                  </td>
                  <td className="ad-right">
                    <div className="ad-actions" style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <Link
                        to={`/admin/journal/${p.id}`}
                        className="ad-btn-plain"
                        style={{ textDecoration: "none", fontSize: "0.75rem", padding: "5px 10px" }}
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="ad-btn-plain"
                        onClick={() => togglePublish(p)}
                        style={{ fontSize: "0.75rem", padding: "5px 10px" }}
                      >
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        className="ad-btn-plain ad-danger"
                        onClick={() => removePost(p)}
                        style={{ fontSize: "0.75rem", padding: "5px 8px" }}
                        title="Delete story"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
