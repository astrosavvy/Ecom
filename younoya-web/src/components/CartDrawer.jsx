import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Plus, Minus, Trash2, Gift } from 'lucide-react'
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
  } = useCart()

  const handleClose = () => {
    setIsOpen(false)
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
                <h3>Your bag ({totalItems})</h3>
              </div>
              <button
                className="cart-close-btn"
                onClick={handleClose}
                aria-label="Close shopping bag"
              >
                <X size={20} />
              </button>
            </div>

            <>

                {/* Items List */}
                <div className="cart-drawer__body">
                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      <div className="empty-emblem">✦</div>
                      <h4>Your next gift begins here</h4>
                      <p>
                        Explore the collection or let Younoya help you choose a piece with meaning.
                      </p>
                      <Link className="btn-gold" to="/shop" onClick={handleClose}>Explore the collection</Link>
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
                            <p className="cart-item__chapter">{(item.chapter || 'Personal selection').replace(/Chapter/gi, 'Object')}</p>
                            {item.personalNote && <p className="cart-item__chapter">Personal note: {item.personalNote}</p>}
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
                          <span>Your gift note</span>
                        </div>
                        <p className="personalization-box__sub">
                          Add a note for this order. You can also personalize each piece on its product page.
                        </p>
                        <textarea
                          className="personalization-input"
                          placeholder="Write a note for this order..."
                          rows={2}
                          value={giftNote}
                          onChange={(e) => setGiftNote(e.target.value)}
                        />
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
                      <div className="summary-row summary-row--total">
                        <span>Subtotal</span>
                        <span className="total-val">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button className="btn-gold checkout-btn" type="button" disabled>
                      <span>Checkout opens soon</span>
                    </button>

                    <div className="checkout-guarantee">
                      <span>Your selections are saved in this browser for now.</span>
                    </div>
                  </div>
                )}
            </>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
