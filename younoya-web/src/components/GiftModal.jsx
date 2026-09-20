import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Shield, Gift, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/GiftModal.css'

export default function GiftModal() {
  const { activeModalProduct, setActiveModalProduct, addToCart } = useCart()

  if (!activeModalProduct) return null

  const p = activeModalProduct

  const handleAdd = () => {
    addToCart(p)
    setActiveModalProduct(null)
  }

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveModalProduct(null)}
        />

        <motion.div
          className="modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            className="modal-close-btn"
            onClick={() => setActiveModalProduct(null)}
            aria-label="Close details"
          >
            <X size={20} />
          </button>

          <div className="modal-grid">
            {/* Left Image / Visual Stage */}
            <div className="modal-visual">
              <div className="modal-visual__emblem">
                <span className="modal-emoji">{p.emoji}</span>
              </div>
              <div className="modal-visual__badge">
                <Sparkles size={12} className="text-gold" />
                <span>{p.badge || 'Bespoke Atelier Collection'}</span>
              </div>
              <p className="modal-visual__caption">
                Crafted in limited lunar batches · Inspected by master horologists
              </p>
            </div>

            {/* Right Information & Gifting Attributes */}
            <div className="modal-info">
              <div className="modal-eyebrow">
                <span className="text-gold">✦ CHAPTER CURATION</span>
                {p.sign && <span className="sign-pill">♦ {p.sign}</span>}
              </div>

              <h2 className="modal-title">{p.name}</h2>
              <p className="modal-chapter">Designated For: <em>{p.chapter || 'Milestones & Solar Returns'}</em></p>

              <div className="modal-price-row">
                <span className="modal-price">${p.priceNum}</span>
                <span className="modal-tax-note">Includes Bespoke Celestial Inscription</span>
              </div>

              <p className="modal-desc">{p.desc}</p>

              {/* Astrological Alignment Matrix */}
              <div className="alignment-matrix">
                <h4 className="matrix-heading">Cosmic Specifications:</h4>
                <div className="matrix-grid">
                  <div className="matrix-item">
                    <span className="matrix-label">Ruling Sphere:</span>
                    <strong className="matrix-val">{p.planet || 'The Sun & Mercury'}</strong>
                  </div>
                  <div className="matrix-item">
                    <span className="matrix-label">Elemental Affinity:</span>
                    <strong className="matrix-val">{p.element || 'Ethereal Fire / Gold'}</strong>
                  </div>
                  <div className="matrix-item">
                    <span className="matrix-label">Gemological Note:</span>
                    <strong className="matrix-val">{p.stone || 'Untreated Citrine & Obsidian'}</strong>
                  </div>
                  <div className="matrix-item">
                    <span className="matrix-label">Fragrance Profile:</span>
                    <strong className="matrix-val">{p.scent || 'Aged Amber, Bergamot, Tonka'}</strong>
                  </div>
                </div>
              </div>

              {/* Suite Inclusions */}
              <div className="suite-inclusions">
                <h4 className="inclusions-heading">The Suite Presentation:</h4>
                <ul>
                  <li><CheckCircle size={14} className="text-gold" /> Handcrafted Obsidian & Gold foil keepsake casket</li>
                  <li><CheckCircle size={14} className="text-gold" /> Personalized astrological chart scroll with custom wax seal</li>
                  <li><CheckCircle size={14} className="text-gold" /> Authenticity certificate signed by the YOUNOYA atelier</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button className="btn-gold modal-add-btn" onClick={handleAdd}>
                  <Gift size={16} />
                  <span>Curate into Gifting Suite — ${p.priceNum}</span>
                </button>
              </div>

              <div className="modal-footer-notes">
                <div className="note-item">
                  <Shield size={13} className="text-gold" />
                  <span>Complimentary insured shipping · 30-day chapter exchange</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
