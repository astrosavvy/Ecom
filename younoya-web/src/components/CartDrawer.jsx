import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Gift, Sparkles, Check, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartItem from './cart/CartItem'
import '../styles/CartDrawer.css'

const FREE_GIFT_TIER = 5000

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, totalItems, giftNote, setGiftNote } = useCart()
  const [code, setCode] = useState('')
  const [codeApplied, setCodeApplied] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const discount = codeApplied ? Math.round(totalPrice * 0.1) : 0
  const progress = Math.min(100, Math.round((totalPrice / FREE_GIFT_TIER) * 100))
  const remaining = Math.max(0, FREE_GIFT_TIER - totalPrice)
  const finalTotal = Math.max(0, totalPrice - discount)

  function applyVoucher(e) {
    e.preventDefault()
    if (!code.trim()) {
      setCodeError('Enter a code to apply it.')
      return
    }
    const normalized = code.trim().toUpperCase()
    if (normalized === 'ASTER10' || normalized === 'NOYA' || normalized === 'RITUAL') {
      setCodeApplied(true)
      setCodeError('')
    } else {
      setCodeApplied(false)
      setCodeError('That code was not recognised. Please check and try again.')
    }
  }

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
                  <h4>Your sacred bag is empty</h4>
                  <p>Explore our astrology-backed keepsakes consecrated with Vedic intention.</p>
                  <Link className="btn-gold" to="/shop" onClick={() => setIsOpen(false)}>Explore Collection</Link>
                </div>
              ) : (
                <div className="cart-items">
                  <div className="cart-progress">
                    <div className="cart-progress__label">
                      <Sparkles size={13} className="text-gold" />
                      <span>{remaining > 0 ? `Add ₹${remaining.toLocaleString('en-IN')} for complimentary Consecration Scroll` : '✦ Complimentary Consecration Scroll Unlocked!'}</span>
                    </div>
                    <div className="cart-progress__track"><div className="cart-progress__bar" style={{ width: `${progress}%` }} /></div>
                  </div>

                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
                  ))}

                  <div className="cart-gift-card">
                    <div className="personalization-box">
                      <div className="personalization-box__header">
                        <Gift size={17} className="text-gold" />
                        <span>Order Blessing & Gift Note</span>
                        <small className="cart-note-len">{giftNote.length}/180</small>
                      </div>
                      <textarea className="personalization-input" aria-label="Order blessing and gift note" maxLength={180} placeholder="Add a personal note for the moment..." rows={2} value={giftNote} onChange={(e) => setGiftNote(e.target.value)} />
                    </div>
                    <form className="cart-voucher" onSubmit={applyVoucher}>
                      <input type="text" aria-label="Promo or seeker code" placeholder="Promo or seeker code" value={code} onChange={(e) => { setCode(e.target.value); setCodeError(''); if (codeApplied) setCodeApplied(false) }} />
                      <button type="submit" className="cart-voucher__btn">{codeApplied ? <><Check size={14} /> Applied</> : 'Apply'}</button>
                    </form>
                    {codeApplied && <small className="cart-voucher__success">10% gift code applied · −₹{discount.toLocaleString('en-IN')}</small>}
                    {codeError && <small className="cart-voucher__error" role="alert">{codeError}</small>}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer__footer">
                <div className="cart-summary">
                  <div className="summary-row"><span>Bag Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
                  {discount > 0 && <div className="summary-row summary-row--discount"><span>Celestial Blessing (10%)</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
                  <div className="summary-row"><span>Shipping (Express)</span><span className="summary-free">Free</span></div>
                  <div className="summary-row summary-row--total"><span>Total</span><span className="total-val">₹{finalTotal.toLocaleString('en-IN')}</span></div>
                </div>
                <button className="btn-gold checkout-btn" type="button" onClick={() => setCheckoutMessage('Online checkout is being prepared. Write to care@younoya.com and we will help with your order.')}>
                  <span>Proceed to Checkout</span> <ArrowRight size={15} />
                </button>
                {checkoutMessage && <p className="checkout-message" role="status">{checkoutMessage}</p>}
                <div className="checkout-guarantee"><span>✦ Sealed with authentic gold wax & sanctified in our atelier.</span></div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
