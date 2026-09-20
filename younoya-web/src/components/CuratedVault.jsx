import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Eye, Gift, Star, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/CuratedVault.css'

const VAULT_PRODUCTS = [
  {
    id: 'vault-1',
    emoji: '👑',
    name: 'The Sovereign Radiance Suite',
    sign: 'Leo · Aries · Sagittarius',
    chapter: 'Milestone Birthdays & Sovereign Honors',
    priceNum: 285,
    rating: '5.0 (84 curations)',
    badge: 'Atelier Masterpiece',
    desc: 'Features a hand-forged 14k gold vermeil sunburst talisman, golden amber soy candle, and wax-sealed solar proclamation scroll.',
    planet: 'The Sun (Sol)',
    element: 'Fire / Pure Gold',
    stone: 'Natural Golden Citrine',
    scent: 'Aged Amber & Sunlit Bergamot',
    inclusions: ['14k Gold Vermeil Talisman', 'Hand-poured Amber Candle', 'Scribed Golden Scroll', 'Velvet Keepsake Casket'],
  },
  {
    id: 'vault-2',
    emoji: '🕯️',
    name: 'The Midnight Metamorphosis Box',
    sign: 'Scorpio · Pisces · Cancer',
    chapter: 'Rebirths, New Horizons & Sacred Alliances',
    priceNum: 245,
    rating: '4.9 (62 curations)',
    badge: 'Collector Choice',
    desc: 'Handcrafted volcanic obsidian candle with bespoke gold wax seal, natural faceted smoky quartz, and midnight botanical tincture.',
    planet: 'Pluto & The Moon',
    element: 'Water / Obsidian',
    stone: 'Black Obsidian & Quartz',
    scent: 'Smoked Cedar & Night Orchid',
    inclusions: ['Volcanic Obsidian Candle', 'Smoky Quartz Obelisk', 'Midnight Botanical Elixir', 'Gold Seal Inscription'],
  },
  {
    id: 'vault-3',
    emoji: '📓',
    name: 'The Celestial Archivist Box',
    sign: 'Virgo · Capricorn · Gemini',
    chapter: 'New Ventures, Graduations & Life Manifestos',
    priceNum: 210,
    rating: '5.0 (49 curations)',
    badge: 'Limited Edition',
    desc: 'Bound in Italian heavy linen with gold-gilded edges, accompanied by an engraved solid brass astrolabe and inkwell.',
    planet: 'Mercury & Saturn',
    element: 'Earth / Linen',
    stone: 'Polished Amazonite',
    scent: 'Pressed Juniper & White Tea',
    inclusions: ['Linen Bound Celestial Journal', 'Solid Brass Astrolabe', 'Hand-cast Brass Pen', 'Custom Star Chart'],
  },
  {
    id: 'vault-4',
    emoji: '💍',
    name: 'The Harmonious Alliance Casket',
    sign: 'Libra · Taurus · Cancer',
    chapter: 'Weddings, Engagements & Golden Anniversaries',
    priceNum: 295,
    rating: '5.0 (91 curations)',
    badge: 'Bespoke Heirloom',
    desc: 'A pair of crystal flutes laser-etched with the couple’s celestial alignment at the hour they met, plus rose quartz sphere.',
    planet: 'Venus (Aphrodite)',
    element: 'Air & Earth',
    stone: 'Madagascar Rose Quartz',
    scent: 'Rose Absolute & Sandalwood',
    inclusions: ['Etched Crystal Glassware', 'Rose Quartz Balancing Sphere', 'Silk Alignment Certificate', 'Double Keepsake Box'],
  },
  {
    id: 'vault-5',
    emoji: '🌙',
    name: 'The Lunar Sanctuary Suite',
    sign: 'Cancer · Pisces · Taurus',
    chapter: 'Motherhood, Welcoming Home & Restorative Peace',
    priceNum: 225,
    rating: '4.9 (78 curations)',
    badge: 'Best for Her',
    desc: '100% 22-Momme mulberry silk eye mask hand-embroidered with recipient’s constellation, lunar room mist, and raw selenite.',
    planet: 'The Moon (Selene)',
    element: 'Water / Pure Silk',
    stone: 'Raw Moroccan Selenite',
    scent: 'White Lotus & Blue Chamomile',
    inclusions: ['Embroidered Silk Mask', 'Lunar Cleansing Mist', 'Natural Selenite Wand', 'Hand-scribed Blessing'],
  },
  {
    id: 'vault-6',
    emoji: '🏛️',
    name: 'The Architect of Legacy Vault',
    sign: 'Capricorn · Scorpio · Aries',
    chapter: 'Executive Elevation & Lifetime Milestones',
    priceNum: 340,
    rating: '5.0 (33 curations)',
    badge: 'Executive Suite',
    desc: 'Heavy brass perpetual lunar calendar, bookends carved from volcanic basalt, and a personalized leather birth chart dossier.',
    planet: 'Saturn & Mars',
    element: 'Earth / Heavy Brass',
    stone: 'Basalt & Tiger Eye',
    scent: 'Cuban Tobacco & Ancient Cypress',
    inclusions: ['Brass Perpetual Lunar Calendar', 'Volcanic Basalt Bookends', 'Leather Inscription Folio', 'Collector Certificate'],
  },
]

export default function CuratedVault() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const { addToCart, setActiveModalProduct } = useCart()

  const handleOpen = (product) => {
    setActiveModalProduct(product)
  }

  const handleAdd = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      sign: product.sign,
      emoji: product.emoji,
      priceNum: product.priceNum,
      chapter: product.chapter,
      tag: 'Vault Suite',
    })
  }

  return (
    <section className="curated-vault section-wrapper" id="vault" ref={containerRef}>
      <div className="container">
        {/* Header */}
        <div className="vault-header">
          <span className="eyebrow">Chapter IV · The Gift Vault</span>
          <h2 className="vault-title">
            The Bespoke <span className="text-gold-gradient">Gifting Suites</span>
          </h2>
          <p className="vault-sub">
            Each suite arrives encased in our signature obsidian and gold hot-stamped casket,
            accompanied by an authentic gemological guarantee and personalized celestial parchment.
          </p>
        </div>

        {/* Vault Grid */}
        <div className="vault-grid">
          {VAULT_PRODUCTS.map((p, idx) => (
            <motion.div
              key={p.id}
              className="vault-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Card Media / Visual Stage */}
              <div className="vault-card__stage" onClick={() => handleOpen(p)}>
                <div className="card-emblem-glow" />
                <span className="vault-card__emoji">{p.emoji}</span>
                <span className="vault-card__badge">{p.badge}</span>
                <div className="stage-hover-overlay">
                  <span className="hover-action">
                    <Eye size={16} /> View Suite Dossier
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="vault-card__body">
                <div className="card-top-meta">
                  <span className="card-sign-tag">{p.sign}</span>
                  <div className="card-rating">
                    <Star size={12} className="star-fill" />
                    <span>5.0</span>
                  </div>
                </div>

                <h3 className="card-name" onClick={() => handleOpen(p)}>{p.name}</h3>
                <p className="card-chapter">Honors: <em>{p.chapter}</em></p>
                <p className="card-desc">{p.desc}</p>

                {/* Key Inclusions Preview */}
                <div className="card-inclusions-list">
                  {p.inclusions.slice(0, 3).map((inc, i) => (
                    <span key={i} className="inc-chip">✦ {inc}</span>
                  ))}
                </div>

                {/* Footer / Pricing & Actions */}
                <div className="vault-card__footer">
                  <div className="card-price-block">
                    <span className="price-label">Suite Investment</span>
                    <span className="card-price">${p.priceNum}</span>
                  </div>

                  <div className="card-btn-group">
                    <button
                      className="btn-gold card-add-btn"
                      onClick={() => handleAdd(p)}
                      title="Add to your Gifting Suite"
                    >
                      <Gift size={15} />
                      <span>Curate</span>
                    </button>
                    <button
                      className="card-quick-view"
                      onClick={() => handleOpen(p)}
                      title="Inspect Specifications"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="vault-guarantee-banner">
          <div className="guarantee-item">
            <ShieldCheck size={22} className="text-gold" />
            <div>
              <h4>Insured White-Glove Transit</h4>
              <p>Every box is temperature-stabilized and signed for upon delivery.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <Sparkles size={22} className="text-gold" />
            <div>
              <h4>Hand-Scribed Astrology Parchment</h4>
              <p>Includes personalized birth chart insights written by our house horologist.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
