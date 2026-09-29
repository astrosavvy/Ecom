import { Link } from 'react-router-dom'

export default function ShopAmbientBanner() {
  return (
    <section className="livora-ambient-promo" aria-label="A personal gift consultation">
      <div className="livora-ambient-promo__card">
        <div className="livora-ambient-promo__copy">
          <span className="livora-ambient-promo__kicker">A MORE PERSONAL WAY TO GIFT</span>
          <h2>
            Let the meaning<br />
            <em>find its match.</em>
          </h2>
          <p>Tell Younoya who it is for and what you wish to celebrate. We will guide you toward a piece with purpose.</p>
          <div className="livora-ambient-promo__action">
            <Link to="/find-a-gift" className="livora-btn livora-btn--gold">
              Let Younoya choose
            </Link>
            <span className="livora-promo-swirl">✦</span>
          </div>
        </div>

        <div className="livora-ambient-promo__visual">
          <div className="livora-promo-loop-bg" />
          <img 
            src="/media/intentions/love-devotion-light.jpg"
            alt="A red apple candle arranged in a sunlit Younoya setting"
            loading="lazy" 
          />
        </div>
      </div>
    </section>
  )
}
