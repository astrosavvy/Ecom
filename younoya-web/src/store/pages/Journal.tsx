import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router"
import * as api from "../../lib/api"

const CATEGORIES = ["All", "Relationships", "Career", "Finance", "Wellbeing", "Home & Vastu", "Gifting", "Astrology", "Lifestyle", "Personal Growth"]

export default function Journal() {
  const { category } = useParams<{ category?: string }>()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<api.BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.listPosts(12, 0)
      .then(res => {
        // MOCK filtering since backend endpoint doesn't support category filtering directly here
        const filtered = category && category.toLowerCase() !== "all" 
          ? res.posts.filter(() => true) // If category existed in metadata, we'd filter here
          : res.posts
        setPosts(filtered)
      })
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="section" style={{ minHeight: "80vh", padding: "4rem 1rem" }}>
      <h1 className="text-display" style={{ textAlign: "center", marginBottom: "2rem" }}>Journal</h1>
      
      <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "3rem", justifyContent: "center", flexWrap: "wrap" }}>
        {CATEGORIES.map(c => {
          const isActive = category ? category.toLowerCase() === c.toLowerCase() : c === "All"
          return (
            <button 
              key={c}
              onClick={() => navigate(c === "All" ? "/journal" : `/journal/category/${c.toLowerCase()}`)}
              className="cta-ghost"
              style={{ borderBottom: isActive ? "2px solid var(--color-gold)" : "none", borderRadius: 0 }}
            >
              {c}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center" }}>No posts found.</div>
      ) : (
        <div className="journal-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {posts.map(post => (
            <Link to={`/journal/${post.slug}`} key={post.id} className="journal-card glass-card">
              {(post.list_image || post.cover_image) && <img src={post.list_image || post.cover_image || ""} alt={post.title} className="journal-card__image" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />}
              <div style={{ padding: "1.5rem" }}>
                <div className="journal-card__meta" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "var(--color-muted)", fontSize: "0.875rem" }}>
                  <span className="journal-card__category">{post.author}</span>
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}</span>
                </div>
                <h2 className="journal-card__title text-h2" style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>{post.title}</h2>
                <p className="journal-card__excerpt" style={{ color: "var(--color-muted)" }}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
