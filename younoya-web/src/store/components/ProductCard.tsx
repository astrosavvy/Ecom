import { Link } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"
import { useState } from "react"

type Props = {
  product: api.Product
  showPersonaliseBadge?: boolean
  showQuickAdd?: boolean
  compact?: boolean
}

export default function ProductCard({ product, showPersonaliseBadge = true, showQuickAdd = true, compact = false }: Props) {
  const { addToCart } = useStore()
  const [adding, setAdding] = useState(false)
  const price = api.variantPrice(product).amount

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const variant = product.variants?.[0]
    if (!variant) return
    setAdding(true)
    try { await addToCart(variant.id) } finally { setAdding(false) }
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.handle}`}>
        <div className="product-card__image-wrap">
          <img src={product.thumbnail ?? ""} alt={product.title} className="product-card__image" loading="lazy" />
          {showPersonaliseBadge && <span className="product-card__badge">Personalise</span>}
        </div>
      </Link>
      <div className="product-card__info">
        <Link to={`/product/${product.handle}`}>
          <h3 className="product-card__name" style={compact ? { fontSize: '0.9375rem' } : undefined}>{product.title}</h3>
        </Link>
        {!compact && product.subtitle && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-soft)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
            {product.subtitle}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span className="product-card__price">{api.formatINR(price)}</span>
          {showQuickAdd && (
            <button className="cta-personal" style={{ padding: '5px 12px', fontSize: '0.5625rem' }} onClick={handleAdd} disabled={adding}>
              {adding ? '…' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
