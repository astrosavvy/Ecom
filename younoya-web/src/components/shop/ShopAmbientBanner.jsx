import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ShopAmbientBanner() {
  return (
    <section className="livora-ambient">
      <div className="livora-ambient__box">
        <div className="livora-ambient__copy">
          <span className="livora-kicker livora-kicker--gold">✧ SACRED MUHURTA CURATION</span>
          <h2>The Consecration Altar & Gift Hamper</h2>
          <p>
            A complete sensory ceremony. Each bespoke luxury hamper unites the consecrated brooch with 
            our solid metallic apple candle, raw amethyst crystal vessel, and personalized cotton rag 
            attunement scroll.
          </p>
          <Link to="/find-a-gift" className="livora-btn livora-btn--gold">
            Consult Aster for Bespoke Curation <ArrowRight size={15} />
          </Link>
        </div>
        <div className="livora-ambient__visual">
          <img 
            src="/media/younoya-hamper-macro-detail-16x9.jpg" 
            alt="YOUNOYA Bespoke Hamper Altar Close-up" 
            loading="lazy" 
          />
        </div>
      </div>
    </section>
  )
}
