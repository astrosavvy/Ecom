import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Star } from 'lucide-react'

export default function ProductRelated({ related }) {
  if (!related || related.length === 0) return null

  return (
    <section className="livora-related">
      <div className="livora-related__head">
        <div>
          <span className="livora-kicker">STORIES THAT SIT TOGETHER</span>
          <h2>Complete the <em>ritual.</em></h2>
        </div>
        <Link to="/shop" className="livora-link-more">
          View All Pieces <ArrowRight size={15} />
        </Link>
      </div>

      <div className="livora-grid">
        {related.map((item) => (
          <div key={item.id} className="livora-card">
            <div className="livora-card__media">
              <Link to={`/product/${item.handle}`} className="livora-card__link">
                <img src={item.cardImage || item.primaryImage} alt={item.name} loading="lazy" />
              </Link>
              <span className="livora-card__badge">{item.motif}</span>
            </div>
            <div className="livora-card__body">
              <div className="livora-card__meta">
                <div className="livora-card__rating">
                  <div className="livora-card__stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#B8860B" stroke="none" />
                    ))}
                  </div>
                  <span>4.9</span>
                </div>
                <span className="livora-card__chapter">No. {item.chapter}</span>
              </div>
              <Link to={`/product/${item.handle}`} className="livora-card__title">
                <h3>{item.name}</h3>
              </Link>
              <p className="livora-card__sub">{item.subtitle}</p>
              <div className="livora-card__price-row">
                <strong className="livora-card__price">{item.price}</strong>
                <span className="livora-card__tax">Tax included</span>
              </div>
              <div className="livora-card__actions">
                <Link to={`/product/${item.handle}`} className="livora-btn livora-btn--dark livora-btn--full">
                  Explore Piece <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
