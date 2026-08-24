import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as api from "../../lib/api"

export default function Blog() {
  const [posts, setPosts] = useState<api.BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.listPosts().then((r) => setPosts(r.posts)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <header className="page__head">
        <p className="journey__eyebrow">The Journal</p>
        <h1 className="page__title">Notes from the night sky</h1>
      </header>
      {loading ? (
        <p className="page__empty">Lighting the lanterns…</p>
      ) : posts.length === 0 ? (
        <p className="page__empty">No entries yet.</p>
      ) : (
        <div className="blog__list">
          {posts.map((p) => (
            <Link className="blogcard" key={p.id} to={`/blog/${p.slug}`}>
              <span className="blogcard__date">
                {p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
              </span>
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <em>Read →</em>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
