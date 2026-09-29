import { Check, Feather } from 'lucide-react'

export default function ShopDualFeatureTiles() {
  return (
    <section className="livora-dual-features" aria-label="Core Craftsmanship">
      <div className="livora-dual-features__grid">
        <div className="livora-feature-tile">
          <div className="livora-feature-tile__copy">
            <span className="livora-feature-tile__badge">
              <Check size={18} strokeWidth={2.4} />
            </span>
            <h3>Beautifully symbolic</h3>
            <p>Each motif carries a thought worth keeping close, from courage to renewal.</p>
          </div>
          <div className="livora-feature-tile__media">
            <img src="/media/intentions/love-devotion-light.jpg" alt="Younoya apple candle in a warm atelier setting" loading="lazy" />
          </div>
        </div>

        <div className="livora-feature-tile">
          <div className="livora-feature-tile__copy">
            <span className="livora-feature-tile__badge">
              <Feather size={18} strokeWidth={2.2} />
            </span>
            <h3>Chosen with intention</h3>
            <p>Astrological insight helps connect a meaningful moment with the right symbol.</p>
          </div>
          <div className="livora-feature-tile__media">
            <img src="/media/shop-wild-poise-editorial.webp" alt="Wild Poise jaguar brooch on stone" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
