import { motion } from 'framer-motion'
import { Star, Quote, Sparkles } from 'lucide-react'
import '../styles/TestimonialsWorld.css'

const PATRONS = [
  {
    id: 1,
    quote: "When my husband opened the Sovereign Radiance Suite on his 40th birthday, the room went completely quiet. The astrological parchment detailed his planetary returns with uncanny poetry. It wasn't just a gift — it was an immortalization of his journey.",
    author: "Lady Vivienne M.",
    location: "Mayfair, London",
    chapter: "40th Solar Return · Leo Chapter",
    avatar: "👑",
    stars: 5,
  },
  {
    id: 2,
    quote: "In a world of disposable luxury, YOUNOYA stands alone. The raw obsidian and hand-poured candle exude an almost sacred gravitas. My fiancée wept when she broke the golden wax seal and read the bespoke dedication.",
    author: "Alexander V.",
    location: "Geneva, Switzerland",
    chapter: "Engagement Alliance · Scorpio & Taurus",
    avatar: "💍",
    stars: 5,
  },
  {
    id: 3,
    quote: "We commissioned the Architect of Legacy Vault for our founding partner's retirement. The heavy brass lunar calendar and custom basalt bookends have become the centerpiece of his private library. Unsurpassed pedigree.",
    author: "Dr. Elena Rostova",
    location: "Milan, Italy",
    chapter: "Executive Legacy · Capricorn Milestone",
    avatar: "🏛️",
    stars: 5,
  },
]

export default function TestimonialsWorld() {
  return (
    <section className="testimonials-world section-wrapper" id="whispers">
      <div className="container">
        <div className="testimonials-header">
          <span className="eyebrow">Chapter VII · Patron Whispers</span>
          <h2 className="testimonials-title">
            Chronicles of <span className="text-gold-gradient">Unforgettable Milestones</span>
          </h2>
          <p className="testimonials-sub">
            Read how patrons across the globe commemorate life's pivotal chapters through the YOUNOYA gifting ritual.
          </p>
        </div>

        <div className="testimonials-grid">
          {PATRONS.map((p, idx) => (
            <motion.div
              key={p.id}
              className="patron-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card-quote-icon">
                <Quote size={28} className="text-gold" />
              </div>

              <div className="card-stars">
                {[...Array(p.stars)].map((_, i) => (
                  <Star key={i} size={14} className="star-gold-fill" />
                ))}
              </div>

              <p className="patron-quote">"{p.quote}"</p>

              <div className="patron-profile">
                <div className="patron-avatar-box">
                  <span>{p.avatar}</span>
                </div>
                <div className="patron-meta">
                  <h4 className="patron-name">{p.author}</h4>
                  <span className="patron-loc">{p.location}</span>
                  <span className="patron-chapter">✦ {p.chapter}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
