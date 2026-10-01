import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Plus,
  Search,
  LayoutGrid,
  List as ListIcon,
  ExternalLink,
  Edit3,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Clock,
  Sparkles,
  Tag,
} from "lucide-react"
import { api, fmtDate } from "../api"
import "../styles/SanityJournal.css"

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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

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

  const publishedCount = useMemo(() => posts.filter((p) => p.published).length, [posts])
  const draftCount = useMemo(() => posts.filter((p) => !p.published).length, [posts])

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
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "5rem" }}>
      {/* ── Sanity Studio Desk Header ── */}
      <header className="sanity-desk-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ad-gold-strong)" }}>
              YOUNOYA Studio
            </span>
            <span style={{ color: "var(--ad-border)" }}>/</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ad-ink-soft)" }}>Journal Desk</span>
          </div>
          <h1>Journal & Stories</h1>
          <p>Publish rituals, astrological chapters, and intentional gifting guides to the storefront.</p>
        </div>

        <Link
          to="/admin/journal/new"
          className="sanity-btn-primary"
          style={{ padding: "10px 22px", fontSize: "14px", textDecoration: "none" }}
        >
          <Plus size={16} /> Create Story
        </Link>
      </header>

      {/* ── Studio KPI Metrics Ribbon ── */}
      <div className="sanity-metrics-grid">
        <div className="sanity-metric-card">
          <span>Total Stories</span>
          <strong>{posts.length}</strong>
        </div>
        <div className="sanity-metric-card">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
            Live on Storefront
          </span>
          <strong style={{ color: "#065F46" }}>{publishedCount}</strong>
        </div>
        <div className="sanity-metric-card">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#F59E0B" }} />
            Drafts in Progress
          </span>
          <strong style={{ color: "#92400E" }}>{draftCount}</strong>
        </div>
        <div className="sanity-metric-card">
          <span>Editorial Chapters</span>
          <strong>6 Chapters</strong>
        </div>
      </div>

      {/* Status Alerts */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "var(--ad-rose-bg)", border: "1px solid var(--ad-rose)", borderRadius: "10px", color: "var(--ad-rose)", marginBottom: "1.25rem", fontSize: "13px" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {successMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "var(--ad-sage-bg)", border: "1px solid var(--ad-sage)", borderRadius: "10px", color: "var(--ad-sage)", marginBottom: "1.25rem", fontSize: "13px", fontWeight: 500 }}>
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* ── Filter & Search Bar (Sanity Studio style) ── */}
      <div className="sanity-filter-bar">
        {/* Search Input */}
        <div className="sanity-search-wrap">
          <Search size={14} color="var(--ad-ink-soft)" />
          <input
            type="text"
            placeholder="Search stories by title, slug, or excerpt…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Tabs */}
        <div className="sanity-status-tabs">
          <button
            type="button"
            className={`sanity-status-tab ${statusFilter === "all" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All ({posts.length})
          </button>
          <button
            type="button"
            className={`sanity-status-tab ${statusFilter === "published" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("published")}
          >
            Live ({publishedCount})
          </button>
          <button
            type="button"
            className={`sanity-status-tab ${statusFilter === "draft" ? "is-active" : ""}`}
            onClick={() => setStatusFilter("draft")}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--ad-border)",
            background: "#FFFFFF",
            fontSize: "12px",
            color: "var(--ad-ink)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {CATEGORIES.map((cat) => (
            <option value={cat} key={cat}>
              {cat === "All" ? "All Chapters" : cat}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="sanity-view-tabs">
          <button
            type="button"
            className={`sanity-view-tab ${viewMode === "grid" ? "is-active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Sanity Document Cards"
          >
            <LayoutGrid size={13} /> Grid
          </button>
          <button
            type="button"
            className={`sanity-view-tab ${viewMode === "table" ? "is-active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Desk Table"
          >
            <ListIcon size={13} /> Table
          </button>
        </div>
      </div>

      {/* ── Document List Rendering ── */}
      {busy && posts.length === 0 ? (
        <div style={{ padding: "4rem 1rem", textAlign: "center", color: "var(--ad-ink-soft)" }}>
          <p>Loading studio documents…</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="sanity-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <BookOpen size={36} color="var(--ad-gold)" style={{ opacity: 0.8, marginBottom: 12 }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--ad-ink)", margin: "0 0 6px" }}>
            {searchQuery || categoryFilter !== "All" || statusFilter !== "all"
              ? "No stories match your current filters."
              : "No stories published yet."}
          </h3>
          <p style={{ color: "var(--ad-ink-soft)", fontSize: "14px", margin: "0 0 20px" }}>
            {searchQuery || categoryFilter !== "All" || statusFilter !== "all"
              ? "Try clearing your search query or changing chapter filters."
              : "Start composing your first chapter, ritual, or keepsake guide."}
          </p>
          <Link
            to="/admin/journal/new"
            className="sanity-btn-primary"
            style={{ textDecoration: "none", padding: "10px 22px" }}
          >
            <Plus size={14} /> Create First Story
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* ── Grid View: Sanity Document Cards ── */
        <div className="sanity-doc-grid">
          {filteredPosts.map((p) => {
            const displayImg = p.cover_image || p.list_image
            return (
              <div className="sanity-doc-card" key={p.id}>
                <div className="sanity-doc-card__media">
                  {displayImg ? (
                    <img src={normalizeImageUrl(displayImg)} alt="" loading="lazy" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--ad-ink-soft)" }}>
                      <FileText size={24} style={{ opacity: 0.4 }} />
                    </div>
                  )}

                  <div style={{ position: "absolute", top: 10, left: 10 }}>
                    <span className={`sanity-bar__status-pill ${p.published ? "published" : "draft"}`}>
                      <span className="sanity-bar__dot" />
                      {p.published ? "Live" : "Draft"}
                    </span>
                  </div>

                  {p.published && (
                    <a
                      href={`https://younoya.com/journal/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "rgba(31, 25, 22, 0.75)",
                        backdropFilter: "blur(4px)",
                        color: "#FFFFFF",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        textDecoration: "none",
                      }}
                    >
                      View Live <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <div className="sanity-doc-card__body">
                  <h3 className="sanity-doc-card__title">
                    <Link to={`/admin/journal/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {p.title}
                    </Link>
                  </h3>

                  <span className="sanity-doc-card__slug">
                    /{p.slug}
                  </span>

                  <p className="sanity-doc-card__excerpt">
                    {p.excerpt || "No excerpt provided for this chapter..."}
                  </p>

                  <div className="sanity-doc-card__foot">
                    <span>{fmtDate(p.created_at)}</span>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => togglePublish(p)}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: "12px",
                          color: p.published ? "var(--ad-ink-soft)" : "var(--ad-gold-strong)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {p.published ? "Unpublish" : "Publish"}
                      </button>

                      <Link
                        to={`/admin/journal/${p.id}`}
                        className="sanity-btn-ghost"
                        style={{ padding: "4px 10px", fontSize: "11px", textDecoration: "none" }}
                      >
                        <Edit3 size={11} /> Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => removePost(p)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--ad-rose)",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        title="Delete story"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── Table View: Sanity Desk Table ── */
        <div className="sanity-card" style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "var(--ad-sidebar-bg)", borderBottom: "1px solid var(--ad-border)", textAlign: "left" }}>
                <th style={{ width: 52, padding: "12px 14px", color: "var(--ad-ink-soft)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Media</th>
                <th style={{ padding: "12px 14px", color: "var(--ad-ink-soft)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Title & URL Slug</th>
                <th style={{ padding: "12px 14px", color: "var(--ad-ink-soft)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Author</th>
                <th style={{ padding: "12px 14px", color: "var(--ad-ink-soft)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</th>
                <th style={{ padding: "12px 14px", color: "var(--ad-ink-soft)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</th>
                <th style={{ padding: "12px 14px", color: "var(--ad-ink-soft)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((p) => {
                const displayImg = p.list_image || p.cover_image
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--ad-border)" }}>
                    <td style={{ padding: "12px 14px" }}>
                      {displayImg ? (
                        <img
                          src={normalizeImageUrl(displayImg)}
                          alt=""
                          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid var(--ad-border)" }}
                        />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--ad-bg)", border: "1px dashed var(--ad-border)", display: "grid", placeItems: "center", color: "var(--ad-ink-soft)" }}>
                          <FileText size={16} />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Link to={`/admin/journal/${p.id}`} style={{ fontWeight: 600, color: "var(--ad-ink)", textDecoration: "none", fontSize: "14px" }}>
                        {p.title}
                      </Link>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                        <code style={{ fontSize: "11px", color: "var(--ad-ink-soft)", background: "var(--ad-bg)", padding: "2px 6px", borderRadius: 4 }}>
                          /{p.slug}
                        </code>
                        {p.published && (
                          <a
                            href={`https://younoya.com/journal/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: "11px", color: "var(--ad-gold-strong)", textDecoration: "none" }}
                          >
                            View Live ↗
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--ad-ink-soft)" }}>
                      {p.author || "YOUNOYA"}
                    </td>
                    <td style={{ padding: "12px 14px", color: "var(--ad-ink-soft)" }}>
                      {fmtDate(p.created_at)}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span className={`sanity-bar__status-pill ${p.published ? "published" : "draft"}`}>
                        <span className="sanity-bar__dot" />
                        {p.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Link
                          to={`/admin/journal/${p.id}`}
                          className="sanity-btn-ghost"
                          style={{ padding: "6px 12px", fontSize: "12px", textDecoration: "none" }}
                        >
                          <Edit3 size={12} /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => togglePublish(p)}
                          className="sanity-btn-ghost"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          {p.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removePost(p)}
                          style={{
                            background: "var(--ad-rose-bg)",
                            border: "1px solid var(--ad-rose)",
                            color: "var(--ad-rose)",
                            borderRadius: 8,
                            padding: "6px 10px",
                            cursor: "pointer",
                          }}
                          title="Delete story"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
