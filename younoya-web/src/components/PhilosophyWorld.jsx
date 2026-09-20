import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Compass, Heart, Award, Shield } from 'lucide-react'
import '../styles/PhilosophyWorld.css'

const PILLARS = [
  {
    num: '01',
    icon: <Compass size={22} className="text-gold" />,
    title: 'Cosmic Blueprint',
    subtitle: 'The recipient’s celestial map',
    desc: 'We don’t generalize by vague horoscopes. Our atelier maps specific planetary positions and elemental affinities to match items with authentic resonance.',
  },
  {
    num: '02',
    icon: <Sparkles size={22} className="text-gold" />,
    title: 'Bespoke Atelier Craft',
    subtitle: 'Rare materials & master artisans',
    desc: 'From hand-poured lunar candles with obsidian crystals to 14k gold vermeil talismans, each piece is forged to endure generations as an heirloom.',
  },
  {
    num: '03',
    icon: <Heart size={22} className="text-gold" />,
    title: 'Scribed for Your Chapter',
    subtitle: 'Wax-sealed custom parchment',
    desc: 'Every gift includes a hand-finished gold foil scroll inscribed with your words and a bespoke astrological dedication celebrating their life transition.',
  },
  {
    num: '04',
    icon: <Award size={22} className="text-gold" />,
    title: 'The Gifting Ritual',
    subtitle: 'An unboxing transcendence',
    desc: 'Housed in tactile obsidian linen boxes with custom wax seals and velvet linings, presenting a gift that commands awe before it is even opened.',
  },
]

export default function PhilosophyWorld() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const img1Y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const img2Y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const titleY = useTransform(scrollYProgress, [0, 0.5], [40, 0])

  return (
    <section className="philosophy-world section-wrapper" id="philosophy" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <div className="philosophy-header">
          <span className="eyebrow">Chapter II · The Philosophy</span>
          <motion.h2 className="philosophy-title" style={{ y: titleY }}>
            Gifts That Honor Life’s <span className="text-gold-gradient">Sacred Chapters</span>
          </motion.h2>
          <p className="philosophy-lead">
            We believe gifting is not a transaction — it is a sacred acknowledgement of someone’s journey.
            YOUNOYA pairs bespoke luxury craftsmanship with the subtle wisdom of the stars to commemorate every milestone.
          </p>
        </div>

        {/* Brand Showcase Dual Diptych */}
        <div className="philosophy-diptych">
          {/* Brand Visual 1 */}
          <motion.div className="diptych-card diptych-card--primary" style={{ y: img1Y }}>
            <div className="diptych-img-wrap">
              <img
                src="/brand.webp"
                alt="YOUNOYA Brand Experience"
                className="diptych-img"
              />
              <div className="diptych-overlay" />
              <div className="diptych-badge">
                <Sparkles size={14} className="text-gold" />
                <span>The Contemporary Suite</span>
              </div>
            </div>
            <div className="diptych-content">
              <span className="card-tag">ATELIER PHILOSOPHY</span>
              <h3>Curated with Cosmic Intent</h3>
              <p>
                Each curated piece balances earthly opulence with celestial precision — honoring birth moments, love alliances, and personal transitions.
              </p>
            </div>
          </motion.div>

          {/* Brand Visual 2 (Legacy) */}
          <motion.div className="diptych-card diptych-card--secondary" style={{ y: img2Y }}>
            <div className="diptych-img-wrap">
              <img
                src="/brand-legacy.webp"
                alt="YOUNOYA Heritage Legacy"
                className="diptych-img"
              />
              <div className="diptych-overlay" />
              <div className="diptych-badge">
                <Shield size={14} className="text-gold" />
                <span>The Heritage Legacy</span>
              </div>
            </div>
            <div className="diptych-content">
              <span className="card-tag">TIMELESS PRESERVATION</span>
              <h3>Heirlooms for Every Chapter</h3>
              <p>
                Designed to be treasured long after the season fades, retaining emotional and aesthetic prestige across a lifetime.
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="philosophy-pillars">
          <div className="pillars-grid">
            {PILLARS.map((p) => (
              <div key={p.num} className="pillar-item">
                <div className="pillar-top">
                  <span className="pillar-num">{p.num}</span>
                  <div className="pillar-icon-box">{p.icon}</div>
                </div>
                <h4 className="pillar-title">{p.title}</h4>
                <p className="pillar-sub">{p.subtitle}</p>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
