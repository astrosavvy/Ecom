import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { totalItems, setIsOpen } = useCart()
  const light = pathname === '/shop' || pathname === '/find-a-gift' || pathname.startsWith('/product/') || pathname.startsWith('/blog') || pathname.startsWith('/journal')

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
            The Collection
          </Link>
          <Link to="/find-a-gift" className={`navbar__nav-link ${pathname === '/find-a-gift' ? 'is-active' : ''}`}>
            Find a Gift
          </Link>
          <Link to="/blog" className={`navbar__nav-link ${pathname.startsWith('/blog') ? 'is-active' : ''}`}>
            The Journal
          </Link>
        </nav>
      )}

      <div className="navbar__right">
        {light && (
          <Link to="/find-a-gift" className="navbar__cta-btn">
            Consult Aster <ArrowRight size={13} />
          </Link>
        )}
        <button 
          className="navbar__cart" 
          onClick={() => setIsOpen(true)} 
          aria-label={`Open shopping bag with ${totalItems} items`}
        >
          <ShoppingBag size={22} strokeWidth={1.4} />
          {totalItems > 0 && <span>{totalItems}</span>}
        </button>
      </div>
    </header>
  )
}
