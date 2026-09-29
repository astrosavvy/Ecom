import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ShopAmbientBanner() {
  return (
    <section className="livora-ambient">
      <div className="livora-ambient__box">
        <div className="livora-ambient__copy">
          <span className="livora-kicker livora-kicker--gold">✧ NEW ARRIVAL</span>
          <h2>The Consecration Altar & Gift Hamper</h2>
          <p>
            Flexible, intentional and consecrated for real life. Each bespoke luxury hamper unites 
            the consecrated brooch with our solid metallic apple candle and celestial attunement scroll.
          </p>
          <Link to="/find-a-gift" className="livora-btn livora-btn--gold">
            Discover Collection <ArrowRight size={15} />
          </Link>
        </div>

        <div className="livora-ambient__visual">
          <img 
            src="/media/younoya-hamper-macro-detail-16x9.jpg" 
            alt="YOUNOYA Bespoke Hamper Altar Close-up" 
            loading="lazy" 
          />
          <div className="livora-ambient__nav-arrows">
            <button type="button" aria-label="Previous image"><ChevronLeft size={16} /></button>
            <button type="button" aria-label="Next image"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
