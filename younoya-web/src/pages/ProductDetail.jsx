import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { getProductByHandle, getRelatedProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import NotFound from './NotFound'
import '../styles/ProductDetail.css'

function StoryCopy({ text }) {
  return text.split(/\n\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)
}

export default function ProductDetail() {
  const { handle } = useParams()
  const product = getProductByHandle(handle)
  const { addToCart } = useCart()
  const reducedMotion = useReducedMotion()
  const [activeImage, setActiveImage] = useState(0)
  const [personalizing, setPersonalizing] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const personalSectionRef = useRef(null)

  useEffect(() => {
    setActiveImage(0)
    setPersonalizing(false)
    setRecipient('')
    setMessage('')
    setQuantity(1)
  }, [handle])

  useEffect(() => {
    if (!personalizing) return undefined
    const frame = requestAnimationFrame(() => {
      if (window.__lenis) window.__lenis.scrollTo(personalSectionRef.current, { offset: -110, duration: reducedMotion ? 0 : 0.75 })
      else personalSectionRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [personalizing, reducedMotion])

  useEffect(() => {
    if (!added) return undefined
    const timer = setTimeout(() => setAdded(false), 2200)
    return () => clearTimeout(timer)
  }, [added])

  if (!product) return <NotFound />

  const images = product.galleryImages
  const currentImage = images[activeImage] || images[0]
  const related = getRelatedProducts(product)
  const personalizedNote = [recipient.trim() && `For ${recipient.trim()}`, message.trim()].filter(Boolean).join(' — ')

  function addPiece(personalized = false) {
    const note = personalized ? personalizedNote : ''
    const lineKey = personalized && note ? `${product.id}::${encodeURIComponent(note.toLocaleLowerCase())}` : `${product.id}::standard`
    addToCart({
      id: lineKey,
      handle: product.handle,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.cardImage,
      chapter: 'Younoya brooch',
      recipientName: personalized ? recipient.trim() : undefined,
      personalNote: note || undefined,
    }, quantity)
    setPersonalizing(false)
    setAdded(true)
  }

  function shiftImage(direction) {
    setActiveImage(index => (index + direction + images.length) % images.length)
  }

  function openPersonalization() {
    setPersonalizing(true)
    if (personalizing) {
      if (window.__lenis) window.__lenis.scrollTo(personalSectionRef.current, { offset: -110, duration: reducedMotion ? 0 : 0.75 })
      else personalSectionRef.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
    }
  }

  return (
    <div className="piece-page">
      <div className="piece-page__shell">
        <nav className="piece-page__crumb" aria-label="Breadcrumb"><Link to="/shop"><ArrowLeft size={15} /> The collection</Link><span>/</span><span>{product.name}</span></nav>
        <div className="piece-page__stage">
          <div className="piece-gallery">
            <div className="piece-gallery__stage">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={`${product.subtitle}, view ${activeImage + 1} of ${images.length}`}
                  className="piece-gallery__image"
                  initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.26 }}
                  fetchPriority={activeImage === 0 ? 'high' : 'auto'}
                />
              </AnimatePresence>
              <div className="piece-gallery__top"><span>YOUNOYA / OBJECT {product.chapter}</span><span>{String(activeImage + 1).padStart(2, '0')} — {String(images.length).padStart(2, '0')}</span></div>
              <div className="piece-gallery__controls"><button type="button" onClick={() => shiftImage(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button><button type="button" onClick={() => shiftImage(1)} aria-label="Next image"><ChevronRight size={20} /></button></div>
            </div>
          </div>

          <article className="piece-intro">
            <div className="piece-intro__overline"><span>THE YOUNOYA COLLECTION</span><span>NO. {product.chapter} / 10</span></div>
            <h1>{product.name}</h1>
            <p className="piece-intro__subtitle">{product.subtitle}</p>
            <div className="piece-intro__price"><strong>{product.price}</strong><span>ONE BROOCH · PERSONALIZATION AVAILABLE</span></div>
            <div className="piece-intro__statement"><span>✳ &nbsp;THE INTENTION</span><p>{product.tagline}</p></div>
            <div className="piece-intro__description"><StoryCopy text={product.editorial.intro} /></div>
            <div className="piece-intro__actions">
              <div className="piece-intro__quantity" aria-label="Quantity"><button type="button" onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={16} /></button><span>{quantity}</span><button type="button" onClick={() => setQuantity(value => Math.min(20, value + 1))} aria-label="Increase quantity"><Plus size={16} /></button></div>
              <button type="button" className="piece-intro__add" onClick={() => addPiece(false)}><span>{added ? 'Added to bag' : 'Add to bag'}</span>{added ? <Check size={18} /> : <ArrowRight size={18} />}</button>
            </div>
            <button type="button" className="piece-intro__personalize" aria-expanded={personalizing} aria-controls="piece-personalization" onClick={openPersonalization}><span><span className="piece-intro__personalize-star">✳</span> Personalize me<small>ADD A NAME OR MESSAGE TO THIS PIECE</small></span><ArrowUpRight size={20} /></button>
            <AnimatePresence initial={false}>
              {personalizing && <motion.section id="piece-personalization" ref={personalSectionRef} className="piece-personalization-inline" aria-labelledby="piece-personalization-title" initial={reducedMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={reducedMotion ? undefined : { opacity: 0, height: 0 }} transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}>
                <div className="piece-personalization-inline__inner">
                  <div className="piece-personalization-inline__heading"><span className="piece-personalization-inline__kicker">YOUR PERSONAL EDIT</span><button type="button" onClick={() => setPersonalizing(false)}>Close</button></div>
                  <h2 id="piece-personalization-title">Make it <em>theirs.</em></h2>
                  <p>Add a name or a few words that belong with this piece. Your note stays with your selection in the bag.</p>
                  <label htmlFor="piece-recipient">Who is it for? <span>OPTIONAL</span></label>
                  <input id="piece-recipient" type="text" maxLength={60} autoComplete="off" placeholder="A name, or simply 'me'" value={recipient} onChange={event => setRecipient(event.target.value)} />
                  <label htmlFor="piece-message">Your words <span>OPTIONAL · {message.length}/240</span></label>
                  <textarea id="piece-message" maxLength={240} rows={3} placeholder="A thought worth keeping..." value={message} onChange={event => setMessage(event.target.value)} />
                  <div className="piece-personalization-inline__preview"><span>YOUR NOTE</span><p>{personalizedNote || 'A personal thought will appear here.'}</p></div>
                  <button type="button" className="piece-personalization-inline__add" onClick={() => addPiece(true)}>Add personalized piece <ArrowRight size={17} /></button>
                </div>
              </motion.section>}
            </AnimatePresence>
            <p className="piece-intro__quiet">A piece chosen for its story, with room to make it your own.</p>
          </article>
        </div>

        <section className="piece-story" aria-labelledby="piece-story-title">
          <div className="piece-story__heading"><span>01 / BEHIND THE PIECE</span><h2 id="piece-story-title">More than an <em>ornament.</em></h2></div>
          <div className="piece-story__body">
            <div className="piece-story__quote"><span>✳</span><p>{product.editorial.intention.split('\n\n').at(-1)}</p></div>
            {[
              { id: 'symbol', label: 'Its symbolism', copy: product.editorial.symbol },
              { id: 'astrology', label: 'An astrologically guided choice', copy: product.editorial.astrology },
              { id: 'wear', label: 'How to wear & gift it', copy: product.editorial.wear },
            ].map(section => <section className="piece-story__section" key={section.id}><h3>{section.label}</h3><div><StoryCopy text={section.copy} /></div></section>)}
          </div>
        </section>

        <section className="piece-facts" aria-labelledby="piece-facts-title"><div><span>02 / THE DETAILS</span><h2 id="piece-facts-title">The piece, <em>up close.</em></h2></div><dl><div><dt>Dimensions</dt><dd>{product.specs.dimensions}</dd></div><div><dt>Weight</dt><dd>{product.specs.weight}</dd></div><div><dt>Colour & finish</dt><dd>{product.specs.color}</dd></div><div><dt>Pack</dt><dd>{product.specs.pack}</dd></div></dl></section>

        <section className="piece-related" aria-labelledby="piece-related-title"><div className="piece-related__heading"><div><span>03 / KEEP EXPLORING</span><h2 id="piece-related-title">Stories that <em>sit together.</em></h2></div><Link to="/shop">View the collection <ArrowUpRight size={16} /></Link></div><div className="piece-related__grid">{related.map(item => <Link to={`/product/${item.handle}`} key={item.id} className="piece-related__card"><img src={item.cardImage} alt={item.subtitle} loading="lazy" /><div><span>{item.motif}</span><h3>{item.name}</h3><small>{item.price}</small></div><ArrowUpRight size={20} /></Link>)}</div></section>
      </div>

      <div className="piece-mobile-bar"><div><span>{product.name}</span><strong>{product.price}</strong></div><button type="button" onClick={openPersonalization}>Personalize <ArrowUpRight size={16} /></button></div>
    </div>
  )
}
