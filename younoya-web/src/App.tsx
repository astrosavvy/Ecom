import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react'
import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom'
import { initScroll, ScrollTrigger } from './lib/scroll'
import { StoreProvider } from './lib/store'
import StoreLayout from './store/StoreLayout'
import { Header, Rail, Cursor } from './sections/Header'
const FilmStage = lazy(() => import('./sections/FilmStage'))
const Preloader = lazy(() => import('./sections/Preloader'))
import HomePage from './store/pages/HomePage'
import Shop from './store/pages/Shop'
import Product from './store/pages/Product'
import CartPage from './store/pages/CartPage'
import Checkout from './store/pages/Checkout'
import Order from './store/pages/Order'
import Account from './store/pages/Account'
import AdminApp from './admin/AdminApp'

const Configurator = lazy(() => import('./store/pages/Configurator'))
const PersonaliseFlow = lazy(() => import('./store/pages/PersonaliseFlow'))
const Journal = lazy(() => import('./store/pages/Journal'))
const JournalArticle = lazy(() => import('./store/pages/JournalArticle'))
const About = lazy(() => import('./store/pages/About'))

function FilmHome() {
  const filmState = useRef({ t: 0, vel: 0 })
  const [ready, setReady] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [gateGone, setGateGone] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    initScroll()
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!ready) return
    const open = window.setTimeout(() => setGateOpen(true), 500)
    const gone = window.setTimeout(() => setGateGone(true), 1750)
    return () => {
      window.clearTimeout(open)
      window.clearTimeout(gone)
    }
  }, [ready])

  const onProgress = useCallback(() => setReady(true), [])
  const onReady = useCallback(() => setReady(true), [])

  return (
    <div id="top">
      <h1 className="sr-only">YOUNOYA — Personalised gifting. Personal meaning.</h1>
      <Suspense fallback={null}>{!gateGone && <Preloader done={gateOpen} />}</Suspense>
      <Header />
      <Rail />
      <Cursor />
      <main>
        <Suspense fallback={<div style={{ height: '100vh', background: '#07080E' }} />}>
          <FilmStage stateRef={filmState} onProgress={onProgress} onReady={onReady} />
        </Suspense>
      </main>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const SuspenseFallback = <div className="section" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--ink-soft)' }}>Loading...</p></div>

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <Routes>
        {/* Cinematic WebGL film experience (legacy) */}
        <Route path="/film" element={<FilmHome />} />

        {/* Main storefront with header + footer */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gifts" element={<Navigate to="/shop" replace />} />
          <Route path="/products/:handle" element={<Navigate to="/product/:handle" replace />} />
          <Route path="/product/:handle" element={<Product />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />

          {/* Personalisation — Cartier-style configurator */}
          <Route path="/personalise" element={<Suspense fallback={SuspenseFallback}><Configurator /></Suspense>} />
          <Route path="/personalise-legacy" element={<Suspense fallback={SuspenseFallback}><PersonaliseFlow /></Suspense>} />

          {/* Journal */}
          <Route path="/journal" element={<Suspense fallback={SuspenseFallback}><Journal /></Suspense>} />
          <Route path="/journal/category/:category" element={<Suspense fallback={SuspenseFallback}><Journal /></Suspense>} />
          <Route path="/journal/:slug" element={<Suspense fallback={SuspenseFallback}><JournalArticle /></Suspense>} />

          {/* Account & Dashboard */}
          <Route path="/account" element={<Account />} />
          <Route path="/account/toolkits" element={<Account />} />
          <Route path="/account/recipients" element={<Account />} />
          <Route path="/account/wishlist" element={<Account />} />

          {/* About */}
          <Route path="/about" element={<Suspense fallback={SuspenseFallback}><About /></Suspense>} />
          <Route path="*" element={<div className="page" style={{ textAlign: 'center', padding: '80px 20px' }}><h1 style={{ fontFamily: 'var(--yn-font-display)', fontSize: '32px', color: '#1a1a1e' }}>Page not found</h1><p style={{ marginTop: 12, fontFamily: 'var(--yn-font-body)', color: '#6b645c' }}>The chapter you seek has moved. <Link to="/" style={{ color: 'var(--yn-gold-strong)', textDecoration: 'underline' }}>Back to home</Link></p></div>} />

          {/* Legacy routes (kept for backward compatibility) */}
          <Route path="/journey" element={<Navigate to="/personalise?chapter=threshold" replace />} />
          <Route path="/explore" element={<Navigate to="/personalise?chapter=reveal" replace />} />
          <Route path="/blog" element={<Navigate to="/journal" replace />} />
          <Route path="/blog/:slug" element={<Navigate to="/journal/:slug" replace />} />
        </Route>

        {/* Admin console */}
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </StoreProvider>
  )
}
