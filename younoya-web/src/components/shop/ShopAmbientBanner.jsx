import { Link } from 'react-router-dom'

export default function ShopAmbientBanner() {
  return (
    <section className="livora-ambient-promo" aria-label="Limited Time Offer">
      <div className="livora-ambient-promo__card">
        <div className="livora-ambient-promo__copy">
          <span className="livora-ambient-promo__kicker">Limited Time Offer</span>
          <h2>
            Up to <em>25% Off</em><br />
            on Curated Bestsellers
          </h2>
          <p>
            Consecrated luxury gift hampers united with hand-poured botanical candles 
            and personalized celestial scrolls.
          </p>
          <div className="livora-ambient-promo__action">
            <Link to="/find-a-gift" className="livora-btn livora-btn--terracotta">
              Grab the Deal
            </Link>
            <span className="livora-promo-swirl">✦</span>
          </div>
        </div>

        <div className="livora-ambient-promo__visual">
          <div className="livora-promo-loop-bg" />
          <img 
            src="/media/younoya-hamper-hero-landscape-16x9.jpg" 
            alt="Consecrated Bestseller Hamper Lifestyle Setting" 
            loading="lazy" 
          />
        </div>
      </div>
    </section>
  )
}
