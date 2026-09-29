import { Package, Scroll, ShieldCheck, Sparkles } from 'lucide-react'

export default function ProductHighlights() {
  return (
    <section className="livora-highlights">
      <div className="livora-highlights__box">
        <div className="livora-highlights__item">
          <ShieldCheck size={20} />
          <div>
            <strong>24K Gold Electroplated</strong>
            <small>High-density solid jewelers brass</small>
          </div>
        </div>
        <div className="livora-highlights__item">
          <Sparkles size={20} />
          <div>
            <strong>108× Gayatri Consecration</strong>
            <small>Shukla Paksha muhurta ritual</small>
          </div>
        </div>
        <div className="livora-highlights__item">
          <Package size={20} />
          <div>
            <strong>Rigid Obsidian Box</strong>
            <small>Plum silk velvet protective pouch</small>
          </div>
        </div>
        <div className="livora-highlights__item">
          <Scroll size={20} />
          <div>
            <strong>Numbered Certificate</strong>
            <small>Astrological attunement scroll</small>
          </div>
        </div>
      </div>
    </section>
  )
}
