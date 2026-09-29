import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Compass, Heart, Minus, Plus, Scroll, Sparkles, Star } from 'lucide-react'
import ProductPersonalization from './ProductPersonalization'

export default function ProductBuyBox({
  product,
  quantity,
  onQuantityChange,
  added,
  onAddPiece,
  personalizing,
  onTogglePersonalizing,
  isWishlisted,
  onToggleWishlist,
  personalSectionRef,
  recipient,
  onRecipientChange,
  message,
  onMessageChange,
  personalizedNote,
  reducedMotion
}) {
  return (
    <article className="livora-buybox">
      <div className="livora-buybox__kicker">
        <span className="livora-kicker">
          <Sparkles size={13} /> CONSECRATION NO. {product.chapter} / 10
        </span>
        <button 
          type="button" 
          className={`livora-buybox__wish ${isWishlisted ? 'is-active' : ''}`}
          onClick={onToggleWishlist}
          aria-label="Save piece"
        >
          <Heart size={18} fill={isWishlisted ? "#A31517" : "none"} stroke={isWishlisted ? "#A31517" : "#594D42"} />
        </button>
      </div>

      <h1 className="livora-buybox__title">{product.name}</h1>
      <p className="livora-buybox__subtitle">{product.subtitle}</p>

      <div className="livora-buybox__rating">
        <div className="livora-buybox__stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#B8860B" stroke="none" />
          ))}
        </div>
        <span>4.98 (42 Consecrated Reviews)</span>
      </div>

      <div className="livora-buybox__price-box">
        <div className="livora-buybox__price-row">
          <strong className="livora-buybox__price">{product.price}</strong>
          <span className="livora-buybox__badge">Consecrated Brooch</span>
        </div>
        <small className="livora-buybox__delivery-note">
          Tax included • Free insured courier delivery across India (2–4 days)
        </small>
      </div>

      <div className="livora-buybox__intention">
        <div className="livora-buybox__intention-head">
          <Compass size={16} />
          <span>SACRED INTENTION & ENERGETIC RESONANCE</span>
        </div>
        <p>{product.tagline}</p>
      </div>

      <div className="livora-buybox__intro">
        <p>{product.intentionStory || product.editorial?.intro}</p>
      </div>

      <div className="livora-buybox__actions">
        <div className="livora-buybox__qty" aria-label="Quantity">
          <button type="button" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
            <Minus size={15} />
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => onQuantityChange(Math.min(10, quantity + 1))} aria-label="Increase quantity">
            <Plus size={15} />
          </button>
        </div>

        <button 
          type="button" 
          className={`livora-btn livora-btn--dark livora-btn--full ${added ? 'is-added' : ''}`}
          onClick={() => onAddPiece(false)}
        >
          {added ? <><Check size={18} /> Added to Bag</> : <>Add to Bag <ArrowRight size={16} /></>}
        </button>
      </div>

      <button 
        type="button" 
        className="livora-buybox__personalize-toggle"
        onClick={onTogglePersonalizing}
        aria-expanded={personalizing}
      >
        <span>
          <Scroll size={17} /> 
          <strong>Personalize this Keepsake</strong>
          <small>Inscribe recipient name & custom blessing on the cotton parchment scroll</small>
        </span>
        <ArrowUpRight size={18} />
      </button>

      <AnimatePresence>
        {personalizing && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProductPersonalization
              personalRef={personalSectionRef}
              recipient={recipient}
              onRecipientChange={onRecipientChange}
              message={message}
              onMessageChange={onMessageChange}
              personalizedNote={personalizedNote}
              onClose={onTogglePersonalizing}
              onSubmit={() => onAddPiece(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
