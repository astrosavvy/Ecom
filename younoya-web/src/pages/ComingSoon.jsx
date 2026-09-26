import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles, Check } from 'lucide-react'
import '../styles/ComingSoon.css'

export default function ComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <main className="coming-soon">
      {/* Background Boutique Facade Imagery with Responsive Picture */}
      <div className="coming-soon__media" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet="/media/diorama-arrival-desktop.webp" />
          <img
            src="/media/diorama/scene_1_start.jpg"
            alt="Younoya luxury boutique facade at night"
            className="coming-soon__image"
          />
        </picture>
        {/* Half-bottom darker shading gradient */}
        <div className="coming-soon__gradient-scrim" />
      </div>

      {/* Luxury Editorial Content Layer */}
      <div className="coming-soon__content">
        <motion.div
          className="coming-soon__inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Sacred Brand Mark */}
          <div className="coming-soon__brand">
            <span className="coming-soon__crest" aria-hidden="true">✦</span>
            <span className="coming-soon__logotype">YOUNOYA</span>
          </div>

          {/* Intention Overline */}
          <div className="coming-soon__badge">
            <span>ASTROLOGY-BACKED GIFTING • CONSECRATED HEIRLOOMS</span>
          </div>

          {/* Main Coming Soon Headline */}
          <h1 className="coming-soon__title">
            COMING <em>SOON</em>
          </h1>

          {/* Brand Promise Subtitle */}
          <p className="coming-soon__description">
            For every chapter. We are preparing to unveil our boutique collection of
            astrology-backed gift hampers and hand-consecrated talismans curated for what matters.
          </p>

          {/* Private VIP Access Form */}
          <div className="coming-soon__action-box">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="coming-soon__notify-form">
                <input
                  type="email"
                  required
                  placeholder="Enter your email for private preview..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="coming-soon__input"
                  aria-label="Email address for launch invitation"
                />
                <button type="submit" className="coming-soon__btn">
                  <span>Notify Me</span>
                  <Sparkles size={14} />
                </button>
              </form>
            ) : (
              <div className="coming-soon__subscribed">
                <Check size={18} className="text-[#D6B06A]" />
                <span>You are on the private invitation list. We shall notify you at twilight.</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Discreet Operational Footer */}
        <footer className="coming-soon__footer">
          <span>© {new Date().getFullYear()} YOUNOYA ATELIER • ALL RIGHTS RESERVED</span>
          <Link to="/admin" className="coming-soon__staff-link">Staff Console</Link>
        </footer>
      </div>
    </main>
  )
}
