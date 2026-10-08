import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product, index, reducedMotion, onWishlist, isWishlisted }) {
  const { addToCart, setIsOpen } = useCart()
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (product.kind === 'ritual-box') return
    addToCart({
      id: `${product.id}::standard`,
      handle: product.handle,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.cardImage || product.primaryImage,
      chapter: product.kind === 'ritual-box' ? 'Navratri ritual box' : 'Younoya brooch',
    }, 1)
    setAdded(true)
    setIsOpen(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      className="livora-card"
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 10 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.15) }}
    >
      <div className="livora-card__media">
        <Link to={`/product/${product.handle}`} className="livora-card__link" aria-label={`Explore ${product.name}`}>
          <img src={product.shopCardImage || product.cardImage || product.primaryImage} alt={product.name} loading={index < 5 ? 'eager' : 'lazy'} />
        </Link>
        {product.kind !== 'ritual-box' && <button
          type="button"
          className={`livora-card__quick-bag ${added ? 'is-added' : ''}`}
          onClick={handleQuickAdd}
          aria-label="Add to bag"
          title="Add to bag"
        >
          {added ? <Check size={14} /> : <ShoppingBag size={14} />}
        </button>}
      </div>

      <div className="livora-card__body">
        <Link to={`/product/${product.handle}`} className="livora-card__title">
          <h3>{product.shopName}</h3>
        </Link>
        <p className="livora-card__descriptor">{product.subtitle}</p>

        <div className="livora-card__price-row">
          <strong className="livora-card__price">{product.price}</strong>
          <button
            type="button"
            className={`livora-card__wish ${isWishlisted ? 'is-active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              onWishlist(product.id)
            }}
            aria-label={isWishlisted ? "Remove from saved" : "Save piece"}
          >
            <Heart size={16} fill={isWishlisted ? "#A31517" : "none"} stroke={isWishlisted ? "#A31517" : "#8C7E72"} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
