import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Compass, ChevronDown } from 'lucide-react'
import '../styles/HeroWorld.css'

export default function HeroWorld() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Multi-plane parallax transforms
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.82])
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const bgZoom = useTransform(scrollYProgress, [0, 1], [1, 1.25])
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -140])
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section className="hero-world" id="gateway" ref={ref}>
      {/* Dynamic Cosmic Depth Canvas */}
      <motion.div className="hero-world__bg" style={{ scale: bgZoom }}>
        <div className="star-mesh" />
        <div className="celestial-grid" />
        <motion.div className="cosmic-ring" style={{ rotate: ringRotate }} />
        <motion.div className="gold-orb gold-orb--left" style={{ y: orbY1 }} />
        <motion.div className="gold-orb gold-orb--right" style={{ y: orbY2 }} />
      </motion.div>

      {/* Hero Content Stage */}
      <div className="hero-world__stage container">
        <motion.div
          className="hero-world__emblem-container"
          style={{ scale: logoScale, y: logoY }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="emblem-halo" />
          <img
            src="/logo-gold.svg"
            alt="YOUNOYA — for every chapter"
            className="hero-world__logo-main"
          />
        </motion.div>

        <motion.div
          className="hero-world__narrative"
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-eyebrow">
            <Sparkles size={14} className="text-gold" />
            <span>BESPOKE GIFTING HOUSE INFUSED WITH CELESTIAL WISDOM</span>
            <Sparkles size={14} className="text-gold" />
          </div>

          <h1 className="hero-world__headline">
            Every meaningful gift is a milestone in time.
            <br />
            <span className="text-gold-gradient">We align your sentiment with the cosmos.</span>
          </h1>

          <p className="hero-world__subtext">
            YOUNOYA curates rare talismans, bespoke fragrance rituals, and celestial keepsakes
            hand-inscribed for your recipient's unique astrological blueprint.
          </p>

          <div className="hero-world__actions">
            <a href="#vault" className="btn-gold">
              <Sparkles size={16} />
              <span>Explore The Vault</span>
            </a>
            <a href="#compass" className="btn-ghost-gold">
              <Compass size={16} />
              <span>Zodiac Alignment Compass</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Atmospheric Ticker */}
      <div className="hero-world__ticker">
        <div className="ticker-track">
          <span>✦ CHAPTER I: SOLAR RETURNS & BIRTHDAYS</span>
          <span className="ticker-sep">◈</span>
          <span>CHAPTER II: WEDDINGS & CELESTIAL UNIONS</span>
          <span className="ticker-sep">◈</span>
          <span>CHAPTER III: CAREER TRIUMPHS & HARVESTS</span>
          <span className="ticker-sep">◈</span>
          <span>CHAPTER IV: SELF-SANCTUARY & LUNAR RITUALS</span>
          <span className="ticker-sep">◈</span>
          <span>CHAPTER I: SOLAR RETURNS & BIRTHDAYS</span>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <motion.div
        className="hero-world__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="scroll-text">SCROLL TO ENTER THE WORLD</span>
        <ChevronDown size={18} className="scroll-chevron" />
      </motion.div>
    </section>
  )
}
