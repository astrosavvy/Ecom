import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Clock } from 'lucide-react'
import { fetchBlogPostBySlug, getOptimizedImageUrl } from '../lib/api'
import '../styles/Blog.css'

/**
 * Render inline text supporting:
 * - Markdown links: [Text](URL)
 * - HTML links: <a href="URL">Text</a>
 * - Bold: **Text**
 * - Italic: *Text*
 */
function renderInline(text, keyPrefix = '') {
  if (!text) return null

  const regex = /\[([^\]]+)\]\(([^)]+)\)|<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g

  const nodes = []
  let lastIndex = 0
  let match
  let i = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    if (match[1] && match[2]) {
      // Markdown link: [text](url)
      nodes.push(renderLinkNode(match[1], match[2], `${keyPrefix}-md-${i++}`))
    } else if (match[3] && match[4]) {
      // HTML link: <a href="url">text</a>
      nodes.push(renderLinkNode(match[4], match[3], `${keyPrefix}-html-${i++}`))
    } else if (match[5]) {
      // Bold **text**
      nodes.push(<strong key={`${keyPrefix}-b-${i++}`}>{match[5].slice(2, -2)}</strong>)
    } else if (match[6]) {
      // Italic *text*
      nodes.push(<em key={`${keyPrefix}-em-${i++}`}>{match[6].slice(1, -1)}</em>)
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : text
}

function renderLinkNode(text, url, key) {
  const isInternal = url.startsWith('/') || url.includes('younoya.com')
  const cleanTarget = isInternal ? url.replace(/^https?:\/\/(www\.)?younoya\.com/, '') || '/' : url

  if (isInternal) {
    return (
      <Link key={key} to={cleanTarget} className="article-backlink">
        {text}
      </Link>
    )
  }

  return (
    <a
      key={key}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="article-backlink article-backlink--external"
    >
      {text}
      <ArrowUpRight size={12} className="inline-link-icon" />
    </a>
  )
}

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

  const coverUrl = getOptimizedImageUrl(post.cover_image, post.slug)

  // Format content paragraphs, subheadings, and lists with rich inline links
  const renderFormattedContent = (content) => {
    if (!content) return null

    const blocks = content.split(/\n\s*\n/)

    return blocks.map((block, idx) => {
      const trimmed = block.trim()
      if (!trimmed) return null

      // Subheading level 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx}>
            {renderInline(trimmed.replace(/^##\s+/, ''), `h2-${idx}`)}
          </h2>
        )
      }

      // Subheading level 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx}>
            {renderInline(trimmed.replace(/^###\s+/, ''), `h3-${idx}`)}
          </h3>
        )
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx}>
            {renderInline(trimmed.replace(/^>\s+/, ''), `bq-${idx}`)}
          </blockquote>
        )
      }

      // Bullet lists
      if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- '))
        return (
          <ul key={idx}>
            {items.map((item, itemIdx) => (
              <li key={itemIdx}>
                {renderInline(item.replace(/^-\s+/, ''), `li-${idx}-${itemIdx}`)}
              </li>
            ))}
          </ul>
        )
      }

      // Standard paragraph
      return (
        <p key={idx}>
          {renderInline(trimmed, `p-${idx}`)}
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

        {/* Hero Cover Image (Preserving exact dimensions with optimized WebP) */}
        {coverUrl && (
          <div className="article-cover">
            <img
              src={coverUrl}
              alt={post.title}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        )}

        {/* Article Prose Content with Backlinks */}
        <div className="article-prose">
          {renderFormattedContent(post.content)}
        </div>

        {/* Consultation Callout */}
        <aside className="journal-consult" style={{ marginTop: '48px' }}>
          <h3>
            Begin your personal <em>gifting journey.</em>
          </h3>
          <p>
            Explore our curated keepsake collections or receive an astrological recommendation attuned to your loved one’s birth chart.
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
          <Link to="/shop">
            The Collection <ArrowUpRight size={14} />
          </Link>
        </footer>
      </div>
    </article>
  )
}
