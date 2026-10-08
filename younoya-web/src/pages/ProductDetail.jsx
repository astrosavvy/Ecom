import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getProductByHandle, getRelatedProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import NotFound from './NotFound'
import NavratriDetail from './NavratriDetail'
import ProductGallery from '../components/product/ProductGallery'
import ProductBuyBox from '../components/product/ProductBuyBox'
import ProductHighlights from '../components/product/ProductHighlights'
import ProductTabs from '../components/product/ProductTabs'
import ProductReviews from '../components/product/ProductReviews'
import ProductRelated from '../components/product/ProductRelated'
import ProductStickyBar from '../components/product/ProductStickyBar'
import '../styles/ProductDetail.css'

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
  const [isWishlisted, setIsWishlisted] = useState(false)
  const personalSectionRef = useRef(null)

  useEffect(() => {
    setActiveImage(0)
    setPersonalizing(false)
    setRecipient('')
    setMessage('')
    setQuantity(1)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [handle])

  if (!product) return <NotFound />
  if (product.kind === 'ritual-box') return <NavratriDetail product={product} />

  const images = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.cardImage || product.primaryImage]

  const related = getRelatedProducts(product)
  const personalizedNote = [recipient.trim() && `For ${recipient.trim()}`, message.trim()].filter(Boolean).join(' — ')

  function addPiece(personalized = false) {
    const note = personalized ? personalizedNote : ''
    const lineKey = personalized && note 
      ? `${product.id}::${encodeURIComponent(note.toLowerCase())}` 
      : `${product.id}::standard`

    addToCart({
      id: lineKey,
      handle: product.handle,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.cardImage || product.primaryImage,
      chapter: 'Younoya brooch',
      recipientName: personalized ? recipient.trim() : undefined,
      personalNote: note || undefined,
    }, quantity)

    setPersonalizing(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  function shiftImage(direction) {
    setActiveImage(idx => (idx + direction + images.length) % images.length)
  }

  return (
    <div className="livora-detail">
      <div className="livora-detail__shell">
        <nav className="livora-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">The Collection</Link>
          <span>/</span>
          <span className="livora-crumb__current">{product.name}</span>
        </nav>

        <div className="livora-stage">
          <ProductGallery
            product={product}
            images={images}
            activeImage={activeImage}
            onSelectImage={setActiveImage}
            onShiftImage={shiftImage}
            reducedMotion={reducedMotion}
          />

          <ProductBuyBox
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            added={added}
            onAddPiece={addPiece}
            personalizing={personalizing}
            onTogglePersonalizing={() => setPersonalizing(!personalizing)}
            isWishlisted={isWishlisted}
            onToggleWishlist={() => setIsWishlisted(!isWishlisted)}
            personalSectionRef={personalSectionRef}
            recipient={recipient}
            onRecipientChange={setRecipient}
            message={message}
            onMessageChange={setMessage}
            personalizedNote={personalizedNote}
            reducedMotion={reducedMotion}
          />
        </div>

        <ProductHighlights />
        <ProductTabs product={product} />

        <section className="livora-philosophy-banner">
          <div className="livora-philosophy-banner__box">
            <div>
              <span className="livora-kicker">✧ THE YOUNOYA PROMISE</span>
              <h2>Astrology-backed gifting, curated for what matters.</h2>
              <p>Every piece is chosen with intention and guided by astrological insight, combining Cartier-level spatial beauty with ancestral Vedic reverence.</p>
            </div>
            <Link to="/find-a-gift" className="livora-btn livora-btn--dark">
              Consult Aster for Guidance <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <ProductReviews />
        <ProductRelated related={related} />
      </div>

      <ProductStickyBar product={product} onAdd={addPiece} added={added} />
    </div>
  )
}
