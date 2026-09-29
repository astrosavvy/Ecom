import { Link, useLocation } from 'react-router-dom'
import { Heart, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { totalItems, setIsOpen } = useCart()
  const light = pathname === '/shop' || pathname === '/find-a-gift' || pathname.startsWith('/product/') || pathname.startsWith('/blog')

  return (
    <header className={`navbar${light ? ' navbar--light' : ''}`}>
      <div className="navbar__left">
        <Link className="navbar__brand" to="/" aria-label="Younoya home">
          <img src="/favicon.png" alt="Younoya" />
          <span className="navbar__brand-name">YOUNOYA</span>
        </Link>
      </div>

      {light && (
        <nav className="navbar__center" aria-label="Main navigation">
          <Link to="/shop" className={`navbar__nav-link ${pathname === '/shop' ? 'is-active' : ''}`}>
            Home
          </Link>
          <Link to="/shop#pieces" className="navbar__nav-link">Shop</Link>
          <Link to="/find-a-gift" className={`navbar__nav-link ${pathname === '/find-a-gift' ? 'is-active' : ''}`}>
            Collections
          </Link>
          <Link to="/blog" className={`navbar__nav-link ${pathname.startsWith('/blog') ? 'is-active' : ''}`}>
            Journal
          </Link>
        </nav>
      )}

      <div className="navbar__right">
        {light && (
          <>
            <Link to="/shop#pieces" className="navbar__icon-link" aria-label="Search collection">
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/shop#pieces" className="navbar__icon-link" aria-label="Saved pieces">
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
          {totalItems > 0 && <span>{totalItems}</span>}
        </button>
        {light && (
          <Link to="/shop#pieces" className="navbar__cta-btn">
            Shop Now
          </Link>
        )}
      </div>
    </header>
  )
}
