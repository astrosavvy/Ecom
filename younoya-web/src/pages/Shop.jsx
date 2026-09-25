import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import '../styles/Shop.css'

const EDITS = [
  { id: 'all', label: 'The full collection', handles: PRODUCTS.map(item => item.handle) },
  { id: 'connection', label: 'Connection', handles: ['love-connection', 'toucan-keepsake', 'dream-jar'] },
  { id: 'new', label: 'New beginnings', handles: ['hero-threshold', 'confidence-personal-power', 'beetle-keepsake'] },
  { id: 'balance', label: 'Balance', handles: ['vitality-inner-balance', 'dream-jar', 'love-connection'] },
  { id: 'abundance', label: 'Abundance', handles: ['wealth-prosperity', 'hero-threshold', 'confidence-personal-power'] },
]
const SIGNATURE = PRODUCTS.find(item => item.handle === 'love-connection')

function ProductEditorial({ product, index }) {
  return <motion.article className="collection-piece" layout initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: .42, delay: Math.min(index * .055, .25) }}>
    <Link className="collection-piece__visual" to={`/product/${product.handle}`} aria-label={`Explore ${product.name}`}>
      <img src={product.primaryImage} alt={product.name} loading={index < 2 ? 'eager' : 'lazy'} />
      <span className="collection-piece__open" aria-hidden="true"><ArrowUpRight size={21} strokeWidth={1.3} /></span>
    </Link>
    <div className="collection-piece__content">
      <div className="collection-piece__line"><span>{product.badge}</span><span>NO. {product.chapter}</span></div>
      <Link to={`/product/${product.handle}`}><h3>{product.name}</h3></Link>
      <p className="collection-piece__subtitle">{product.subtitle}</p>
      <p className="collection-piece__story">{product.intentionStory.split('. ')[0]}.</p>
      <div className="collection-piece__end"><span>{product.tagline}</span><strong>{product.price}</strong></div>
    </div>
  </motion.article>
}

export default function Shop() {
  const [activeEdit, setActiveEdit] = useState('all')
  const selected = EDITS.find(edit => edit.id === activeEdit)
  const visible = PRODUCTS.filter(product => selected.handles.includes(product.handle) && (activeEdit !== 'all' || product.handle !== SIGNATURE.handle))

  return <section className="collection" aria-labelledby="collection-title">
    <header className="collection__intro">
      <Link to="/" className="collection__return">Younoya / The story <ArrowUpRight size={13} /></Link>
      <div className="collection__intro-grid">
        <div><span className="collection__eyebrow">THE YOUNOYA ATELIER</span><h1 id="collection-title">Objects to hold.<br /><em>Feelings to keep.</em></h1></div>
        <p>Considered keepsakes for the people and moments that matter. Explore the details, materials and intentions behind each piece.</p>
      </div>
    </header>

    {activeEdit === 'all' && <Link className="collection-feature" to={`/product/${SIGNATURE.handle}`} aria-label={`Explore ${SIGNATURE.name}`}>
      <div className="collection-feature__image"><img src={SIGNATURE.primaryImage} alt={SIGNATURE.name} fetchPriority="high" /></div>
      <div className="collection-feature__copy">
        <span className="collection__eyebrow">THE SIGNATURE OBJECT</span>
        <h2>For the ones who<br /><em>feel like home.</em></h2>
        <p>{SIGNATURE.intentionStory.split('. ')[0]}.</p>
        <div className="collection-feature__bottom"><span>{SIGNATURE.name}</span><span>{SIGNATURE.price}</span><i><ArrowUpRight size={20} /></i></div>
      </div>
    </Link>}

    <div className="collection__body">
      <div className="collection__toolbar"><div><span className="collection__eyebrow">EXPLORE BY INTENTION</span><h2>The collection <em>edit</em></h2></div><span>{selected.handles.length.toString().padStart(2, '0')} objects</span></div>
      <div className="collection__filters" role="group" aria-label="Filter collection by intention">
        {EDITS.map(edit => <button type="button" key={edit.id} className={edit.id === activeEdit ? 'is-selected' : ''} aria-pressed={edit.id === activeEdit} onClick={() => setActiveEdit(edit.id)}>{edit.label}<span>{edit.handles.length.toString().padStart(2, '0')}</span></button>)}
      </div>
      <motion.div layout className="collection__grid">
        <AnimatePresence mode="popLayout">{visible.map((product, index) => <ProductEditorial key={product.id} product={product} index={index} />)}</AnimatePresence>
      </motion.div>
    </div>

    <div className="collection__consult"><Sparkles size={18} strokeWidth={1.4} /><p>Not sure where to begin? <em>Let us listen first.</em></p><Link to="/find-a-gift">Let Younoya choose <ArrowRight size={17} /></Link></div>
    <footer className="collection__footer"><span>YOUNOYA / GIFTS WITH MEANING</span><div><Link to="/blog" style={{ marginRight: '18px' }}>The Journal <ArrowUpRight size={15} /></Link><Link to="/">Return to the story <ArrowUpRight size={15} /></Link></div></footer>
  </section>
}
