import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import SmoothScroll from './components/SmoothScroll'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll>
          <Navbar />
          <CartDrawer />
          <main><Routes><Route path="/" element={<Home />} /></Routes></main>
        </SmoothScroll>
      </CartProvider>
    </BrowserRouter>
  )
}
