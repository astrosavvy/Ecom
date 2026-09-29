import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import '../styles/Shop.css'

const FILTERS = [
  { id: 'all', label: 'All pieces' },
  { id: 'confidence-power', label: 'Courage & presence' },
  { id: 'vitality-balance', label: 'Growth & renewal' },
  { id: 'love-connection', label: 'Connection' },
  { id: 'wealth-prosperity', label: 'Possibility' },
  { id: 'protection', label: 'Instinct & focus' },
]

const featured = PRODUCTS.find(product => product.handle === 'the-golden-flight')

function Piece({ product, index, reducedMotion }) {
  return (
    <motion.article
      className="atelier-piece"
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 12 }}
      transition={{ duration: 0.38, delay: Math.min(index * 0.045, 0.22) }}
    >
      <Link className="atelier-piece__image" to={`/product/${product.handle}`} aria-label={`Explore ${product.name}`}>
        <img src={product.cardImage} alt={product.subtitle} loading={index < 3 ? 'eager' : 'lazy'} />
        <span className="atelier-piece__index">{String(PRODUCTS.indexOf(product) + 1).padStart(2, '0')} / 10</span>
        <span className="atelier-piece__arrow" aria-hidden="true"><ArrowUpRight size={22} strokeWidth={1.3} /></span>
      </Link>
      <div className="atelier-piece__body">
        <span className="atelier-piece__motif">{product.motif} <span>•</span> {product.tagline}</span>
        <div className="atelier-piece__titleline">
          <Link to={`/product/${product.handle}`}><h3>{product.name}</h3></Link>
          <span>{product.price}</span>
        </div>
        <p>{product.subtitle}</p>
        <div className="atelier-piece__foot"><span>{product.specs.dimensions}</span><Link to={`/product/${product.handle}`}>Discover the piece <ArrowRight size={14} /></Link></div>
      </div>
    </motion.article>
  )
}

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState('all')
  const reducedMotion = useReducedMotion()
  const visible = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(product => product.intention === activeFilter)

  return (
    <div className="atelier-shop">
      <div className="atelier-shop__shell">
        <nav className="atelier-shop__crumb" aria-label="Breadcrumb"><Link to="/">Younoya</Link><span>/</span><span>The collection</span></nav>

        <header className="atelier-shop__header">
          <div>
            <span className="atelier-shop__kicker"><span className="atelier-shop__spark">✳</span> THE YOUNOYA COLLECTION <span>— 01 / 10</span></span>
            <h1>Objects of meaning.<br /><em>Made to be worn.</em></h1>
          </div>
          <p>Ten sculptural brooches. Ten ways to carry an intention close. Explore the character, colour and story of each piece.</p>
        </header>

        <Link to={`/product/${featured.handle}`} className="atelier-shop__feature" aria-label={`Explore ${featured.name}`}>
          <div className="atelier-shop__feature-copy">
            <span>IN FOCUS <span>✳</span> THE RISING PHOENIX</span>
            <h2>To begin<br /><em>again.</em></h2>
            <p>A vivid red phoenix for courage, renewal and the beautiful possibility of what comes next.</p>
            <div className="atelier-shop__feature-link">Meet the piece <span><ArrowUpRight size={21} strokeWidth={1.4} /></span></div>
          </div>
          <div className="atelier-shop__feature-image"><img src={featured.primaryImage} alt={featured.subtitle} fetchPriority="high" /></div>
          <span className="atelier-shop__feature-count">02 &nbsp;/&nbsp; 10</span>
        </Link>

        <section id="pieces" className="atelier-shop__catalog" aria-labelledby="atelier-catalog-title">
          <div className="atelier-shop__catalog-head">
            <div><span className="atelier-shop__kicker">THE ATELIER EDIT</span><h2 id="atelier-catalog-title">Find what <em>speaks to you.</em></h2></div>
            <a href="#atelier-filters" className="atelier-shop__browse">Browse by intention <ArrowDown size={16} /></a>
          </div>
          <div id="atelier-filters" className="atelier-shop__filters" role="group" aria-label="Filter by intention">
            {FILTERS.map(filter => {
              const count = filter.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(product => product.intention === filter.id).length
              return <button key={filter.id} type="button" className={activeFilter === filter.id ? 'is-active' : ''} aria-pressed={activeFilter === filter.id} onClick={() => setActiveFilter(filter.id)}>{filter.label}<span>{String(count).padStart(2, '0')}</span></button>
            })}
          </div>
          <div className="atelier-shop__results"><span>SHOWING {String(visible.length).padStart(2, '0')} PIECES</span><span>AN INTENTION FOR EVERY MOMENT</span></div>
          <motion.div layout={!reducedMotion} className="atelier-shop__grid">
            <AnimatePresence mode="popLayout">
              {visible.map((product, index) => <Piece key={product.id} product={product} index={index} reducedMotion={reducedMotion} />)}
            </AnimatePresence>
          </motion.div>
        </section>

        <aside className="atelier-shop__guide">
          <div className="atelier-shop__guide-icon"><Sparkles size={24} strokeWidth={1.2} /></div>
          <div><span className="atelier-shop__kicker">A MORE PERSONAL WAY TO CHOOSE</span><h2>Not sure which one<br /><em>feels like theirs?</em></h2><p>Let Younoya guide you toward a piece with meaning.</p></div>
          <Link to="/find-a-gift">Let Younoya choose <ArrowUpRight size={19} /></Link>
        </aside>
        <footer className="atelier-shop__footer"><span>YOUNOYA · OBJECTS OF MEANING</span><Link to="/blog">Read the journal <ArrowUpRight size={16} /></Link></footer>
      </div>
    </div>
  )
}
