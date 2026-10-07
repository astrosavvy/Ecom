import { Link, useLocation } from 'react-router-dom'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { totalItems, setIsOpen } = useCart()
  const light = !pathname.startsWith('/admin')
  const shop = pathname === '/shop' || pathname === '/'
  const guide = pathname === '/find-a-gift'
  const fullNavigation = light && !guide

  return (
    <header className={`navbar${light ? ' navbar--light' : ''}${shop ? ' navbar--shop' : ''}${guide ? ' navbar--guide' : ''}`}>
      <div className="navbar__left">
        <Link className="navbar__brand" to="/" aria-label="Younoya home">
          <img src="/brand-legacy.webp" alt="Younoya" />
        </Link>
      </div>

      {fullNavigation && (
        <nav className="navbar__center" aria-label="Main navigation">
          <Link to="/" className="navbar__nav-link">Home</Link>
          <Link to="/shop#pieces" className={`navbar__nav-link ${pathname === '/shop' ? 'is-active' : ''}`}>Shop</Link>
          <Link to="/find-a-gift" className={`navbar__nav-link ${pathname === '/find-a-gift' ? 'is-active' : ''}`}>
            Gift guide
          </Link>
          <Link to="/blog" className={`navbar__nav-link ${pathname.startsWith('/blog') ? 'is-active' : ''}`}>
            Journal
          </Link>
          <Link to="/contact" className="navbar__nav-link">Contact</Link>
        </nav>
      )}

      <div className="navbar__right">
        {fullNavigation && (
          <>
            <Link to="/shop?search=1#pieces" className="navbar__icon-link" aria-label="Search collection">
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/shop?saved=1#pieces" className="navbar__icon-link" aria-label="Saved pieces">
              <Heart size={18} strokeWidth={1.5} />
            </Link>
          </>
        )}
        <button 
          className="navbar__cart" 
          onClick={() => setIsOpen(true)} 
          aria-label={`Open shopping bag with ${totalItems} items`}
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
          {guide && <span className="navbar__cart-label">Bag</span>}
          {totalItems > 0 && <span className="navbar__cart-count">{totalItems}</span>}
        </button>
        {fullNavigation && (
          <Link to="/shop#pieces" className="navbar__cta-btn">
            Shop Now
          </Link>
        )}
      </div>
    </header>
  )
}
