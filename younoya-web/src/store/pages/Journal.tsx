import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import * as api from "../../lib/api"

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
  const { category } = useParams<{ category?: string }>()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<api.BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.listPosts(24, 0)
      .then((res) => {
        const publishedPosts = (res.posts || []).filter((p: any) => p.published !== false)
        if (!category || category.toLowerCase() === "all") {
          setPosts(publishedPosts)
        } else {
          const cat = category.toLowerCase()
          const filtered = publishedPosts.filter((p) => {
            const text = `${p.title} ${p.excerpt || ""} ${p.content || ""}`.toLowerCase()
            if (cat.includes("love") && (text.includes("love") || text.includes("relationship"))) return true
            if (cat.includes("becoming") && (text.includes("career") || text.includes("becoming") || text.includes("growth"))) return true
            if (cat.includes("shelter") && (text.includes("shelter") || text.includes("home") || text.includes("vastu"))) return true
            if (cat.includes("astrology") && (text.includes("astro") || text.includes("vedic") || text.includes("star") || text.includes("dasha") || text.includes("nakshatra"))) return true
            if (cat.includes("consecration") && (text.includes("consecrat") || text.includes("ritual") || text.includes("108"))) return true
            if (cat.includes("gifting") && text.includes("gift")) return true
            return false
          })
          setPosts(filtered)
        }
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div style={{ background: "#FFFBF0", minHeight: "85vh", padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 64px) 100px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        {/* Editorial Header */}
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 56px)", maxWidth: "720px", margin: "0 auto clamp(32px, 5vw, 56px)" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--yn-font-label, 'Manrope', sans-serif)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B8860B",
              marginBottom: "12px",
            }}
          >
            The Chronicles & Rituals
          </span>
          <h1
            style={{
              fontFamily: "var(--yn-font-display, 'Outfit', serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 350,
              color: "#1a1a1e",
              lineHeight: 1.12,
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            Journal for every chapter
          </h1>
          <p
            style={{
              fontFamily: "var(--yn-font-body, 'Inter', sans-serif)",
              fontSize: "clamp(15px, 2vw, 17px)",
              color: "#6b645c",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Reflections on sacred astrology, keepsake consecration, dasha cycles, and intentional living.
          </p>
        </header>

        {/* Category Pills Strip */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            paddingBottom: "14px",
            marginBottom: "clamp(32px, 4vw, 48px)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {CATEGORIES.map((c) => {
            const isCatActive = category
              ? category.toLowerCase() === c.toLowerCase() ||
                (c.toLowerCase().includes("love") && category.toLowerCase().includes("love")) ||
                (c.toLowerCase().includes("becoming") && category.toLowerCase().includes("becoming")) ||
                (c.toLowerCase().includes("shelter") && category.toLowerCase().includes("shelter")) ||
                (c.toLowerCase().includes("astrology") && category.toLowerCase().includes("astrology")) ||
                (c.toLowerCase().includes("consecration") && category.toLowerCase().includes("consecration")) ||
                (c.toLowerCase().includes("gifting") && category.toLowerCase().includes("gifting"))
              : c === "All"

            return (
              <button
                key={c}
                type="button"
                onClick={() => navigate(c === "All" ? "/journal" : `/journal/category/${encodeURIComponent(c.toLowerCase())}`)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  fontFamily: "var(--yn-font-label, 'Manrope', sans-serif)",
                  fontSize: "12px",
                  fontWeight: isCatActive ? 700 : 500,
                  letterSpacing: "0.04em",
                  border: isCatActive ? "1px solid #D4AF37" : "1px solid rgba(26,26,30,0.08)",
                  background: isCatActive ? "rgba(212,175,55,0.16)" : "#ffffff",
                  color: isCatActive ? "#1a1a1e" : "#5a534a",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  boxShadow: isCatActive ? "0 2px 8px rgba(212,175,55,0.2)" : "0 1px 4px rgba(0,0,0,0.02)",
                }}
              >
                {c}
              </button>
            )
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "#6b645c", fontFamily: "var(--yn-font-body, Inter, sans-serif)", fontSize: "16px" }}>
            Unfolding the chronicles…
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 1rem", background: "#ffffff", borderRadius: "20px", border: "1px solid rgba(26,26,30,0.06)", maxWidth: "560px", margin: "0 auto" }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: "12px" }}>✧</span>
            <h3 style={{ fontFamily: "var(--yn-font-display, Outfit, serif)", fontSize: "22px", color: "#1a1a1e", margin: "0 0 8px", fontWeight: 500 }}>
              No chronicles found in this chapter
            </h3>
            <p style={{ color: "#6b645c", fontSize: "14px", margin: "0 0 20px" }}>
              Explore other chapters or return to all stories.
            </p>
            <Link
              to="/journal"
              style={{
                display: "inline-block",
                background: "var(--yn-gold, #D4AF37)",
                color: "#07080E",
                padding: "10px 22px",
                borderRadius: "999px",
                fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              View All Chapters
            </Link>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && posts.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "32px",
            }}
          >
            {posts.map((post) => {
              const imageSrc = post.cover_image || post.list_image
              const normalizedImg = imageSrc ? normalizeImageUrl(imageSrc) : null

              return (
                <Link
                  to={`/journal/${post.slug}`}
                  key={post.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    textDecoration: "none",
                    border: "1px solid rgba(26,26,30,0.06)",
                    boxShadow: "0 4px 20px -8px rgba(0,0,0,0.06)",
                    transition: "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 16px 36px -12px rgba(212,175,55,0.25)"
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.35)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 20px -8px rgba(0,0,0,0.06)"
                    e.currentTarget.style.borderColor = "rgba(26,26,30,0.06)"
                  }}
                >
                  {/* Article Thumbnail / Cover */}
                  {normalizedImg ? (
                    <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#fef9ec", position: "relative" }}>
                      <img
                        src={normalizedImg}
                        alt={post.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        onError={(e) => {
                          (e.currentTarget.parentElement as HTMLElement).style.display = "none"
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        background: "linear-gradient(135deg, #FFF8E8 0%, #F5EDE0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "1px solid rgba(212,175,55,0.15)",
                        position: "relative",
                      }}
                    >
                      <div style={{ textAlign: "center", padding: "1rem" }}>
                        <span style={{ fontFamily: "var(--yn-font-display, serif)", fontSize: "2rem", color: "var(--yn-gold, #D4AF37)", opacity: 0.85, display: "block" }}>
                          YU
                        </span>
                        <span style={{ fontFamily: "var(--yn-font-label, sans-serif)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8a8175" }}>
                          YOUNOYA ATELIER
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Article Card Content */}
                  <div style={{ padding: "24px 24px 26px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Meta: Author & Date */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span style={{ color: "#B8860B" }}>
                        {post.author || "YOUNOYA Atelier"}
                      </span>
                      <span style={{ color: "#8a8175", textTransform: "none", fontSize: "12px" }}>
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : ""}
                      </span>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontFamily: "var(--yn-font-display, Outfit, serif)",
                        fontSize: "1.35rem",
                        fontWeight: 500,
                        color: "#1a1a1e",
                        lineHeight: 1.3,
                        margin: "0 0 10px",
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p
                        style={{
                          fontFamily: "var(--yn-font-body, Inter, sans-serif)",
                          fontSize: "0.9375rem",
                          color: "#5a534a",
                          lineHeight: 1.6,
                          margin: "0 0 16px",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read Chronicle CTA */}
                    <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid rgba(26,26,30,0.05)" }}>
                      <span
                        style={{
                          fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--yn-gold, #D4AF37)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        Read Chronicle <span style={{ fontSize: "14px" }}>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
