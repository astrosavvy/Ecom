import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Flame, Mountain, Wind, Droplets, Eye, Gift } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/ZodiacNavigator.css'

const ELEMENTS = [
  { id: 'all', label: 'All Houses', icon: Sparkles },
  { id: 'fire', label: 'Fire Houses', icon: Flame, color: '#E87A5D' },
  { id: 'earth', label: 'Earth Houses', icon: Mountain, color: '#88A375' },
  { id: 'air', label: 'Air Houses', icon: Wind, color: '#84B4C8' },
  { id: 'water', label: 'Water Houses', icon: Droplets, color: '#9688B8' },
]

const ZODIAC_DATA = [
  {
    sign: 'Aries',
    symbol: '♈',
    element: 'fire',
    dates: 'Mar 21 – Apr 19',
    planet: 'Mars · The Red Star',
    talisman: 'Raw Carnelian & 24k Gold Inscription',
    fragrance: 'Smoked Cedar, Blood Orange & Pink Pepper',
    idealChapter: 'New Ventures, Leadership Milestones & Bold Beginnings',
    suiteName: 'The Solar Catalyst Suite',
    price: 185,
    emoji: '🔥',
    desc: 'For the fearless trailblazer stepping into their highest authority.',
  },
  {
    sign: 'Taurus',
    symbol: '♉',
    element: 'earth',
    dates: 'Apr 20 – May 20',
    planet: 'Venus · Star of Beauty & Harmony',
    talisman: 'Untreated Green Jade & Velvet Keepsake Box',
    fragrance: 'Rose Absolute, Cashmere Musk & Haitian Vetiver',
    idealChapter: 'Sanctuary Building, Anniversaries & Gracious Abundance',
    suiteName: 'The Earthly Opulence Box',
    price: 220,
    emoji: '🌿',
    desc: 'Sensory indulgence crafted for connoisseurs of timeless comfort.',
  },
  {
    sign: 'Gemini',
    symbol: '♊',
    element: 'air',
    dates: 'May 21 – Jun 20',
    planet: 'Mercury · Cosmic Messenger',
    talisman: 'Dual Tourmaline Pendant & Scribed Journal',
    fragrance: 'Crisp Bergamot, White Tea & Cardamom',
    idealChapter: 'Graduations, Creative Breakthroughs & Intellectual Quests',
    suiteName: 'The Mercurial Scribe Casket',
    price: 165,
    emoji: '📜',
    desc: 'Curated for the quick-witted storyteller and perpetual seeker.',
  },
  {
    sign: 'Cancer',
    symbol: '♋',
    element: 'water',
    dates: 'Jun 21 – Jul 22',
    planet: 'The Moon · The Luminary of Intuition',
    talisman: 'Moonstone Talisman & Hand-Cast Silver Tray',
    fragrance: 'White Lotus, Vanilla Bean & Sea Salt Driftwood',
    idealChapter: 'Motherhood, Home Blessing & Emotional Milestones',
    suiteName: 'The Lunar Sanctuary Suite',
    price: 195,
    emoji: '🌙',
    desc: 'Nurturing warmth that wraps the recipient in cosmic belonging.',
  },
  {
    sign: 'Leo',
    symbol: '♌',
    element: 'fire',
    dates: 'Jul 23 – Aug 22',
    planet: 'The Sun · Center of Radiance & Sovereignty',
    talisman: 'Citrine Sunburst in 14k Gold Vermeil',
    fragrance: 'Golden Amber, Frankincense & Sunlit Bergamot',
    idealChapter: 'Decade Birthdays, Accolades & Radiant Celebrations',
    suiteName: 'The Sovereign Radiance Vault',
    price: 260,
    emoji: '👑',
    desc: 'Regal excellence engineered for those who illuminate every room.',
  },
  {
    sign: 'Virgo',
    symbol: '♍',
    element: 'earth',
    dates: 'Aug 23 – Sep 22',
    planet: 'Mercury · Master of Precision',
    talisman: 'Hand-Milled Linen Archive & Amazonite Bead',
    fragrance: 'Clary Sage, Lavender Bloom & Pressed Juniper',
    idealChapter: 'Career Elevations, Rituals of Order & Self-Mastery',
    suiteName: 'The Celestial Archivist Suite',
    price: 175,
    emoji: '📓',
    desc: 'Impeccable curation where every millimeter reflects meticulous intention.',
  },
  {
    sign: 'Libra',
    symbol: '♎',
    element: 'air',
    dates: 'Sep 23 – Oct 22',
    planet: 'Venus · Muse of Balance & Partnership',
    talisman: 'Rose Quartz Sphere & Brass Equilibrium Pendulum',
    fragrance: 'Peony, Sandalwood & Sweet Orange Blossom',
    idealChapter: 'Weddings, Engagements & Harmonious Alliances',
    suiteName: 'The Harmonious Alliance Casket',
    price: 210,
    emoji: '⚖️',
    desc: 'Symmetrical grace honoring eternal love and aesthetic perfection.',
  },
  {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'water',
    dates: 'Oct 23 – Nov 21',
    planet: 'Pluto & Mars · Masters of Metamorphosis',
    talisman: 'Volcanic Obsidian Candle with Golden Seal',
    fragrance: 'Black Truffle, Dark Patchouli & Midnight Orchid',
    idealChapter: 'Rebirths, Secret Milestones & Sacred Vows',
    suiteName: 'The Midnight Metamorphosis Ritual',
    price: 245,
    emoji: '🕯️',
    desc: 'Magnetic intensity for the soul that treasures true depth.',
  },
  {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    dates: 'Nov 22 – Dec 21',
    planet: 'Jupiter · The Great Benefactor of Expansion',
    talisman: 'Lapis Lazuli Astral Astrolabe & Celestial Compass',
    fragrance: 'Wild Pine, Saffron & Smoky Oud',
    idealChapter: 'Global Voyages, Sabbaticals & Grand Ambitions',
    suiteName: 'The Infinite Horizon Voyager',
    price: 230,
    emoji: '🧭',
    desc: 'Unbounded optimism for the philosopher and cosmic wanderer.',
  },
  {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    dates: 'Dec 22 – Jan 19',
    planet: 'Saturn · Architect of Time & Legacy',
    talisman: 'Smoky Quartz Weight & Heavy Brass Scribe Tool',
    fragrance: 'Leather, Tobacco Leaf & Ancient Cypress',
    idealChapter: 'Retirements, Executive Appointments & Lifetime Achievements',
    suiteName: 'The Architect of Legacy Box',
    price: 275,
    emoji: '🏛️',
    desc: 'Substantial gravitas celebrating monumental endurance and legacy.',
  },
  {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'air',
    dates: 'Jan 20 – Feb 18',
    planet: 'Uranus · Spark of Innovation & Vision',
    talisman: 'Bespoke Meteorite Fragment & Prism Crystal',
    fragrance: 'Ozone, Crisp Eucalyptus & Mineral Amber',
    idealChapter: 'Pioneering Ventures, Creative Patents & Unconventional Journeys',
    suiteName: 'The Visionary Cosmos Suite',
    price: 240,
    emoji: '⚡',
    desc: 'Avant-garde brilliance for those who dream a century ahead.',
  },
  {
    sign: 'Pisces',
    symbol: '♓',
    element: 'water',
    dates: 'Feb 19 – Mar 20',
    planet: 'Neptune · Ocean of Dreams & Mysticism',
    talisman: 'Deep Amethyst Cluster & Silk Sleep Sanctuary',
    fragrance: 'Water Lily, Blue Chamomile & Driftwood Amber',
    idealChapter: 'Spiritual Awakenings, Artistic Debuts & Healing Solaces',
    suiteName: 'The Ethereal Dream Casket',
    price: 205,
    emoji: '🔮',
    desc: 'Poetic transcendence for the gentle visionary who feels the universe.',
  },
]

export default function ZodiacNavigator() {
  const [selectedElement, setSelectedElement] = useState('all')
  const [activeSign, setActiveSign] = useState(ZODIAC_DATA[0])
  const { setActiveModalProduct, addToCart } = useCart()

  const filteredSigns =
    selectedElement === 'all'
      ? ZODIAC_DATA
      : ZODIAC_DATA.filter((z) => z.element === selectedElement)

  const handleOpenProduct = (signData) => {
    setActiveModalProduct({
      id: `zodiac-${signData.sign}`,
      name: signData.suiteName,
      sign: signData.sign,
      emoji: signData.emoji,
      priceNum: signData.price,
      chapter: signData.idealChapter,
      desc: signData.desc,
      planet: signData.planet,
      element: signData.element.toUpperCase(),
      stone: signData.talisman,
      scent: signData.fragrance,
      badge: 'Zodiac Alignment Suite',
    })
  }

  const handleQuickAdd = (signData) => {
    addToCart({
      id: `zodiac-${signData.sign}`,
      name: signData.suiteName,
      sign: signData.sign,
      emoji: signData.emoji,
      priceNum: signData.price,
      chapter: signData.idealChapter,
      tag: 'Zodiac Suite',
    })
  }

  return (
    <section className="zodiac-nav section-wrapper" id="compass">
      <div className="container">
        {/* Header */}
        <div className="zodiac-nav__header">
          <span className="eyebrow">Chapter III · Zodiac Alignment</span>
          <h2 className="zodiac-nav__title">
            The Cosmic <span className="text-gold-gradient">Alignment Compass</span>
          </h2>
          <p className="zodiac-nav__subtitle">
            Filter by elemental houses to uncover curated luxury suites aligned with your recipient’s astrological essence.
          </p>
        </div>

        {/* Element Filter Tabs */}
        <div className="element-tabs" role="tablist" aria-label="Filter by elemental house">
          {ELEMENTS.map((el) => {
            const Icon = el.icon
            const isActive = selectedElement === el.id
            return (
              <button
                key={el.id}
                className={`element-tab ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedElement(el.id)}
                role="tab"
                aria-selected={isActive}
              >
                <Icon size={16} />
                <span>{el.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dual Interactive Display: Sign Carousel & Detailed Cosmic Dossier */}
        <div className="zodiac-layout">
          {/* Sign Selector Grid */}
          <div className="sign-selector-col">
            <div className="signs-grid">
              {filteredSigns.map((z) => {
                const isSelected = activeSign.sign === z.sign
                return (
                  <motion.button
                    key={z.sign}
                    className={`sign-tile ${isSelected ? 'active' : ''} sign-tile--${z.element}`}
                    onClick={() => setActiveSign(z)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <span className="tile-symbol">{z.symbol}</span>
                    <div className="tile-meta">
                      <span className="tile-name">{z.sign}</span>
                      <span className="tile-dates">{z.dates}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Active Sign Dossier Card */}
          <div className="sign-dossier-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSign.sign}
                className="dossier-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="dossier-header">
                  <div className="dossier-symbol-ring">
                    <span className="dossier-symbol">{activeSign.symbol}</span>
                  </div>
                  <div className="dossier-title-block">
                    <span className="dossier-element-badge">
                      HOUSE OF {activeSign.element.toUpperCase()} · {activeSign.dates}
                    </span>
                    <h3 className="dossier-sign-name">{activeSign.sign}</h3>
                    <p className="dossier-planet">Governed by: <strong>{activeSign.planet}</strong></p>
                  </div>
                </div>

                <p className="dossier-narrative">"{activeSign.desc}"</p>

                {/* Attributes breakdown */}
                <div className="dossier-specs">
                  <div className="spec-row">
                    <span className="spec-title">Curated Suite:</span>
                    <strong className="spec-highlight text-gold">{activeSign.suiteName}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-title">Ideal Life Chapter:</span>
                    <span className="spec-val">{activeSign.idealChapter}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-title">Sacred Talisman:</span>
                    <span className="spec-val">{activeSign.talisman}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-title">Olfactory Essence:</span>
                    <span className="spec-val">{activeSign.fragrance}</span>
                  </div>
                </div>

                <div className="dossier-actions">
                  <button
                    className="btn-gold dossier-add-btn"
                    onClick={() => handleQuickAdd(activeSign)}
                  >
                    <Gift size={16} />
                    <span>Curate Suite — ${activeSign.price}</span>
                  </button>
                  <button
                    className="btn-ghost-gold"
                    onClick={() => handleOpenProduct(activeSign)}
                  >
                    <Eye size={16} />
                    <span>Explore Dossier</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
