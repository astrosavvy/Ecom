import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ShieldCheck,
  Package,
  ScrollText,
  ChevronDown,
  ArrowRight,
  Check,
  Star,
  Compass,
} from 'lucide-react'
import { getProductByHandle, PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'
import '../styles/ProductDetail.css'

export default function ProductDetail() {
  const { handle } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const product = getProductByHandle(handle)
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [activeAccordion, setActiveAccordion] = useState('consecration') // 'consecration' | 'materials' | 'unboxing' | 'specs'
  const [personalNote, setPersonalNote] = useState('')
  const [selectedSeal, setSelectedSeal] = useState('gold')
  const [addedAnimation, setAddedAnimation] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Reset image and selections when navigating between products
  useEffect(() => {
    setActiveImgIndex(0)
    setPersonalNote('')
    setSelectedSeal('gold')
    setQuantity(1)
  }, [handle])

  const sealOptions = [
    { id: 'gold', name: 'Imperial Gold', color: '#d4af37' },
    { id: 'obsidian', name: 'Midnight Obsidian', color: '#161616' },
    { id: 'burgundy', name: 'Royal Burgundy', color: '#7a1c22' },
    { id: 'emerald', name: 'Vedic Emerald', color: '#144634' },
  ]

  const handleAddToCart = () => {
    addToCart(
      {
        id: `${product.id}-${selectedSeal}`,
        name: product.name,
        subtitle: product.subtitle,
        price: product.price,
        priceNum: product.priceNum,
        image: product.primaryImage,
        chapter: `Chapter ${product.chapter} (${product.badge})`,
        seal: selectedSeal,
        personalNote: personalNote.trim() || undefined,
      },
      quantity
    )
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 2000)
  }

  const handleDirectCheckout = () => {
    handleAddToCart()
  }

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key))
  }

  const relatedProducts = PRODUCTS.filter((p) =>
    product.relatedHandles?.includes(p.handle)
  ).slice(0, 3)

  return (
    <div className="product-page">
      {/* Atelier Breadcrumbs */}
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">Atelier</Link>
        <span className="breadcrumb-sep">/</span>
        <Link to="/shop" className="breadcrumb-link">All products</Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Chapter {product.chapter} • {product.badge}</span>
      </nav>

      {/* Main Showcase Stage */}
      <div className="product-stage">
        {/* Left Column: Fine Jewelry Gallery */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <div className="product-gallery__glow" />
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImgIndex}
                src={product.galleryImages[activeImgIndex] || product.primaryImage}
                alt={product.name}
                className="product-gallery__img"
                initial={{ opacity: 0.3, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.2 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
            <div className="product-gallery__badge">
              <Sparkles size={13} className="text-gold" />
              <span>108× CONSECRATED HEIRLOOM</span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="product-gallery__thumbs">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`product-gallery__thumb ${idx === activeImgIndex ? 'is-active' : ''}`}
                onClick={() => setActiveImgIndex(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Atelier Specifications & Purchase Panel */}
        <div className="product-info">
          <div className="product-info__header">
            <div className="product-info__badge-row">
              <span className="product-badge">CHAPTER {product.chapter}</span>
              <span className="product-badge-sub">{product.badge}</span>
              <span className="product-rating">
                <Star size={12} fill="#d4af37" color="#d4af37" />
                <span>{product.rating}</span>
                <small>({product.reviewCount} Consecrations)</small>
              </span>
            </div>

            <h1 className="product-title">{product.name}</h1>
            <p className="product-subtitle">{product.subtitle}</p>

            <div className="product-price-row">
              <div className="product-price-main">
                <span className="product-price">{product.price}</span>
                <span className="product-price-note">All taxes included • Complimentary insured courier</span>
              </div>
            </div>

            {/* Astrological Resonance Pill */}
            <div className="astrology-pill">
              <Compass size={15} className="text-gold" />
              <div>
                <strong>Celestial Alignment:</strong>
                <span>{product.astrologyBadge}</span>
              </div>
            </div>
          </div>

          {/* Intention Philosophy Narrative */}
          <div className="product-narrative">
            <h3 className="narrative-heading">The Intention & Consecration</h3>
            <p className="narrative-body">{product.intentionStory}</p>
          </div>

          {/* Bespoke Personalization Section */}
          <div className="product-customization">
            <div className="customization-header">
              <ScrollText size={15} className="text-gold" />
              <span>Bespoke Wax-Sealed Celestial Scroll</span>
            </div>
            <p className="customization-desc">
              Your gift arrives accompanied by a heavy 300gsm cotton rag scroll hand-pressed with gold foil. Inscribe your heartfelt pledge or recipient’s sankalpa:
            </p>
            <textarea
              className="customization-textarea"
              rows={3}
              placeholder="Enter personal inscription to be penned onto the archival parchment (optional)..."
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
            />

            {/* Wax Seal Selector */}
            <div className="seal-selection">
              <span className="seal-label">Select Atelier Wax Seal:</span>
              <div className="seal-options-grid">
                {sealOptions.map((seal) => (
                  <button
                    key={seal.id}
                    type="button"
                    className={`seal-btn ${selectedSeal === seal.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedSeal(seal.id)}
                  >
                    <span className="seal-swatch" style={{ background: seal.color }} />
                    <span className="seal-name">{seal.name}</span>
                    {selectedSeal === seal.id && <Check size={12} className="seal-check" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="product-actions">
            <div className="quantity-selector">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`btn-reserve ${addedAnimation ? 'is-added' : ''}`}
              onClick={handleAddToCart}
            >
              <span>{addedAnimation ? 'Keepsake Reserved in Suite ✓' : 'Reserve Consecrated Keepsake'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Quick Assurance Badges */}
          <div className="product-assurances">
            <div className="assurance-item">
              <ShieldCheck size={16} className="text-gold" />
              <span>Authenticated Gemological Certification Included</span>
            </div>
            <div className="assurance-item">
              <Package size={16} className="text-gold" />
              <span>Complimentary White-Glove Insured Courier (2–4 Days)</span>
            </div>
          </div>

          {/* Detailed Consecration & Material Accordions */}
          <div className="product-accordions">
            {/* Accordion 1: Consecration & Astrology */}
            <div className="accordion-card">
              <button
                type="button"
                className="accordion-header"
                onClick={() => toggleAccordion('consecration')}
                aria-expanded={activeAccordion === 'consecration'}
              >
                <span className="accordion-title">✦ Vedic Consecration & Planetary Alignment</span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${activeAccordion === 'consecration' ? 'is-open' : ''}`}
                />
              </button>
              {activeAccordion === 'consecration' && (
                <div className="accordion-content">
                  <div className="accordion-row">
                    <strong>Consecration Ritual:</strong>
                    <p>{product.consecration.ritual}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Purification:</strong>
                    <p>{product.consecration.purification}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Astrological Attunement:</strong>
                    <p>{product.consecration.attunement}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Muhurta Alignment:</strong>
                    <p>{product.consecration.sanctificationDate}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Materials & Gemology */}
            <div className="accordion-card">
              <button
                type="button"
                className="accordion-header"
                onClick={() => toggleAccordion('materials')}
                aria-expanded={activeAccordion === 'materials'}
              >
                <span className="accordion-title">✦ Sacred Gemology & Metallurgy</span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${activeAccordion === 'materials' ? 'is-open' : ''}`}
                />
              </button>
              {activeAccordion === 'materials' && (
                <div className="accordion-content">
                  <div className="accordion-row">
                    <strong>Metal Composition:</strong>
                    <p>{product.materials.metal}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Natural Gemstones:</strong>
                    <p>{product.materials.gemstone}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Gilding & Finish:</strong>
                    <p>{product.materials.finish}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Heirloom Durability:</strong>
                    <p>{product.materials.durability}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Unboxing Experience */}
            <div className="accordion-card">
              <button
                type="button"
                className="accordion-header"
                onClick={() => toggleAccordion('unboxing')}
                aria-expanded={activeAccordion === 'unboxing'}
              >
                <span className="accordion-title">✦ The Presentation & Unboxing Ritual</span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${activeAccordion === 'unboxing' ? 'is-open' : ''}`}
                />
              </button>
              {activeAccordion === 'unboxing' && (
                <div className="accordion-content">
                  <div className="accordion-row">
                    <strong>Presentation Casket:</strong>
                    <p>{product.unboxing.box}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Bespoke Inscribed Scroll:</strong>
                    <p>{product.unboxing.scroll}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Pure Beeswax Seal:</strong>
                    <p>{product.unboxing.seal}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Authenticity Certificate:</strong>
                    <p>{product.unboxing.certificate}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: Specifications & Care */}
            <div className="accordion-card">
              <button
                type="button"
                className="accordion-header"
                onClick={() => toggleAccordion('specs')}
                aria-expanded={activeAccordion === 'specs'}
              >
                <span className="accordion-title">✦ Dimensions & Heirloom Preservation</span>
                <ChevronDown
                  size={16}
                  className={`accordion-chevron ${activeAccordion === 'specs' ? 'is-open' : ''}`}
                />
              </button>
              {activeAccordion === 'specs' && (
                <div className="accordion-content">
                  <div className="accordion-row">
                    <strong>Dimensions:</strong>
                    <p>{product.specs.dimensions}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Weight:</strong>
                    <p>{product.specs.weight}</p>
                  </div>
                  <div className="accordion-row">
                    <strong>Preservation Care:</strong>
                    <p>{product.specs.care}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Sanctums Strip */}
      {relatedProducts.length > 0 && (
        <section className="related-sanctums">
          <div className="related-header">
            <span className="related-eyebrow">✦ CELESTIAL ALLIANCES</span>
            <h2 className="related-title">Explore Complementary Sanctums</h2>
            <p className="related-sub">
              Pair your intention with complementary Vedic energies to complete the sacred suite.
            </p>
          </div>

          <div className="related-grid">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                to={`/product/${rel.handle}`}
                className="related-card"
              >
                <div className="related-card__img-box">
                  <img src={rel.primaryImage} alt={rel.name} />
                  <span className="related-card__badge">{rel.badge}</span>
                </div>
                <div className="related-card__body">
                  <span className="related-card__chapter">Chapter {rel.chapter}</span>
                  <h3 className="related-card__title">{rel.name}</h3>
                  <span className="related-card__price">{rel.price}</span>
                  <span className="related-card__link">Discover Sanctum ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="mobile-reserve-bar">
        <div className="mobile-reserve-info">
          <span className="mobile-reserve-name">{product.name}</span>
          <span className="mobile-reserve-price">{product.price}</span>
        </div>
        <button
          type="button"
          className="mobile-reserve-btn"
          onClick={handleAddToCart}
        >
          Reserve ↗
        </button>
      </div>
    </div>
  )
}
