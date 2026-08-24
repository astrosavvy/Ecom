import { Link, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useStore } from "../lib/store"

export default function StoreLayout() {
  const { cartCount, customer, logout } = useStore()
  const nav = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="store">
      <header className={`store__header${scrolled ? " store__header--scrolled" : ""}`}>
        <Link to="/" className="store__brand" aria-label="Younoya home">
          <span className="store__brandmark" />
        </Link>
        <nav className="store__nav">
          <Link to="/journey">Begin Journey</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/blog">Journal</Link>
          {customer ? <Link to="/account">Account</Link> : <Link to="/journey">Login</Link>}
        </nav>
        <div className="store__actions">
          {customer && (
            <button
              className="store__ghost"
              onClick={() => {
                logout()
                nav("/")
              }}
            >
              Logout
            </button>
          )}
          <Link to="/cart" className="store__cart" aria-label="Cart">
            Cart{cartCount > 0 && <em>{cartCount}</em>}
          </Link>
        </div>
      </header>

      <main className="store__main">
        <Outlet />
      </main>

      <footer className="store__footer">
        <span>© {new Date().getFullYear()} Younoya</span>
        <span>Consecrated gifting beneath the neon sky</span>
        <Link to="/blog">Journal</Link>
      </footer>
    </div>
  )
}
