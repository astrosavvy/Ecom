import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import * as api from "../../lib/api"

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState<api.BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPost(slug!).then(setPost).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="page"><p className="page__empty">Unfolding…</p></div>
  if (!post)
    return (
      <div className="page">
        <p className="page__empty">This page of the journal is missing.</p>
        <Link className="btn" to="/blog">Back to the journal</Link>
      </div>
    )

  return (
    <div className="page post">
      <header className="page__head">
        <p className="journey__eyebrow">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "The Journal"}
        </p>
        <h1 className="page__title">{post.title}</h1>
        <p className="page__sub">by {post.author}</p>
      </header>
      <article className="post__body">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </article>
      <div className="explore__actions">
        <Link className="btn btn--ghost" to="/blog">All entries</Link>
        <Link className="btn" to="/journey">Begin the journey</Link>
      </div>
    </div>
  )
}
