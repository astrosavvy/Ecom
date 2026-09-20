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
  const { pathname } = useLocation()
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])
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
