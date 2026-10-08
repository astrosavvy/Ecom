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
  wishlist,
  expanded,
  onExpand,
  searchActive,
  savedOnly,
  query,
  onQueryChange,
}) {
  const showTools = expanded || searchActive || savedOnly
  return (
    <section id="pieces" className="livora-catalog">
      <div className="livora-catalog__trending-head">
        <div className="livora-trending-title-row">
          <span className="livora-trending-line" />
          <h2>✦ The chosen pieces ✦</h2>
          <span className="livora-trending-line" />
        </div>
        <p>Festive rituals and symbolic keepsakes, each with a story of its own.</p>
      </div>

      {showTools && (
        <div className="livora-catalog__tools">
          {searchActive && <input className="livora-catalog__search" type="search" value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Search the collection" aria-label="Search the collection" autoFocus />}
          {savedOnly ? <p className="livora-catalog__saved-label">Your saved pieces</p> : (
            <div className="livora-filters" role="group" aria-label="Filter by intention">
              {filters.map(filter => {
                const count = filter.id === 'all' ? products.length : products.filter(p => p.intention === filter.id).length
                return <button key={filter.id} type="button" className={`livora-filters__pill ${activeFilter === filter.id ? 'is-active' : ''}`} onClick={() => onSelectFilter(filter.id)} aria-pressed={activeFilter === filter.id}>
                  {filter.label}<span>{String(count).padStart(2, '0')}</span>
                </button>
              })}
            </div>
          )}
        </div>
      )}

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
      {visibleProducts.length === 0 && <p className="livora-catalog__empty">{savedOnly ? 'No saved pieces yet. Tap the heart on a piece to keep it here.' : 'No pieces match this search. Try another name or intention.'}</p>}
      {!showTools && <button className="livora-catalog__more" type="button" onClick={onExpand}>Explore all {products.length} pieces <span aria-hidden="true">↗</span></button>}
    </section>
  )
}
