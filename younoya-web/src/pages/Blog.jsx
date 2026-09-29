import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkles, Calendar, Clock } from 'lucide-react'
import { fetchBlogPosts, getOptimizedImageUrl } from '../lib/api'
import '../styles/Blog.css'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    let isMounted = true
    fetchBlogPosts().then((res) => {
      if (isMounted) {
        setPosts(res.posts || [])
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Derive categories dynamically from available posts to prevent empty dead-ends
  const availableCategories = useMemo(() => {
    const cats = new Set(['All'])
    posts.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats)
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return posts
    return posts.filter((p) => (p.category || 'Astrology & Rituals') === activeCategory)
  }, [posts, activeCategory])

  const featuredPost = filteredPosts[0]
  const remainingPosts = filteredPosts.slice(1)

  return (
    <section className="journal-page">
      <div className="journal-container">
        {/* Streamlined Editorial Header */}
        <header className="journal-header">
          <span className="journal-header__eyebrow">
            <Sparkles size={13} /> YOUNOYA ATELIER
          </span>
          <h1 className="journal-header__title">
            The Journal
          </h1>
          <p className="journal-header__subtitle">
            Reflections on intentional gifting, sacred alignments, and the craftsmanship of consecrated keepsakes.
          </p>
        </header>

        {/* Dynamic Category Filter Pills */}
        {availableCategories.length > 1 && (
          <div className="journal-filters" role="group" aria-label="Filter journal articles by category">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`journal-filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(8,11,20,0.5)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
            Consulting the celestial archives...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(8,11,20,0.6)' }}>
            <p>New stories for this category are being prepared.</p>
          </div>
        ) : (
          <>
            {/* Primary Featured Story */}
            {featuredPost && (
              <motion.article
                className="journal-lead"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="journal-lead__card"
                  aria-label={`Read featured story: ${featuredPost.title}`}
                >
                  <div className="journal-lead__media">
                    <img
                      src={getOptimizedImageUrl(featuredPost.cover_image, featuredPost.slug)}
                      alt={featuredPost.title}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="journal-lead__content">
                    <div className="journal-meta">
                      <span className="journal-meta__tag">{featuredPost.category || 'Astrology & Rituals'}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime || '5 min read'}</span>
                    </div>
                    <h2 className="journal-lead__title">{featuredPost.title}</h2>
                    <p className="journal-lead__excerpt">{featuredPost.excerpt}</p>
                    <span className="journal-action-link">
                      Read Story <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Companion Stories Grid */}
            {remainingPosts.length > 0 && (
              <div className="journal-grid">
                <AnimatePresence mode="popLayout">
                  {remainingPosts.map((post, idx) => (
                    <motion.article
                      key={post.id || post.slug}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="journal-card"
                        aria-label={`Read article: ${post.title}`}
                      >
                        <div className="journal-card__visual">
                          <img
                            src={getOptimizedImageUrl(post.cover_image, post.slug)}
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="journal-card__body">
                          <div className="journal-meta">
                            <span className="journal-meta__tag">{post.category || 'Astrology & Rituals'}</span>
                            <span>•</span>
                            <span>{post.readTime || '4 min read'}</span>
                          </div>
                          <h3 className="journal-card__title">{post.title}</h3>
                          <p className="journal-card__excerpt">{post.excerpt}</p>
                          <span className="journal-action-link">
                            Read Story <ArrowRight size={13} />
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Quiet Consultation Banner */}
            <aside className="journal-consult">
              <h3>
                Looking for a gift attuned to a <em>specific moment?</em>
              </h3>
              <p>
                Allow our astrological consultation engine to listen to your recipient’s details and reveal the keepsakes consecrated for their chapter.
              </p>
              <Link to="/find-a-gift" className="journal-consult__btn">
                Let Younoya Choose <ArrowRight size={16} />
              </Link>
            </aside>

            {/* Editorial Footer Navigation */}
            <footer className="journal-footer-links">
              <span>YOUNOYA / FOR EVERY CHAPTER</span>
              <div>
                <Link to="/shop">
                  The Collection <ArrowUpRight size={13} />
                </Link>
              </div>
            </footer>
          </>
        )}
      </div>
    </section>
  )
}
