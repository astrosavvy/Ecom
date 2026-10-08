import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { X, Gift, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartItem from './cart/CartItem'
import '../styles/CartDrawer.css'

export default function CartDrawer() {
  const navigate = useNavigate()
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, totalItems, giftNote, setGiftNote } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cart-overlay">
          <motion.div className="cart-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />
          <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your bag" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }}>
            <div className="cart-drawer__header">
              <div className="header-title">
                <span className="eyebrow-mini">YOUNOYA ATELIER</span>
                <h3>Your Bag ({totalItems})</h3>
              </div>
              <button className="cart-close-btn" onClick={() => setIsOpen(false)} aria-label="Close bag"><X size={18} /></button>
            </div>

            <div className="cart-drawer__body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="empty-emblem">✦</div>
                  <h4>Your bag is empty</h4>
                  <p>Explore considered keepsakes and rituals for every chapter.</p>
                  <Link className="btn-gold" to="/shop" onClick={() => setIsOpen(false)}>Explore Collection</Link>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
                  ))}

                  <div className="cart-gift-card">
                    <div className="personalization-box">
                      <div className="personalization-box__header">
                        <Gift size={17} className="text-gold" />
                        <span>A personal gift note</span>
                        <small className="cart-note-len">{giftNote.length}/180</small>
                      </div>
                      <textarea className="personalization-input" aria-label="Order blessing and gift note" maxLength={180} placeholder="Add a personal note for the moment..." rows={2} value={giftNote} onChange={(e) => setGiftNote(e.target.value)} />
                    </div>
                    <p className="checkout-message">Any valid promotion can be applied at checkout, where your final total is calculated securely.</p>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-summary">
                  <div className="summary-row"><span>Bag Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                  <div className="summary-row"><span>Shipping</span><span>Free within India</span></div>
                  <div className="summary-row summary-row--total"><span>Estimated total</span><span className="total-val">₹{totalPrice.toLocaleString('en-IN')}</span></div>
                </div>
                <button className="btn-gold checkout-btn" type="button" onClick={() => { sessionStorage.removeItem('yn_selected_offer'); setIsOpen(false); navigate('/checkout') }}>
                  <span>Proceed to Checkout</span> <ArrowRight size={15} />
                </button>
                <div className="checkout-guarantee"><span>✦ Prepared with care in our atelier.</span></div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
