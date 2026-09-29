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
      <div className="livora-catalog__head">
        <div>
          <span className="livora-kicker">THE COMPLETE CATALOG</span>
          <h2>The Ten Consecrated <em>Heirlooms.</em></h2>
        </div>
        <p>Every piece is individually numbered and accompanied by a signed Certificate of Consecration.</p>
      </div>

      <div className="livora-filters" role="group" aria-label="Filter by intention">
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

      <div className="livora-results-bar">
        <span>SHOWING {String(visibleProducts.length).padStart(2, '0')} PIECES</span>
        <span>HANDCRAFTED & CONSECRATED IN LIMITED BATCHES</span>
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
