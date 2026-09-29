import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ShopHero from '../components/shop/ShopHero'
import ShopDualFeatureTiles from '../components/shop/ShopDualFeatureTiles'
import ShopCatalog from '../components/shop/ShopCatalog'
import ShopIntentions from '../components/shop/ShopIntentions'
import ShopAmbientBanner from '../components/shop/ShopAmbientBanner'
import ShopInspiration from '../components/shop/ShopInspiration'
import ShopUspBar from '../components/shop/ShopUspBar'
import ShopNewsletter from '../components/shop/ShopNewsletter'
import ShopFooter from '../components/shop/ShopFooter'
import '../styles/Shop.css'

const FILTERS = [
  { id: 'all', label: 'All pieces' },
  { id: 'confidence-power', label: 'Courage & presence' },
  { id: 'vitality-balance', label: 'Growth & renewal' },
  { id: 'love-connection', label: 'Love & devotion' },
  { id: 'wealth-prosperity', label: 'Wisdom & harvest' },
  { id: 'protection', label: 'Instinct & focus' },
]

export default function Shop() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [wishlist, setWishlist] = useState([])
  const reducedMotion = useReducedMotion()

  const visible = activeFilter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.intention === activeFilter)

  function toggleWishlist(id) {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  function filterByIntention(id) {
    setActiveFilter(id)
    const target = document.getElementById('pieces')
    if (target) {
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: -90 })
      else target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="livora-shop">
      <div className="livora-shop__shell">
        <nav className="livora-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="livora-crumb__current">The Collection</span>
        </nav>

        <ShopHero />
        <ShopDualFeatureTiles />
        <ShopCatalog 
          filters={FILTERS}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          products={PRODUCTS}
          visibleProducts={visible}
          reducedMotion={reducedMotion}
          onWishlist={toggleWishlist}
          wishlist={wishlist}
        />
        <ShopIntentions onSelectIntention={filterByIntention} />
        <ShopAmbientBanner />
        <ShopInspiration />
        <ShopUspBar />
        <ShopNewsletter />
        <ShopFooter onSelectIntention={filterByIntention} />
      </div>
    </div>
  )
}
