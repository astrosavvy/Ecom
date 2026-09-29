import { Minus, Plus, Trash2 } from 'lucide-react'
import { getProductByHandle } from '../../data/products'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = (item.priceNum * item.quantity).toLocaleString('en-IN')
  const product = getProductByHandle(item.handle || item.id?.split('::')[0])
  const image = product?.shopCardImage || item.image

  return (
    <div className="cart-item">
      <div className="cart-item__img-box">
        {image ? (
          <img src={image} alt={item.name} loading="lazy" />
        ) : (
          <span className="cart-item__emoji">{item.emoji || '✦'}</span>
        )}
      </div>
      <div className="cart-item__details">
        <div className="cart-item__top">
          <span className="cart-item__sign">{item.sign || item.tag || 'Consecrated'}</span>
          <button
            type="button"
            className="cart-item__remove"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from bag`}
            title="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
        <h4 className="cart-item__title">{item.name}</h4>
        <p className="cart-item__chapter">
          {(item.chapter || 'Personal selection').replace(/Chapter/gi, 'Object')}
        </p>
        {item.personalNote && (
          <p className="cart-item__personal-note">Note: “{item.personalNote}”</p>
        )}
        <div className="cart-item__bottom">
          <div className="cart-item__qty" aria-label="Quantity selector">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, 1)}
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>
          <span className="cart-item__price">₹{lineTotal}</span>
        </div>
      </div>
    </div>
  )
}
