import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles, Clock, Calendar, ShieldCheck } from 'lucide-react'
import { fetchBlogPostBySlug } from '../lib/api'
import { PRODUCTS } from '../data/products'
import '../styles/Blog.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    if (slug) {
      setLoading(true)
      fetchBlogPostBySlug(slug).then((res) => {
        if (isMounted) {
          setPost(res)
          setLoading(false)
        }
      })
    }
    return () => {
      isMounted = false
    }
  }, [slug])

  // Select 3 authentic keepsakes to feature alongside the article
  const relatedKeepsakes = [
    PRODUCTS.find((p) => p.handle === 'love-connection') || PRODUCTS[0],
    PRODUCTS.find((p) => p.handle === 'vitality-inner-balance') || PRODUCTS[1],
    PRODUCTS.find((p) => p.handle === 'confidence-personal-power') || PRODUCTS[2],
  ].filter(Boolean)

  if (loading) {
    return (
      <section className="article-page">
        <div className="article-container" style={{ textAlign: 'center', padding: '120px 0' }}>
          <p style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.12em', color: 'rgba(8,11,20,0.5)' }}>
            Unfolding the celestial chapter...
          </p>
        </div>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="article-page">
        <div className="article-container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', marginBottom: '16px' }}>
            Chapter Not Found
          </h1>
          <p style={{ color: 'rgba(8,11,20,0.6)', marginBottom: '32px' }}>
            The story you are seeking has either moved or belongs to a different celestial sphere.
          </p>
          <Link to="/blog" className="journal-consult__btn">
            ← Return to the Journal
          </Link>
        </div>
      </section>
    )
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'September 2026'

  // Format content paragraphs and subheadings
  const renderFormattedContent = (content) => {
    if (!content) return null

    // Split paragraphs by double newline
    const blocks = content.split(/\n\s*\n/)

    return blocks.map((block, idx) => {
      const trimmed = block.trim()
      if (!trimmed) return null

      // Subheading level 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx}>
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        )
      }

      // Subheading level 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx}>
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        )
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx}>
            {trimmed.replace(/^>\s+/, '')}
          </blockquote>
        )
      }

      // Bullet lists
      if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- '))
        return (
          <ul key={idx}>
            {items.map((item, itemIdx) => {
              const text = item.replace(/^-\s+/, '')
              // Handle bold format **text**
              const parts = text.split(/(\*\*[^*]+\*\*)/)
              return (
                <li key={itemIdx}>
                  {parts.map((part, pIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={pIdx}>{part.slice(2, -2)}</strong>
                    }
                    return part
                  })}
                </li>
              )
            })}
          </ul>
        )
      }

      // Standard paragraph with bold formatting
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/)
      return (
        <p key={idx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    })
  }

  return (
    <article className="article-page">
      <div className="article-container">
        {/* Back Link */}
        <Link to="/blog" className="article-back-link">
          <ArrowLeft size={15} /> Return to Journal
        </Link>

        {/* Article Header */}
        <header className="article-header">
          <span className="article-header__category">
            {post.category || 'Astrology & Rituals'}
          </span>
          <h1 className="article-header__title">{post.title}</h1>
          <div className="article-header__meta">
            <span>By {post.author || 'YOUNOYA Atelier'}</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> {publishedDate}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {post.readTime || '5 min read'}
            </span>
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.cover_image && (
          <div className="article-cover">
            <img src={post.cover_image} alt={post.title} fetchPriority="high" />
          </div>
        )}

        {/* Article Prose Content */}
        <div className="article-prose">
          {renderFormattedContent(post.content)}
        </div>

        {/* Keepsakes for this Chapter */}
        <section className="article-keepsakes" aria-labelledby="keepsakes-title">
          <div className="article-keepsakes__head">
            <span className="article-keepsakes__eyebrow">
              <Sparkles size={12} /> SACRED ALIGNMENTS
            </span>
            <h2 id="keepsakes-title" className="article-keepsakes__title">
              Keepsakes for this Chapter
            </h2>
          </div>

          <div className="article-keepsakes__grid">
            {relatedKeepsakes.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.handle}`}
                className="article-keepsake-card"
                aria-label={`Explore keepsake ${product.name}`}
              >
                <div className="article-keepsake-card__img">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>
                <div className="article-keepsake-card__info">
                  <h3 className="article-keepsake-card__name">{product.name}</h3>
                  <span className="article-keepsake-card__price">{product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Consultation Callout */}
        <aside className="journal-consult" style={{ marginTop: '48px' }}>
          <h3>
            Begin your personal <em>gifting journey.</em>
          </h3>
          <p>
            Explore our curated sanctum collections or receive an astrological recommendation attuned to your loved one’s birth chart.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/find-a-gift" className="journal-consult__btn">
              Let Younoya Choose <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="journal-consult__btn"
              style={{ background: 'transparent', color: '#FAF6EE', border: '1px solid rgba(214,176,106,0.6)' }}
            >
              Explore Full Collection <ArrowUpRight size={15} />
            </Link>
          </div>
        </aside>

        {/* Footer Navigation */}
        <footer className="journal-footer-links" style={{ marginTop: '40px' }}>
          <Link to="/blog">
            <ArrowLeft size={14} /> Back to all stories
          </Link>
          <Link to="/">
            Return to Boutique Story <ArrowUpRight size={14} />
          </Link>
        </footer>
      </div>
    </article>
  )
}
