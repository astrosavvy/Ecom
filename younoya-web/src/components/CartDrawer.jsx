import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, Sparkles, ShieldCheck, Gift, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCart } from '../context/CartContext'
import '../styles/CartDrawer.css'

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    giftNote,
    setGiftNote,
    waxSealColor,
    setWaxSealColor,
    clearCart,
  } = useCart()

  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart' | 'success'

  const freeShippingThreshold = 5000
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)

  const handleCheckout = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F9E498', '#D4AF37', '#B8860B', '#FFFFFF'],
    })
    setCheckoutStep('success')
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setCheckoutStep('cart'), 400)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-overlay">
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Header */}
            <div className="cart-drawer__header">
              <div className="header-title">
                <span className="eyebrow-mini">YOUNOYA ATELIER</span>
                <h3>Your Gifting Suite ({totalItems})</h3>
              </div>
              <button
                className="cart-close-btn"
                onClick={handleClose}
                aria-label="Close shopping bag"
              >
                <X size={20} />
              </button>
            </div>

            {checkoutStep === 'cart' ? (
              <>
                {/* Free Shipping Meter */}
                <div className="shipping-meter">
                  <div className="shipping-meter__text">
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-gold">✦ Complimentary Worldwide White-Glove Shipping Unlocked</span>
                    ) : (
                      <span>
                        Add <strong className="text-gold">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for complimentary delivery
                      </span>
                    )}
                  </div>
                  <div className="shipping-meter__bar">
                    <div
                      className="shipping-meter__fill"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="cart-drawer__body">
                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      <div className="empty-emblem">✦</div>
                      <h4>Your Suite is Awaiting Its First Chapter</h4>
                      <p>
                        Explore our curated gift vaults or consult the Zodiac Compass to discover bespoke alignments.
                      </p>
                      <button
                        className="btn-gold"
                        onClick={handleClose}
                      >
                        Explore The Vault
                      </button>
                    </div>
                  ) : (
                    <div className="cart-items">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item__img-box">
                            {item.image ? <img src={item.image} alt="" /> : <span className="cart-item__emoji">{item.emoji || '✦'}</span>}
                          </div>
                          <div className="cart-item__details">
                            <div className="cart-item__top">
                              <span className="cart-item__sign">{item.sign || item.tag}</span>
                              <button
                                className="cart-item__remove"
                                onClick={() => removeFromCart(item.id)}
                                title="Remove item"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <h4 className="cart-item__title">{item.name}</h4>
                            <p className="cart-item__chapter">Chapter: {item.chapter || 'Bespoke Alignment'}</p>
                            <div className="cart-item__bottom">
                              <div className="cart-item__qty">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={12} />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)}>
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="cart-item__price">
                                ₹{(item.priceNum * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Bespoke Personalization Accordion */}
                      <div className="personalization-box">
                        <div className="personalization-box__header">
                          <Gift size={16} className="text-gold" />
                          <span>Bespoke Wax-Sealed Celestial Inscription</span>
                        </div>
                        <p className="personalization-box__sub">
                          Each gift includes a hand-pressed gold foil scroll inscribed for your recipient's chapter.
                        </p>
                        <textarea
                          className="personalization-input"
                          placeholder="Compose your heartfelt message or let our astrologer scribe a blessing..."
                          rows={2}
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                        />
                        <div className="wax-seal-selector">
                          <span className="selector-label">Atelier Wax Seal:</span>
                          <div className="seal-options">
                            {['gold', 'obsidian', 'burgundy', 'emerald'].map((color) => (
                              <button
                                key={color}
                                className={`seal-opt seal-opt--${color} ${waxSealColor === color ? 'active' : ''}`}
                                onClick={() => setWaxSealColor(color)}
                                title={`${color} wax seal`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="cart-drawer__footer">
                    <div className="cart-summary">
                      <div className="summary-row">
                        <span>Atelier Subtotal</span>
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="summary-row">
                        <span>Cosmic Inscription & Packaging</span>
                        <span className="text-gold">Complimentary</span>
                      </div>
                      <div className="summary-row summary-row--total">
                        <span>Total Investment</span>
                        <span className="total-val">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      className="btn-gold checkout-btn"
                      onClick={handleCheckout}
                    >
                      <span>Proceed to checkout</span>
                      <ArrowRight size={16} />
                    </button>

                    <div className="checkout-guarantee">
                      <ShieldCheck size={14} className="text-gold" />
                      <span>Insured Celestial Courier · Authentic Gemological Certification</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="cart-success">
                <motion.div
                  className="success-emblem"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  ✦
                </motion.div>
                <h3>Your Chapter Begins</h3>
                <p className="success-desc">
                  Thank you for entrusting YOUNOYA with this sacred gifting ritual. Our celestial atelier has received your curation.
                </p>
                <div className="success-details">
                  <div className="detail-item">
                    <span>Order Inscription:</span>
                    <strong>#YN-{Math.floor(100000 + Math.random() * 900000)}</strong>
                  </div>
                  <div className="detail-item">
                    <span>Delivery Timing:</span>
                    <strong>Aligned with the Upcoming Solar Cycle</strong>
                  </div>
                </div>
                <button
                  className="btn-gold"
                  onClick={() => {
                    clearCart()
                    handleClose()
                  }}
                >
                  Return to the Cosmos
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
