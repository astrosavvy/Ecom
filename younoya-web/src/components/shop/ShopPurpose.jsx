import { Compass, Gift, ShieldCheck, Sparkles } from 'lucide-react'

export default function ShopPurpose() {
  return (
    <section className="livora-purpose" aria-label="Why Choose YOUNOYA">
      <div className="livora-purpose__split">
        <div className="livora-purpose__lead">
          <span className="livora-kicker">✦ WHY CHOOSE YOUNOYA</span>
          <h2>Gifting with<br /><em>sacred purpose.</em></h2>
        </div>

        <div className="livora-purpose__items">
          <div className="livora-purpose__item">
            <span className="livora-purpose__icon"><Compass size={22} strokeWidth={1.5} /></span>
            <div>
              <strong>Vedic Astrological Attunement</strong>
              <p>Selected and sanctified for planetary hours, zodiac signs, and lunar muhurtas.</p>
            </div>
          </div>
          <div className="livora-purpose__item">
            <span className="livora-purpose__icon"><Sparkles size={22} strokeWidth={1.5} /></span>
            <div>
              <strong>108× Consecration Ritual</strong>
              <p>Purified in natural Himalayan spring water and 108 recitations of sacred mantras.</p>
            </div>
          </div>
          <div className="livora-purpose__item">
            <span className="livora-purpose__icon"><ShieldCheck size={22} strokeWidth={1.5} /></span>
            <div>
              <strong>Heirloom Metallurgy</strong>
              <p>Cast in jewelers brass with 24K electroplated gold luster and ceramic seal.</p>
            </div>
          </div>
          <div className="livora-purpose__item">
            <span className="livora-purpose__icon"><Gift size={22} strokeWidth={1.5} /></span>
            <div>
              <strong>Sacred Unboxing</strong>
              <p>Housed in rigid obsidian box with silk velvet pouch and blessing scroll.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
