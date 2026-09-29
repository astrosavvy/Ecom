import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ShopHero from '../components/shop/ShopHero'
import ShopUspBar from '../components/shop/ShopUspBar'
import ShopIntentions from '../components/shop/ShopIntentions'
import ShopPhilosophyBento from '../components/shop/ShopPhilosophyBento'
import ShopAmbientBanner from '../components/shop/ShopAmbientBanner'
import ShopCatalog from '../components/shop/ShopCatalog'
import ShopPurpose from '../components/shop/ShopPurpose'
import ShopTestimonials from '../components/shop/ShopTestimonials'
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

  const featured = PRODUCTS.find(p => p.handle === 'the-golden-flight') || PRODUCTS[0]

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
        <ShopUspBar />
        <ShopIntentions onSelectIntention={filterByIntention} />
        <ShopPhilosophyBento featured={featured} />
        <ShopAmbientBanner />
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
        <ShopPurpose />
        <ShopTestimonials />
        <ShopNewsletter />
        <ShopFooter onSelectIntention={filterByIntention} />
      </div>
    </div>
  )
}
