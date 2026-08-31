import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import * as api from "../../lib/api"

export default function JournalArticle() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<api.BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      api.getPost(slug)
        .then(setPost)
        .finally(() => setLoading(false))
    }
  }, [slug])

  if (loading) return <div className="section" style={{ textAlign: "center", padding: "4rem" }}>Loading...</div>
  if (!post) return <div className="section" style={{ textAlign: "center", padding: "4rem" }}>Post not found.</div>

  return (
    <article className="section" style={{ padding: "4rem 1rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/journal" style={{ display: "inline-block", marginBottom: "2rem", color: "var(--color-muted)" }}>&larr; Back to Journal</Link>
      
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 className="text-display" style={{ marginBottom: "1rem" }}>{post.title}</h1>
        <div style={{ color: "var(--color-gold)" }}>
          By {post.author} &bull; {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
        </div>
      </div>

      {post.cover_image && (
        <img src={post.cover_image} alt={post.title} style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "8px", marginBottom: "3rem" }} />
      )}

      <div className="article-body" style={{ lineHeight: "1.8", fontSize: "1.125rem", color: "var(--color-text)" }} dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="personal-banner glass-card" style={{ marginTop: "4rem", padding: "3rem", textAlign: "center" }}>
        <h2 className="personal-banner__title text-h2" style={{ marginBottom: "1rem" }}>Make It Personal</h2>
        <p className="personal-banner__text" style={{ marginBottom: "2rem", color: "var(--color-muted)" }}>Discover objects that resonate with your unique astrological profile and current intentions.</p>
        <Link to="/personalise" className="cta-personal">Build My Toolkit</Link>
      </div>
    </article>
  )
}
