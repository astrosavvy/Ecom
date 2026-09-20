import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Shield, Compass, Heart } from 'lucide-react'
import confetti from 'canvas-confetti'
import '../styles/PrivateCircle.css'

export default function PrivateCircle() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#F9E498', '#D4AF37', '#B8860B'],
      })
    }
  }

  return (
    <section className="circle-footer-section">
      {/* VIP Salon Card */}
      <div className="container">
        <div className="salon-banner">
          <div className="salon-halo" />
          <div className="salon-content">
            <span className="eyebrow">BY INVITATION · THE PRIVATE SALON</span>
            <h2 className="salon-title">
              Enter the <span className="text-gold-gradient">YOUNOYA Celestial Circle</span>
            </h2>
            <p className="salon-desc">
              Receive private ephemeris briefings, previews of rare solstitial talisman releases,
              and dedicated concierge access for bespoke anniversary planning.
            </p>

            {!submitted ? (
              <form className="salon-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="salon-input"
                  placeholder="Enter your esteemed email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-gold">
                  <span>Request Membership</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <motion.div
                className="salon-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Sparkles size={20} className="text-gold" />
                <span>Your admission request has been recorded in the atelier register.</span>
              </motion.div>
            )}

            <div className="salon-perks">
              <span className="perk-item">✦ Solstice & Equinox Releases</span>
              <span className="perk-item">✦ Master Astrologer Consultations</span>
              <span className="perk-item">✦ Complimentary Archival Monogramming</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Brand Footer */}
      <footer className="global-footer">
        <div className="container">
          <div className="footer-top-grid">
            {/* Brand column */}
            <div className="footer-brand-col">
              <a href="#gateway" className="footer-brand-link">
                <img
                  src="/logo-gold.svg"
                  alt="YOUNOYA — for every chapter"
                  className="footer-logo-img"
                />
              </a>
              <p className="footer-brand-desc">
                An international bespoke gifting house dedicated to immortalizing life's sacred chapters through luxury craftsmanship and celestial resonance.
              </p>
            </div>

            {/* Links cols */}
            <div className="footer-nav-col">
              <h4>Gifting Suites</h4>
              <ul>
                <li><a href="#vault">The Sovereign Radiance Suite</a></li>
                <li><a href="#vault">The Midnight Metamorphosis Box</a></li>
                <li><a href="#vault">The Celestial Archivist Box</a></li>
                <li><a href="#vault">The Harmonious Alliance Casket</a></li>
                <li><a href="#vault">The Architect of Legacy Vault</a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Atelier Services</h4>
              <ul>
                <li><a href="#compass">Zodiac Alignment Compass</a></li>
                <li><a href="#concierge">Bespoke Chapter Concierge</a></li>
                <li><a href="#unboxing">The Unboxing Ceremony</a></li>
                <li><a href="#">Birth Chart Verification</a></li>
                <li><a href="#">Corporate & Executive Suites</a></li>
              </ul>
            </div>

            <div className="footer-nav-col">
              <h4>Concierge & Care</h4>
              <ul>
                <li><a href="#">White-Glove Courier</a></li>
                <li><a href="#">Authenticity & Certification</a></li>
                <li><a href="#">Bespoke Commission Inquiries</a></li>
                <li><a href="#">Private Salon Access</a></li>
                <li><a href="#">Atelier Locations</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} YOUNOYA Gifting House. All Rights Reserved. For Every Chapter.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Charter</a>
              <span className="bar-sep">·</span>
              <a href="#">Gemological Terms</a>
              <span className="bar-sep">·</span>
              <a href="#">Celestial Courier Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
