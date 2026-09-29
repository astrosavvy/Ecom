import { AnimatePresence, motion } from 'framer-motion'
import ProductCard from './ProductCard'

export default function ShopCatalog({ 
  filters, 
  activeFilter, 
  onSelectFilter, 
  products, 
  visibleProducts, 
  reducedMotion, 
  onWishlist, 
  wishlist 
}) {
  return (
    <section id="pieces" className="livora-catalog">
      <div className="livora-catalog__trending-head">
        <div className="livora-trending-title-row">
          <span className="livora-trending-line" />
          <h2>✦ Trending Heirlooms ✦</h2>
          <span className="livora-trending-line" />
        </div>
        <p>Handpicked astrology-backed essentials to upgrade your daily ritual.</p>
      </div>

      <div className="livora-filters" role="group" aria-label="Filter by chapter">
        {filters.map(filter => {
          const count = filter.id === 'all' 
            ? products.length 
            : products.filter(p => p.intention === filter.id).length
          return (
            <button
              key={filter.id}
              type="button"
              className={`livora-filters__pill ${activeFilter === filter.id ? 'is-active' : ''}`}
              onClick={() => onSelectFilter(filter.id)}
            >
              {filter.label}
              <span>{String(count).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>

      <motion.div layout={!reducedMotion} className="livora-grid">
        <AnimatePresence mode="popLayout">
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              reducedMotion={reducedMotion}
              onWishlist={onWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
