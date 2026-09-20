import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import './styles/global.css'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let id = ''
      try { id = decodeURIComponent(hash.slice(1)) } catch { /* Ignore malformed external hashes. */ }
      const element = id ? document.getElementById(id) : null
      if (window.__lenis) window.__lenis.scrollTo(element || 0, { immediate: true, offset: element ? -80 : 0 })
      else window.scrollTo(0, element ? window.scrollY + element.getBoundingClientRect().top - 80 : 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}
export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll>
          <ScrollToTop />
          <Navbar />
          <CartDrawer />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
            </Routes>
          </main>
        </SmoothScroll>
      </CartProvider>
    </BrowserRouter>
  )
}
