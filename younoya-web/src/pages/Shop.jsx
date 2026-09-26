import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import '../styles/Shop.css'

const EDITS = [
  { id: 'all', label: 'All 10 Consecrated Brooches', handles: PRODUCTS.map(item => item.handle) },
  { id: 'confidence', label: 'Confidence & Power', handles: ['the-golden-flight', 'vivid-toucan-muse'] },
  { id: 'vitality', label: 'Vitality & Renewal', handles: ['the-verdant-rising', 'solar-embrace', 'flamingo-aura'] },
  { id: 'devotion', label: 'Love & Devotion', handles: ['flamingo-grace'] },
  { id: 'wealth', label: 'Wealth & Wisdom', handles: ['golden-instinct', 'the-inner-kingdom'] },
  { id: 'protection', label: 'Protection & Shielding', handles: ['fire-and-radiance', 'cats-eye'] },
]

const SIGNATURE = PRODUCTS.find(item => item.handle === 'the-golden-flight') || PRODUCTS[0]

function ProductEditorial({ product, index }) {
  return (
    <motion.article
      className="collection-piece"
      layout
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.055, 0.25) }}
    >
      <Link
        className="collection-piece__visual"
        to={`/product/${product.handle}`}
        aria-label={`Explore ${product.name}`}
      >
        <img
          src={product.primaryImage}
          alt={product.name}
          loading={index < 4 ? 'eager' : 'lazy'}
        />
        <span className="collection-piece__open" aria-hidden="true">
          <ArrowUpRight size={21} strokeWidth={1.3} />
        </span>
      </Link>
      <div className="collection-piece__content">
        <div className="collection-piece__line">
          <span>{product.badge}</span>
          <span>{product.specs?.weight || 'HANDCRAFTED'}</span>
        </div>
        <Link to={`/product/${product.handle}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="collection-piece__subtitle">{product.subtitle}</p>
        <div className="collection-piece__specs-preview">
          <span>{product.specs?.dimensions}</span>
        </div>
        <div className="collection-piece__end">
          <span>{product.tagline.split(' • ')[0]}</span>
          <strong>{product.price}</strong>
        </div>
      </div>
    </motion.article>
  )
}

export default function Shop() {
  const [activeEdit, setActiveEdit] = useState('all')
  const selected = EDITS.find(edit => edit.id === activeEdit) || EDITS[0]
  const visible = PRODUCTS.filter(
    product => selected.handles.includes(product.handle) && (activeEdit !== 'all' || product.handle !== SIGNATURE.handle)
  )

  return (
    <section className="collection" aria-labelledby="collection-title">
      <header className="collection__intro">
        <Link to="/" className="collection__return">
          Younoya / Home <ArrowUpRight size={13} />
        </Link>
        <div className="collection__intro-grid">
          <div>
            <span className="collection__eyebrow">THE YOUNOYA ATELIER</span>
            <h1 id="collection-title">
              Consecrated Brooches.<br />
              <em>Heirlooms to keep.</em>
            </h1>
          </div>
          <p>
            Handcrafted brooches imbued with celestial symbolism and Vedic intention.
            Explore exact dimensions, artisan weights, and sacred meanings behind each authentic talisman.
          </p>
        </div>
      </header>

      {activeEdit === 'all' && (
        <Link
          className="collection-feature"
          to={`/product/${SIGNATURE.handle}`}
          aria-label={`Explore ${SIGNATURE.name}`}
        >
          <div className="collection-feature__image">
            <img src={SIGNATURE.primaryImage} alt={SIGNATURE.name} fetchPriority="high" />
          </div>
          <div className="collection-feature__copy">
            <span className="collection__eyebrow">SIGNATURE CONSECRATION</span>
            <h2>
              The Rising Phoenix<br />
              <em>triumphant in gold.</em>
            </h2>
            <p>{SIGNATURE.intentionStory.split('. ')[0]}.</p>
            <div className="collection-feature__specs">
              <span>{SIGNATURE.specs.dimensions}</span>
              <span>•</span>
              <span>{SIGNATURE.specs.weight}</span>
            </div>
            <div className="collection-feature__bottom">
              <span>{SIGNATURE.name}</span>
              <span>{SIGNATURE.price}</span>
              <i><ArrowUpRight size={20} /></i>
            </div>
          </div>
        </Link>
      )}

      <div className="collection__body">
        <div className="collection__toolbar">
          <div>
            <span className="collection__eyebrow">EXPLORE BY INTENTION</span>
            <h2>The Consecrated <em>Edits</em></h2>
          </div>
          <span>{selected.handles.length.toString().padStart(2, '0')} brooches</span>
        </div>
        <div className="collection__filters" role="group" aria-label="Filter collection by intention">
          {EDITS.map(edit => (
            <button
              type="button"
              key={edit.id}
              className={edit.id === activeEdit ? 'is-selected' : ''}
              aria-pressed={edit.id === activeEdit}
              onClick={() => setActiveEdit(edit.id)}
            >
              {edit.label}
              <span>{edit.handles.length.toString().padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <motion.div layout className="collection__grid">
          <AnimatePresence mode="popLayout">
            {visible.map((product, index) => (
              <ProductEditorial key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="collection__consult">
        <Sparkles size={18} strokeWidth={1.4} />
        <p>Not sure which piece aligns with their astrological chart? <em>Let our Sanctum guide consult with you.</em></p>
        <Link to="/find-a-gift">
          Consult Gift Guide <ArrowRight size={17} />
        </Link>
      </div>

      <footer className="collection__footer">
        <span>YOUNOYA / CONSECRATED HEIRLOOMS & BROOCHES</span>
        <div>
          <Link to="/blog" style={{ marginRight: '18px' }}>
            The Journal <ArrowUpRight size={15} />
          </Link>
          <Link to="/">
            Return to Home <ArrowUpRight size={15} />
          </Link>
        </div>
      </footer>
    </section>
  )
}
