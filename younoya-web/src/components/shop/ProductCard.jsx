import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Heart, Star } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product, index, reducedMotion, onWishlist, isWishlisted }) {
  const { addToCart, setIsOpen } = useCart()
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: `${product.id}::standard`,
      handle: product.handle,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.cardImage || product.primaryImage,
      chapter: 'Younoya brooch',
    }, 1)
    setAdded(true)
    setIsOpen(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.article
      className="livora-card"
      layout={!reducedMotion}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.18) }}
    >
      <div className="livora-card__media">
        <Link to={`/product/${product.handle}`} className="livora-card__link" aria-label={`Explore ${product.name}`}>
          <img src={product.cardImage || product.primaryImage} alt={product.subtitle} loading={index < 3 ? 'eager' : 'lazy'} />
        </Link>
        <span className="livora-card__badge">{product.motif}</span>
        <button
          type="button"
          className={`livora-card__wish ${isWishlisted ? 'is-active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            onWishlist(product.id)
          }}
          aria-label={isWishlisted ? "Remove from saved" : "Save piece"}
        >
          <Heart size={18} fill={isWishlisted ? "#A31517" : "none"} stroke={isWishlisted ? "#A31517" : "#594D42"} />
        </button>
      </div>

      <div className="livora-card__body">
        <div className="livora-card__meta">
          <div className="livora-card__rating">
            <div className="livora-card__stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="#B8860B" stroke="none" />
              ))}
            </div>
            <span>4.9 (40+)</span>
          </div>
          <span className="livora-card__chapter">No. {product.chapter}</span>
        </div>

        <Link to={`/product/${product.handle}`} className="livora-card__title">
          <h3>{product.name}</h3>
        </Link>
        <p className="livora-card__sub">{product.subtitle}</p>

        <div className="livora-card__price-row">
          <strong className="livora-card__price">{product.price}</strong>
        </div>

        <div className="livora-card__actions">
          <button type="button" className={`livora-card__btn-add ${added ? 'is-added' : ''}`} onClick={handleQuickAdd}>
            {added ? <><Check size={15} /> Added</> : 'Add to Bag'}
          </button>
          <Link to={`/product/${product.handle}`} className="livora-card__btn-view">
            Details <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
