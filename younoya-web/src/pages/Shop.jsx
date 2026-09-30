import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import ShopHero from '../components/shop/ShopHero'
import ShopDualFeatureTiles from '../components/shop/ShopDualFeatureTiles'
import ShopCatalog from '../components/shop/ShopCatalog'
import ShopAmbientBanner from '../components/shop/ShopAmbientBanner'
import ShopInspiration from '../components/shop/ShopInspiration'
import ShopFooter from '../components/shop/ShopFooter'
import '../styles/Shop.css'
import '../styles/ShopFooter.css'

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
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('younoya-saved-pieces') || '[]')
      return Array.isArray(saved) ? saved : []
    }
    catch { return [] }
  })
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [searchParams] = useSearchParams()
  const reducedMotion = useReducedMotion()
  const searchActive = searchParams.has('search')
  const savedOnly = searchParams.has('saved')

  useEffect(() => {
    localStorage.setItem('younoya-saved-pieces', JSON.stringify(wishlist))
  }, [wishlist])

  const matching = PRODUCTS.filter(product =>
    (activeFilter === 'all' || product.intention === activeFilter) &&
    (!savedOnly || wishlist.includes(product.id)) &&
    (!query || `${product.name} ${product.subtitle} ${product.motif}`.toLowerCase().includes(query.toLowerCase()))
  )
  const visible = expanded || activeFilter !== 'all' || searchActive || savedOnly
    ? matching
    : matching.slice(0, 5)

  function toggleWishlist(id) {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id])
  }

  return (
    <div className="livora-shop" id="shop-top">
      <div className="livora-shop__shell">
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
          expanded={expanded}
          onExpand={() => setExpanded(true)}
          searchActive={searchActive}
          savedOnly={savedOnly}
          query={query}
          onQueryChange={setQuery}
        />
        <ShopAmbientBanner />
        <ShopInspiration />
      </div>
      <ShopFooter />
    </div>
  )
}
