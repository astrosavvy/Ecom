import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ShopPhilosophyBento({ featured }) {
  if (!featured) return null

  return (
    <section className="livora-bento">
      <div className="livora-bento__inner">
        {/* Left Column: Editorial Philosophy */}
        <div className="livora-bento__copy">
          <span className="livora-kicker">✧ CRAFTED TO INSPIRE</span>
          <h2>Objects of intention that <em>transform your rituals.</em></h2>
          <p>
            Each piece is thoughtfully designed and meticulously crafted to bring elegance, 
            sacred reverence, and intentional poise to your everyday journey.
          </p>
          <Link to="/blog" className="livora-bento__link">
            About Our Process <ArrowRight size={16} />
          </Link>
        </div>

        {/* Center Column: Clean Featured Brooch Visual */}
        <div className="livora-bento__center-media">
          <img 
            src={featured.cardImage || featured.primaryImage} 
            alt={featured.name} 
            loading="lazy" 
          />
        </div>

        {/* Right Column: Product Spotlight Info & CTA */}
        <div className="livora-bento__product-info">
          <div className="livora-bento__product-title">
            <h3>{featured.name}</h3>
            <strong>{featured.price}</strong>
          </div>
          <p className="livora-bento__product-desc">
            A wearable talisman of solar triumph, sovereign confidence, and personal rebirth.
          </p>
          <div className="livora-bento__swatches">
            <span className="swatch swatch--gold" title="24K Warm Gold Finish" />
            <span className="swatch swatch--crystal" title="Celestial White Crystals" />
            <span className="swatch swatch--brass" title="Jewelers Brass" />
          </div>
          <Link to={`/product/${featured.handle}`} className="livora-btn livora-btn--dark livora-btn--full">
            View Consecrated Piece <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
