import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import '../styles/Hero.css'

/* Generate deterministic star positions */
function makeStars(count) {
  const stars = []
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      top: `${(i * 7.3 + 13) % 100}%`,
      left: `${(i * 13.7 + 7) % 100}%`,
      size: 1 + (i % 3),
      dur: `${2 + (i % 4)}s`,
      delay: `${(i * 0.3) % 3}s`,
    })
  }
  return stars
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const starsY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const stars = useMemo(() => makeStars(60), [])

  return (
    <section className="hero" ref={ref}>
      {/* Parallax star field */}
      <motion.div className="hero__stars" style={{ y: starsY }}>
        {stars.map((s) => (
          <span
            key={s.id}
            className="hero__star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              '--dur': s.dur,
              animationDelay: s.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Parallax glow orbs */}
      <motion.div className="hero__orb hero__orb--1" style={{ y: orb1Y }} />
      <motion.div className="hero__orb hero__orb--2" style={{ y: orb2Y }} />

      {/* Content */}
      <motion.div
        className="hero__content"
        style={{ y: contentY, opacity: contentOpacity }}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero__badge" variants={fadeUp} custom={0}>
          ✦ Astrology-Powered Gifting
        </motion.div>

        <motion.h1 className="hero__title" variants={fadeUp} custom={1}>
          Gifts Written in<br />
          <span className="gold-text">the Stars</span>
        </motion.h1>

        <motion.p className="hero__subtitle" variants={fadeUp} custom={2}>
          Discover cosmically aligned gifts curated for every zodiac sign.
          <br />Because the best gifts are destined, not guessed.
        </motion.p>

        <motion.div className="hero__actions" variants={fadeUp} custom={3}>
          <a href="#zodiac" className="btn btn--primary">
            Discover Your Sign ✦
          </a>
          <a href="#how-it-works" className="btn btn--outline">
            How It Works
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}
