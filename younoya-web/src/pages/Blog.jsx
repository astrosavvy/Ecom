import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react'
import { fetchBlogPosts } from '../lib/api'
import '../styles/Blog.css'

const CATEGORIES = [
  'All',
  'Astrology & Rituals',
  'Gifting Guides',
  'Consecrated Keepsakes',
]

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

  const filteredPosts = activeCategory === 'All'
    ? posts
    : posts.filter((p) => (p.category || 'Astrology & Rituals') === activeCategory)

  const featuredPost = posts.find((p) => p.featured) || posts[0]
  const listPosts = activeCategory === 'All'
    ? posts.filter((p) => p.id !== featuredPost?.id)
    : filteredPosts

  return (
    <section className="journal-page">
      <div className="journal-container">
        {/* Editorial Header */}
        <header className="journal-header">
          <span className="journal-header__eyebrow">
            <Sparkles size={14} /> YOUNOYA / THE JOURNAL
          </span>
          <h1 className="journal-header__title">
            Stories of Intention, <br />
            <em>Ritual & Affection.</em>
          </h1>
          <p className="journal-header__subtitle">
            Astrology-backed gifting, reflections on planetary timing, and the sacred art of consecrated keepsakes.
          </p>
        </header>

        {/* Category Filters */}
        <div className="journal-filters" role="group" aria-label="Filter journal articles by category">
          {CATEGORIES.map((cat) => (
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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(8,11,20,0.5)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
            Consulting the celestial archives...
          </div>
        ) : (
          <>
            {/* Featured Article Card (Shown on "All" filter) */}
            {activeCategory === 'All' && featuredPost && (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="journal-featured"
                  aria-label={`Read featured article: ${featuredPost.title}`}
                >
                  <div className="journal-featured__visual">
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      loading="eager"
                    />
                    <span className="journal-featured__badge">
                      Featured Chapter
                    </span>
                  </div>
                  <div className="journal-featured__content">
                    <div className="journal-featured__meta">
                      <span>{featuredPost.category || 'Astrology & Rituals'}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime || '5 min read'}</span>
                    </div>
                    <h2 className="journal-featured__title">{featuredPost.title}</h2>
                    <p className="journal-featured__excerpt">{featuredPost.excerpt}</p>
                    <span className="journal-featured__cta">
                      Read Chapter <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Articles Grid */}
            {listPosts.length > 0 ? (
              <div className="journal-grid">
                <AnimatePresence mode="popLayout">
                  {listPosts.map((post, idx) => (
                    <motion.article
                      key={post.id || post.slug}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.3) }}
                    >
                      <Link
                        to={`/blog/${post.slug}`}
                        className="journal-card"
                        aria-label={`Read article: ${post.title}`}
                      >
                        {post.cover_image && (
                          <div className="journal-card__visual">
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="journal-card__body">
                          <div className="journal-card__meta">
                            <span>{post.category || 'Astrology & Rituals'}</span>
                            <span>•</span>
                            <span>{post.readTime || '4 min read'}</span>
                          </div>
                          <h3 className="journal-card__title">{post.title}</h3>
                          <p className="journal-card__excerpt">{post.excerpt}</p>
                          <span className="journal-card__cta">
                            Read Story <ArrowRight size={14} />
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            ) : activeCategory !== 'All' ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(8,11,20,0.5)', fontFamily: 'Cinzel, serif' }}>
                New chapters for this category are being penned.
              </div>
            ) : null}

            {/* Consultation Banner */}
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
              <span>YOUNOYA / THE SANCTUM JOURNAL</span>
              <div>
                <Link to="/shop">
                  The Collection <ArrowUpRight size={13} />
                </Link>
                <span style={{ margin: '0 12px', opacity: 0.3 }}>|</span>
                <Link to="/">
                  Return to Boutique Story <ArrowUpRight size={13} />
                </Link>
              </div>
            </footer>
          </>
        )}
      </div>
    </section>
  )
}
