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
            <h3>Sacred & Functional</h3>
            <p>Keep talismans, consecration scrolls & daily intentions organized in one serene, consecrated spot.</p>
          </div>
          <div className="livora-feature-tile__media">
            <img src="/media/intentions/love-devotion-light.jpg" alt="Botanical apple candle and consecration tray" loading="lazy" />
          </div>
        </div>

        <div className="livora-feature-tile">
          <div className="livora-feature-tile__copy">
            <span className="livora-feature-tile__badge">
              <Feather size={18} strokeWidth={2.2} />
            </span>
            <h3>Vedic Craftsmanship</h3>
            <p>24K gold electroplate, untreated raw gemstone talismans & clean soy wax hand-poured in our atelier.</p>
          </div>
          <div className="livora-feature-tile__media">
            <img src="/media/intentions/courage-presence-light.jpg" alt="24K gold jaguar talisman detail" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
