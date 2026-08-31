import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../../lib/store'

const NAV_LINKS = [
  { label: 'Shop', path: '/shop' },
  { label: 'Personalised', path: '/personalise' },
  { label: 'Gifts', path: '/gifts' },
  { label: 'Journal', path: '/journal' },
  { label: 'About', path: '/about' },
]

export default function StoreHeader() {
  const { pathname } = useLocation()
  const { cartCount } = useStore()
  const ref = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let lastY = window.scrollY
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      const goingDown = y > lastY + 4
      const goingUp = y < lastY - 4
      if (goingDown && y > 150) el.dataset.hidden = 'true'
      else if (goingUp) el.dataset.hidden = 'false'
      if (goingDown || goingUp) lastY = y
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="store-header" ref={ref} data-hidden="false">
        <Link to="/" className="store-header__brand" aria-label="YOUNOYA Home">
          <img src="/brand.webp" alt="YOUNOYA" className="store-header__logo" />
        </Link>

        <nav className="store-header__nav" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`store-header__link${pathname.startsWith(link.path) ? ' store-header__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="store-header__actions">
          <Link to="/personalise" className="cta-personal" style={{ padding: '8px 20px', fontSize: '0.6875rem' }}>
            ✦ Build My Toolkit
          </Link>

          <Link to="/cart" className="store-header__cart-badge" aria-label={`Cart (${cartCount} items)`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="store-header__cart-count">{cartCount}</span>}
          </Link>

          <Link to="/account" className="store-header__cart-badge" aria-label="My Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </Link>

          <button className="store-header__menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} className={`mobile-nav__link${pathname.startsWith(link.path) ? ' mobile-nav__link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mobile-nav__divider" />
            <Link to="/personalise" className="cta-personal" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
              ✦ Build My Toolkit
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
