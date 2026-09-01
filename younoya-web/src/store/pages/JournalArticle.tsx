import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
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

export default function JournalArticle() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<api.BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      setLoading(true)
      api.getPost(slug)
        .then(setPost)
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading) {
    return (
      <div style={{ background: "#FFFBF0", minHeight: "80vh", display: "grid", placeItems: "center", padding: "4rem 1rem" }}>
        <p style={{ color: "#6b645c", fontFamily: "var(--yn-font-body, Inter, sans-serif)", fontSize: "16px" }}>
          Unfolding the chronicle…
        </p>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ background: "#FFFBF0", minHeight: "80vh", display: "grid", placeItems: "center", padding: "4rem 1rem", textAlign: "center" }}>
        <div style={{ maxWidth: "480px", background: "#fff", padding: "40px 32px", borderRadius: "20px", border: "1px solid rgba(26,26,30,0.06)" }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "12px" }}>✧</span>
          <h2 style={{ fontFamily: "var(--yn-font-display, Outfit, serif)", fontSize: "24px", color: "#1a1a1e", margin: "0 0 10px", fontWeight: 500 }}>
            Chronicle Not Found
          </h2>
          <p style={{ color: "#6b645c", fontSize: "14px", margin: "0 0 24px", lineHeight: 1.6 }}>
            The story you are seeking may have moved or is awaiting its next astrological window.
          </p>
          <Link
            to="/journal"
            style={{
              display: "inline-block",
              background: "var(--yn-gold, #D4AF37)",
              color: "#07080E",
              padding: "10px 24px",
              borderRadius: "999px",
              fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            ← Return to Journal
          </Link>
        </div>
      </div>
    )
  }

  const heroImage = post.cover_image || post.list_image
  const normalizedHero = heroImage ? normalizeImageUrl(heroImage) : null

  return (
    <div style={{ background: "#FFFBF0", minHeight: "85vh", padding: "clamp(36px, 5vw, 64px) clamp(20px, 4vw, 40px) 120px" }}>
      <article style={{ maxWidth: "820px", margin: "0 auto" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "clamp(24px, 4vw, 36px)" }}>
          <Link
            to="/journal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6b645c",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "#ffffff",
              border: "1px solid rgba(26,26,30,0.08)",
              transition: "all 0.2s ease",
            }}
          >
            ← Back to Journal
          </Link>
        </div>

        {/* Article Header */}
        <header style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B8860B",
              marginBottom: "12px",
            }}
          >
            YOUNOYA Journal · Sacred Keepsakes
          </span>
          <h1
            style={{
              fontFamily: "var(--yn-font-display, Outfit, serif)",
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 350,
              color: "#1a1a1e",
              lineHeight: 1.15,
              margin: "0 0 20px",
              letterSpacing: "-0.01em",
            }}
          >
            {post.title}
          </h1>
          <div
            style={{
              fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
              fontSize: "13px",
              color: "#6b645c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <span>By <strong style={{ color: "#1a1a1e", fontWeight: 600 }}>{post.author || "YOUNOYA Atelier"}</strong></span>
            <span>•</span>
            <span>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                : ""}
            </span>
          </div>
        </header>

        {/* Hero Cover Image */}
        {normalizedHero && (
          <div style={{ marginBottom: "clamp(36px, 5vw, 56px)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 30px -12px rgba(0,0,0,0.12)", border: "1px solid rgba(26,26,30,0.06)" }}>
            <img
              src={normalizedHero}
              alt={post.title}
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Article Excerpt / Lead */}
        {post.excerpt && (
          <div
            style={{
              fontFamily: "var(--yn-font-display, Outfit, serif)",
              fontSize: "clamp(18px, 2.5vw, 22px)",
              lineHeight: 1.6,
              color: "#4a443c",
              fontStyle: "italic",
              marginBottom: "36px",
              paddingBottom: "24px",
              borderBottom: "1px solid rgba(212,175,55,0.25)",
            }}
          >
            {post.excerpt}
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="yn-journal-article-body"
          style={{
            fontFamily: "var(--yn-font-body, Inter, sans-serif)",
            fontSize: "1.125rem",
            lineHeight: 1.85,
            color: "#2c2824",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom Personalisation Banner */}
        <section
          style={{
            marginTop: "clamp(48px, 6vw, 72px)",
            padding: "clamp(36px, 5vw, 54px) clamp(24px, 4vw, 48px)",
            background: "#ffffff",
            borderRadius: "24px",
            border: "1px solid rgba(212,175,55,0.28)",
            boxShadow: "0 12px 40px -16px rgba(212,175,55,0.18)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#B8860B",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Tailored To Your Stars
          </span>
          <h2
            style={{
              fontFamily: "var(--yn-font-display, Outfit, serif)",
              fontSize: "clamp(26px, 4vw, 36px)",
              color: "#1a1a1e",
              fontWeight: 400,
              margin: "0 0 12px",
            }}
          >
            Make It Personal
          </h2>
          <p
            style={{
              fontFamily: "var(--yn-font-body, Inter, sans-serif)",
              fontSize: "15px",
              color: "#5a534a",
              maxWidth: "520px",
              margin: "0 auto 28px",
              lineHeight: 1.65,
            }}
          >
            Discover consecrated keepsakes tailored around your moon sign, nakshatra, and sacred intentions.
          </p>
          <Link
            to="/personalise"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--yn-gold, #D4AF37)",
              color: "#07080E",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "999px",
              textDecoration: "none",
              fontFamily: "var(--yn-font-label, Manrope, sans-serif)",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              boxShadow: "0 4px 20px -4px rgba(212, 175, 55, 0.5)",
            }}
          >
            Begin your chart →
          </Link>
        </section>
      </article>
    </div>
  )
}
