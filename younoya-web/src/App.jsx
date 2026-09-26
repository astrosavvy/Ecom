import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Shop from './pages/Shop'
import GiftFinder from './pages/GiftFinder'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import AdminApp from './admin/AdminApp'
import SeoHead from './seo/SeoHead'
import './styles/global.css'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/admin')) return
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

function JournalRedirect() {
  const { slug } = useParams()
  return <Navigate to={slug ? `/blog/${slug}` : '/blog'} replace />
}

function StoreNavigation() {
  const { pathname } = useLocation()
  if (pathname === '/' || pathname.startsWith('/admin')) return null
  return <><Navbar /><CartDrawer /></>
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll>
          <ScrollToTop />
          <SeoHead />
          <StoreNavigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/find-a-gift" element={<GiftFinder />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/journal" element={<Navigate to="/blog" replace />} />
              <Route path="/journal/:slug" element={<JournalRedirect />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </SmoothScroll>
      </CartProvider>
    </BrowserRouter>
  )
}
