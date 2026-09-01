import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../../lib/store'

const NAV_LINKS = [
  { label: 'Work', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Journal', path: '/journal' },
  { label: 'Personalise', path: '/personalise' },
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
      <header className="store-header dash-header" ref={ref} data-hidden="false">
        <Link to="/" className="store-header__brand dash-brand" aria-label="YOUNOYA — for every chapter">
          <img src="/younoya-gold.svg" alt="YOUNOYA for every chapter" className="store-header__logo" style={{ height: "36px", width: "auto" }} />
        </Link>

        <nav className="store-header__nav dash-nav" aria-label="Main navigation">
          {NAV_LINKS.map(link => {
            const active = pathname === link.path || pathname.startsWith(link.path + '/')
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={active ? 'page' : undefined}
                className={`store-header__link dash-nav-link${active ? ' store-header__link--active' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="store-header__actions dash-actions">
          <Link to="/cart" className="store-header__cart-badge" aria-label={`Cart (${cartCount} items)`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="store-header__cart-count">{cartCount}</span>}
          </Link>
          <Link to="/personalise" className="dash-cta">
            Begin your chart
            <span className="dash-cta__arrows" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: "-6px" }}><path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
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
          </nav>
        </div>
      )}
    </>
  )
}
