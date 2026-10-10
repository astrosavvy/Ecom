import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext'
import { POLICY_ROUTES } from './data/policies'
import PolicyPage from './pages/PolicyPage'
import CustomerOrders from './pages/CustomerOrders'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Shop from './pages/Shop'
import GiftFinder from './pages/GiftFinder'
import Checkout from './pages/Checkout'
import PrivateOffer from './pages/PrivateOffer'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import AdminApp from './admin/AdminApp'
import SeoHead from './seo/SeoHead'
import NavratriPixel from './components/NavratriPixel'
import './styles/global.css'
import './styles/MobileLayout.css'

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
  const { storefrontMode, loading } = useSiteConfig()
  const comingSoon = pathname === '/' && (loading || storefrontMode === 'coming-soon')
  const lightStorefront = !comingSoon && !pathname.startsWith('/admin')
  useEffect(() => {
    document.documentElement.classList.toggle('store-light', lightStorefront)
    return () => document.documentElement.classList.remove('store-light')
  }, [lightStorefront])
  if (comingSoon || pathname.startsWith('/admin')) return null
  return <><Navbar /><CartDrawer /></>
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteConfigProvider><CartProvider>
        <SmoothScroll>
          <ScrollToTop />
          <SeoHead />
          <NavratriPixel />
          <StoreNavigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/find-a-gift" element={<GiftFinder />} />
              <Route path="/checkout" element={<Checkout />} />
              {Object.keys(POLICY_ROUTES).map(path => <Route key={path} path={path} element={<PolicyPage />} />)}
              <Route path="/account/orders" element={<CustomerOrders />} />
              <Route path="/account/orders/:id" element={<CustomerOrders />} />
              <Route path="/offer/:handle" element={<PrivateOffer />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/journal" element={<Navigate to="/blog" replace />} />
              <Route path="/journal/:slug" element={<JournalRedirect />} />
              <Route path="/product/solar-embrace" element={<Navigate to="/product/wild-poise" replace />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </SmoothScroll>
      </CartProvider></SiteConfigProvider>
    </BrowserRouter>
  )
}
