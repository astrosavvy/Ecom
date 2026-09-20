import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, User, Calendar, Flame, Check, ArrowRight, RefreshCw, Gift } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useCart } from '../context/CartContext'
import '../styles/BespokeConcierge.css'

const RECIPIENTS = [
  { id: 'partner', label: 'Cherished Partner', sub: 'Romantic & soul alliance' },
  { id: 'mother', label: 'Beloved Mother / Mentor', sub: 'Nurturing & gratitude' },
  { id: 'friend', label: 'Lifelong Confidante', sub: 'Shared memories & loyalty' },
  { id: 'colleague', label: 'Esteemed Colleague', sub: 'Professional triumph & legacy' },
  { id: 'self', label: 'Sacred Self-Sanctuary', sub: 'Personal rebirth & alignment' },
]

const CHAPTERS = [
  { id: 'birthday', label: 'Solar Return / Birthday', sub: 'Celebrating another trip around the sun' },
  { id: 'wedding', label: 'Celestial Union / Wedding', sub: 'Two cosmic paths entwining' },
  { id: 'career', label: 'New Horizon / Promotion', sub: 'Stepping into leadership & authority' },
  { id: 'healing', label: 'Restoration & Solace', sub: 'Quiet peace and emotional sanctuary' },
  { id: 'milestone', label: 'Decade Milestone / Legacy', sub: 'Monumental life triumph' },
]

const ELEMENTS = [
  { id: 'fire', label: 'Fire Affinity', sub: 'Aries · Leo · Sagittarius (Bold & Radiant)', color: '#E87A5D' },
  { id: 'earth', label: 'Earth Affinity', sub: 'Taurus · Virgo · Capricorn (Grounded & Heirloom)', color: '#88A375' },
  { id: 'air', label: 'Air Affinity', sub: 'Gemini · Libra · Aquarius (Intellectual & Graceful)', color: '#84B4C8' },
  { id: 'water', label: 'Water Affinity', sub: 'Cancer · Scorpio · Pisces (Intuitive & Deep)', color: '#9688B8' },
  { id: 'unknown', label: 'Birth Date Discernment', sub: 'Let our atelier calculate planetary alignment', color: '#D4AF37' },
]

export default function BespokeConcierge() {
  const [step, setStep] = useState(1)
  const [recipient, setRecipient] = useState(RECIPIENTS[0])
  const [chapter, setChapter] = useState(CHAPTERS[0])
  const [element, setElement] = useState(ELEMENTS[0])
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState(null)

  const { addToCart, setActiveModalProduct } = useCart()

  const handleGenerate = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      setResult({
        name: `The ${element.label.replace(' Affinity', '')} ${chapter.label.split('/')[0]} Suite`,
        priceNum: 245,
        emoji: element.id === 'fire' ? '🔥' : element.id === 'earth' ? '🌿' : element.id === 'air' ? '💨' : '🌊',
        sign: element.sub.split('(')[0].trim(),
        chapter: `${recipient.label} · ${chapter.label}`,
        desc: `Customized specifically for your ${recipient.label.toLowerCase()} honoring their ${chapter.label.toLowerCase()}. Features consecrated gemstones, hand-poured botanical candles, and a custom gold-sealed astrological dedication parchment.`,
        planet: 'Cosmically Aligned to Target Date',
        element: element.label,
        stone: 'Curated Raw Gemstone & Talisman',
        scent: 'Custom Hand-Blended Accord',
        badge: 'Bespoke Concierge Match',
      })
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F9E498', '#D4AF37', '#B8860B'],
      })
    }, 1100)
  }

  const resetWizard = () => {
    setResult(null)
    setStep(1)
  }

  return (
    <section className="concierge-world section-wrapper" id="concierge">
      <div className="container">
        <div className="concierge-header">
          <span className="eyebrow">Chapter V · Bespoke Concierge</span>
          <h2 className="concierge-title">
            The Interactive <span className="text-gold-gradient">Gifting Matcher</span>
          </h2>
          <p className="concierge-sub">
            Answer three quick questions to let our cosmic concierge formulate the ideal bespoke suite.
          </p>
        </div>

        <div className="concierge-card">
          {!result ? (
            <>
              {/* Step Navigation Indicator */}
              <div className="wizard-steps">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>
                  <span className="dot-index">1</span>
                  <span className="dot-text">Recipient</span>
                </div>
                <div className="step-line" />
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>
                  <span className="dot-index">2</span>
                  <span className="dot-text">Life Chapter</span>
                </div>
                <div className="step-line" />
                <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>
                  <span className="dot-index">3</span>
                  <span className="dot-text">Cosmic Affinity</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="wizard-body">
                {isCalculating ? (
                  <div className="calculating-state">
                    <motion.div
                      className="calc-spinner"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    >
                      ✦
                    </motion.div>
                    <h3>Aligning Celestial Ephemeris...</h3>
                    <p>Consulting planetary transits and elemental gemstone harmonies...</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="step-panel"
                      >
                        <h3 className="step-question">Who are you honoring with this gift?</h3>
                        <div className="options-grid">
                          {RECIPIENTS.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              className={`option-btn ${recipient.id === r.id ? 'selected' : ''}`}
                              onClick={() => setRecipient(r)}
                            >
                              <div className="option-title-row">
                                <span className="option-title">{r.label}</span>
                                {recipient.id === r.id && <Check size={16} className="text-gold" />}
                              </div>
                              <span className="option-sub">{r.sub}</span>
                            </button>
                          ))}
                        </div>
                        <div className="step-actions">
                          <button type="button" className="btn-gold" onClick={() => setStep(2)}>
                            <span>Continue to Chapter</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ) : step === 2 ? (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="step-panel"
                      >
                        <h3 className="step-question">What life milestone or chapter is unfolding?</h3>
                        <div className="options-grid">
                          {CHAPTERS.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className={`option-btn ${chapter.id === c.id ? 'selected' : ''}`}
                              onClick={() => setChapter(c)}
                            >
                              <div className="option-title-row">
                                <span className="option-title">{c.label}</span>
                                {chapter.id === c.id && <Check size={16} className="text-gold" />}
                              </div>
                              <span className="option-sub">{c.sub}</span>
                            </button>
                          ))}
                        </div>
                        <div className="step-actions">
                          <button type="button" className="btn-ghost-gold" onClick={() => setStep(1)}>
                            Back
                          </button>
                          <button type="button" className="btn-gold" onClick={() => setStep(3)}>
                            <span>Select Cosmic Affinity</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="step-panel"
                      >
                        <h3 className="step-question">Select their zodiac element or astrological affinity:</h3>
                        <div className="options-grid">
                          {ELEMENTS.map((e) => (
                            <button
                              key={e.id}
                              type="button"
                              className={`option-btn ${element.id === e.id ? 'selected' : ''}`}
                              onClick={() => setElement(e)}
                            >
                              <div className="option-title-row">
                                <span className="option-title">{e.label}</span>
                                {element.id === e.id && <Check size={16} className="text-gold" />}
                              </div>
                              <span className="option-sub">{e.sub}</span>
                            </button>
                          ))}
                        </div>
                        <div className="step-actions">
                          <button type="button" className="btn-ghost-gold" onClick={() => setStep(2)}>
                            Back
                          </button>
                          <button type="button" className="btn-gold" onClick={handleGenerate}>
                            <Sparkles size={16} />
                            <span>Synthesize Bespoke Match</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </>
          ) : (
            /* Matched Result Card */
            <motion.div
              className="concierge-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="result-badge">
                <Sparkles size={14} className="text-gold" />
                <span>PERFECT CELESTIAL ALIGNMENT IDENTIFIED</span>
              </div>

              <div className="result-emoji-box">
                <span className="result-emoji">{result.emoji}</span>
              </div>

              <h3 className="result-title">{result.name}</h3>
              <p className="result-chapter">Designed For: <strong>{result.chapter}</strong></p>

              <p className="result-desc">{result.desc}</p>

              <div className="result-price-block">
                <span className="result-price">${result.priceNum}</span>
                <span className="result-note">Includes custom gold wax-sealed scroll & presentation casket</span>
              </div>

              <div className="result-actions">
                <button
                  className="btn-gold"
                  onClick={() => addToCart(result)}
                >
                  <Gift size={16} />
                  <span>Curate This Suite — ${result.priceNum}</span>
                </button>
                <button
                  className="btn-ghost-gold"
                  onClick={() => setActiveModalProduct(result)}
                >
                  View Full Specifications
                </button>
                <button
                  className="btn-link-reset"
                  onClick={resetWizard}
                >
                  <RefreshCw size={14} />
                  <span>Curate for Another Recipient</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
