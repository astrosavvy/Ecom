import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { destination, image, money, title } from './offerPresentation'

export default function GuideCompanions({ categories, onOrder }) {
  if (!categories?.length) return null
  return <section className="guide-secondary-chapters guide-companions" aria-labelledby="guide-companions-title">
    <div className="guide-secondary-chapters__header"><span className="guide-eyebrow">Complementary curations</span><h3 id="guide-companions-title">Across your other chapters</h3><p>Pieces to accompany the other intentions in your life.</p></div>
    <div className="guide-secondary-chapters__grid">
      {categories.map(category => <article key={category.intention} className="guide-secondary-chapter-card">
        <div className="guide-secondary-chapter-card__top"><span className="guide-secondary-chapter-card__badge">{category.categoryName}</span><span className="guide-secondary-chapter-card__sub">{category.subtitle}</span></div>
        {category.leadProduct && <div className="guide-secondary-chapter-card__body">
          {image(category.leadProduct) && <Link to={destination(category.leadProduct)} className="guide-secondary-chapter-card__image-link"><img src={image(category.leadProduct)} alt={category.leadProduct.title} /></Link>}
          <div className="guide-secondary-chapter-card__details"><h4><Link to={destination(category.leadProduct)}>{title(category.leadProduct.title)}</Link></h4><strong className="guide-secondary-chapter-card__price">{money(category.leadProduct.price)}</strong></div>
          {category.leadProduct.variantId && <button type="button" className="guide-secondary-chapter-card__btn" onClick={() => onOrder(category.leadProduct)} aria-label={`Order ${category.leadProduct.title}`}><ShoppingBag size={14} /> Order</button>}
        </div>}
      </article>)}
    </div>
  </section>
}
