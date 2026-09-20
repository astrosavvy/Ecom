import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalItems, setIsOpen } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMobileOpen(false)

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link className="navbar__brand" to="/" aria-label="Younoya home">
          <img src="/favicon.png" alt="Younoya" />
        </Link>
        <span className="navbar__descriptor">OBJECTS OF AFFECTION</span>
        <nav className="navbar__nav" aria-label="Primary navigation">
          <a href="/#intentions">Intentions</a>
          <a href="/#story">Story</a>
          <a href="/#finale">Younoya</a>
        </nav>
        <div className="navbar__actions">
          <button className="navbar__cart" onClick={() => setIsOpen(true)} aria-label={`Open shopping bag with ${totalItems} items`}><ShoppingBag size={18} /><span>Bag</span>{totalItems > 0 && <b>{totalItems}</b>}</button>
          <button className="navbar__menu" onClick={() => setMobileOpen((value) => !value)} aria-expanded={mobileOpen} aria-label="Toggle menu">{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="navbar__mobile" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <a href="/#intentions" onClick={close}>Gift intentions</a>
            <a href="/#story" onClick={close}>The Story</a>
            <a href="/#finale" onClick={close}>Younoya</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
