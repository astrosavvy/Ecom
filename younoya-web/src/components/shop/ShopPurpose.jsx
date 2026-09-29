import { Compass, Gift, ShieldCheck, Sparkles } from 'lucide-react'

export default function ShopPurpose() {
  return (
    <section className="livora-purpose">
      <div className="livora-purpose__header">
        <span className="livora-kicker">WHY CHOOSE YOUNOYA</span>
        <h2>Gifting with <em>sacred purpose.</em></h2>
      </div>

      <div className="livora-purpose__grid">
        <div className="livora-purpose__card">
          <div className="livora-purpose__icon"><Compass size={24} /></div>
          <h3>Vedic Astrological Attunement</h3>
          <p>Each brooch is selected and sanctified with awareness of planetary hours, zodiac signs, and lunar muhurtas.</p>
        </div>
        <div className="livora-purpose__card">
          <div className="livora-purpose__icon"><Sparkles size={24} /></div>
          <h3>108× Consecration Ritual</h3>
          <p>Purified in natural Himalayan spring water, holy sandalwood smoke, and 108 recitations of ancient Gayatri mantras.</p>
        </div>
        <div className="livora-purpose__card">
          <div className="livora-purpose__icon"><ShieldCheck size={24} /></div>
          <h3>Heirloom Metallurgy</h3>
          <p>Cast in high-density jewelers brass with 24K electroplated gold luster and ceramic anti-tarnish protective coating.</p>
        </div>
        <div className="livora-purpose__card">
          <div className="livora-purpose__icon"><Gift size={24} /></div>
          <h3>Heirloom Unboxing</h3>
          <p>Housed in a rigid midnight obsidian box with plum silk velvet pouch and personalized cotton rag blessing scroll.</p>
        </div>
      </div>
    </section>
  )
}
