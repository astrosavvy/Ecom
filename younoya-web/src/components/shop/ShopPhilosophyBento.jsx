import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ShopPhilosophyBento({ featured }) {
  if (!featured) return null

  return (
    <section className="livora-bento">
      <div className="livora-bento__inner">
        <div className="livora-bento__copy">
          <span className="livora-kicker">✧ OUR BRAND PHILOSOPHY</span>
          <h2>Objects of intention that <em>transform your rituals.</em></h2>
          <p>
            We believe that everyday objects should carry soul. In an era of mass-produced 
            disposability, YOUNOYA returns to the timeless art of intentional gifting and ancestral reverence.
          </p>
          <p>
            Each talisman is not merely jewelry—it is an energetic anchor, consecrated under strict Vedic 
            muhurtas through 108 Gayatri recitations, cleansed in pure Himalayan waters, and sealed with 
            anti-tarnish ceramic luster.
          </p>
          <Link to="/blog" className="livora-bento__link">
            Read Our Story in The Journal <ArrowRight size={16} />
          </Link>
        </div>

        <div className="livora-bento__spotlight">
          <div className="livora-spotlight-card">
            <div className="livora-spotlight-card__image">
              <img src={featured.cardImage || featured.primaryImage} alt={featured.name} />
            </div>
            <div className="livora-spotlight-card__info">
              <div className="livora-spotlight-card__head">
                <div>
                  <small className="livora-kicker">CONSECRATION I</small>
                  <h3>{featured.name}</h3>
                </div>
                <strong>{featured.price}</strong>
              </div>
              <p>{featured.subtitle}</p>
              <div className="livora-spotlight-card__swatches">
                <span className="swatch swatch--gold" title="24K Warm Gold Finish" />
                <span className="swatch swatch--crystal" title="Celestial White Crystals" />
                <span className="swatch swatch--brass" title="Jewelers Brass" />
                <small>Surya (Sun) • Fire Element</small>
              </div>
              <Link to={`/product/${featured.handle}`} className="livora-btn livora-btn--dark livora-btn--full">
                View Consecrated Piece <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
