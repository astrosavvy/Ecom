import { useState } from 'react'
import { Gift, Package, Scroll, Sparkles } from 'lucide-react'

function StoryCopy({ text }) {
  if (!text) return null
  return text.split(/\n\n+/).filter(Boolean).map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ))
}

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('symbolism')

  return (
    <section className="livora-tabs-section">
      <div className="livora-tabs-section__head">
        <span className="livora-kicker">01 / BEHIND THE CONSECRATION</span>
        <h2>More than an <em>ornament.</em></h2>
      </div>

      <div className="livora-tabs">
        <div className="livora-tabs__nav">
          <button type="button" className={activeTab === 'symbolism' ? 'is-active' : ''} onClick={() => setActiveTab('symbolism')}>
            Symbolism & Meaning
          </button>
          <button type="button" className={activeTab === 'astrology' ? 'is-active' : ''} onClick={() => setActiveTab('astrology')}>
            Astrology & Consecration
          </button>
          <button type="button" className={activeTab === 'specs' ? 'is-active' : ''} onClick={() => setActiveTab('specs')}>
            Materials & Dimensions
          </button>
          <button type="button" className={activeTab === 'unboxing' ? 'is-active' : ''} onClick={() => setActiveTab('unboxing')}>
            Unboxing Experience
          </button>
        </div>

        <div className="livora-tabs__content">
          {activeTab === 'symbolism' && (
            <div className="livora-tabs__panel">
              <h3>The Living Symbol</h3>
              <StoryCopy text={product.editorial?.symbol} />
              <div className="livora-tabs__callout">
                <Sparkles size={20} />
                <p>{product.editorial?.intention?.split('\n\n')?.slice(-1)?.[0] || product.tagline}</p>
              </div>
            </div>
          )}

          {activeTab === 'astrology' && (
            <div className="livora-tabs__panel">
              <h3>Vedic Alignment & Attunement</h3>
              <StoryCopy text={product.editorial?.astrology} />
              <div className="livora-consecration-steps">
                <div className="livora-step">
                  <span className="livora-step__num">01</span>
                  <h4>Purification</h4>
                  <p>Washed in holy Himalayan rock crystal vibrations and sanctified sandalwood smoke.</p>
                </div>
                <div className="livora-step">
                  <span className="livora-step__num">02</span>
                  <h4>Mantra Japa</h4>
                  <p>108 recitations of ancient Gayatri mantras aligned with the planetary ruler.</p>
                </div>
                <div className="livora-step">
                  <span className="livora-step__num">03</span>
                  <h4>Muhurta Sealing</h4>
                  <p>Sealed during auspicious Shukla Paksha solar zenith for lasting vitality.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="livora-tabs__panel">
              <h3>Heirloom Specifications</h3>
              <dl className="livora-specs-grid">
                <div>
                  <dt>Dimensions</dt>
                  <dd>{product.specs?.dimensions || 'Standard Proportion'}</dd>
                </div>
                <div>
                  <dt>Weight</dt>
                  <dd>{product.specs?.weight || '38 g'}</dd>
                </div>
                <div>
                  <dt>Color & Metal</dt>
                  <dd>{product.specs?.color || '24K Electroplated Gold over Solid Brass'}</dd>
                </div>
                <div>
                  <dt>Gemstone Pavé</dt>
                  <dd>Diamond-cut celestial crystals with pavé micro-claw settings</dd>
                </div>
                <div>
                  <dt>Closure Clasp</dt>
                  <dd>Safety needle bar pin with positive rotating lock</dd>
                </div>
                <div>
                  <dt>Care Guide</dt>
                  <dd>Keep in the complimentary velvet pouch when unworn. Wipe with dry microfiber.</dd>
                </div>
              </dl>
            </div>
          )}

          {activeTab === 'unboxing' && (
            <div className="livora-tabs__panel">
              <h3>The Unboxing Ritual</h3>
              <div className="livora-unboxing-grid">
                <div className="livora-unboxing-card">
                  <Package size={24} />
                  <h4>Obsidian Rigid Box</h4>
                  <p>Handcrafted midnight rigid keepsake box with gold-foil stamped Younoya crest.</p>
                </div>
                <div className="livora-unboxing-card">
                  <Gift size={24} />
                  <h4>Silk Velvet Pouch</h4>
                  <p>Plum silk velvet protective pouch with braided gold drawstring for travel.</p>
                </div>
                <div className="livora-unboxing-card">
                  <Scroll size={24} />
                  <h4>Cotton Rag Scroll</h4>
                  <p>Hand-pressed 300gsm parchment scroll inscribed with the talisman’s blessing.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
