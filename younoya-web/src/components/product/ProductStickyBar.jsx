export default function ProductStickyBar({ product, onAdd, added }) {
  return (
    <div className="livora-sticky-bar">
      <div className="livora-sticky-bar__info">
        <strong>{product.name}</strong>
        <span>{product.price}</span>
      </div>
      <button 
        type="button" 
        className="livora-btn livora-btn--dark"
        onClick={() => onAdd(false)}
      >
        {added ? 'Added' : 'Add to Bag'}
      </button>
    </div>
  )
}
