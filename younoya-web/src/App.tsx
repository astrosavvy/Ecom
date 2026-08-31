import { useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { initScroll, ScrollTrigger } from './lib/scroll'
import { StoreProvider } from './lib/store'
import FilmStage from './sections/FilmStage'
import { Header, Rail, Cursor } from './sections/Header'
import Preloader from './sections/Preloader'
import StoreLayout from './store/StoreLayout'
import Journey from './store/pages/Journey'
import Explore from './store/pages/Explore'
import Shop from './store/pages/Shop'
import Product from './store/pages/Product'
import CartPage from './store/pages/CartPage'
import Checkout from './store/pages/Checkout'
import Order from './store/pages/Order'
import Account from './store/pages/Account'
import Blog from './store/pages/Blog'
import BlogPost from './store/pages/BlogPost'
import AdminApp from './admin/AdminApp'

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
      <h1 className="sr-only">Younoya — gifts chosen by the stars, from a neon-night vault</h1>
      {!gateGone && <Preloader done={gateOpen} />}
      <Header />
      <Rail />
      <Cursor />
      <main>
        <FilmStage stateRef={filmState} onProgress={onProgress} onReady={onReady} />
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

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<FilmHome />} />
        <Route element={<StoreLayout />}>
          <Route path="/journey" element={<Journey />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<Product />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/account" element={<Account />} />
          <Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogPost />} />
</Route>
<Route path="/admin/*" element={<AdminApp />} />
</Routes>
    </StoreProvider>
  )
}
