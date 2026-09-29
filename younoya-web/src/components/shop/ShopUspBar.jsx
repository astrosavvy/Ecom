import { Compass, Package, ShieldCheck, Sparkles } from 'lucide-react'

export default function ShopUspBar() {
  return (
    <section className="livora-usp" aria-label="Brand Guarantees">
      <div className="livora-usp__box">
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><ShieldCheck size={20} strokeWidth={1.5} /></span>
          <div>
            <strong>Precious Metallurgy</strong>
            <small>24K Gold electroplate over solid jewelers brass</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Sparkles size={20} strokeWidth={1.5} /></span>
          <div>
            <strong>108× Consecration</strong>
            <small>Purified in sacred sandalwood & Shukla Paksha muhurta</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Compass size={20} strokeWidth={1.5} /></span>
          <div>
            <strong>Planetary Alignment</strong>
            <small>Attuned to your Lagna, Nakshatra & life chapter</small>
          </div>
        </div>
        <div className="livora-usp__item">
          <span className="livora-usp__icon"><Package size={20} strokeWidth={1.5} /></span>
          <div>
            <strong>Heirloom Unboxing</strong>
            <small>Rigid obsidian box, velvet pouch & attunement scroll</small>
          </div>
        </div>
      </div>
    </section>
  )
}
