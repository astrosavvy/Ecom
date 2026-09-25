import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { totalItems, setIsOpen } = useCart()
  const light = pathname === '/shop' || pathname === '/find-a-gift' || pathname.startsWith('/blog') || pathname.startsWith('/journal')
  return (
    <header className={`navbar${light ? ' navbar--light' : ''}`}>
      <Link className="navbar__brand" to="/" aria-label="Younoya home">
        <img src="/favicon.png" alt="Younoya" />
      </Link>
      <button className="navbar__cart" onClick={() => setIsOpen(true)} aria-label={`Open shopping bag with ${totalItems} items`}>
        <ShoppingBag size={24} strokeWidth={1.4} />
        {totalItems > 0 && <span>{totalItems}</span>}
      </button>
    </header>
  )
}
