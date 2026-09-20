import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/ZodiacWheel.css'

const SIGNS = [
  { symbol: '♈', name: 'Aries',       dates: 'Mar 21 – Apr 19', element: 'fire' },
  { symbol: '♉', name: 'Taurus',      dates: 'Apr 20 – May 20', element: 'earth' },
  { symbol: '♊', name: 'Gemini',      dates: 'May 21 – Jun 20', element: 'air' },
  { symbol: '♋', name: 'Cancer',      dates: 'Jun 21 – Jul 22', element: 'water' },
  { symbol: '♌', name: 'Leo',         dates: 'Jul 23 – Aug 22', element: 'fire' },
  { symbol: '♍', name: 'Virgo',       dates: 'Aug 23 – Sep 22', element: 'earth' },
  { symbol: '♎', name: 'Libra',       dates: 'Sep 23 – Oct 22', element: 'air' },
  { symbol: '♏', name: 'Scorpio',     dates: 'Oct 23 – Nov 21', element: 'water' },
  { symbol: '♐', name: 'Sagittarius', dates: 'Nov 22 – Dec 21', element: 'fire' },
  { symbol: '♑', name: 'Capricorn',   dates: 'Dec 22 – Jan 19', element: 'earth' },
  { symbol: '♒', name: 'Aquarius',    dates: 'Jan 20 – Feb 18', element: 'air' },
  { symbol: '♓', name: 'Pisces',      dates: 'Feb 19 – Mar 20', element: 'water' },
]

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardPop = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function ZodiacWheel() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className="zodiac section-pad" id="zodiac" ref={ref}>
      <div className="container">
        <motion.div
          className="zodiac__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="zodiac__label">✦ Choose Your Sign</p>
          <h2 className="zodiac__title">
            Shop by <span className="gold-text">Zodiac</span>
          </h2>
          <p className="zodiac__desc">
            Every sign has a unique personality — and we've curated gifts to match.
          </p>
        </motion.div>

        <motion.div
          className="zodiac__grid"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {SIGNS.map((sign) => (
            <motion.div
              key={sign.name}
              className="zodiac__sign"
              variants={cardPop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="zodiac__sign-symbol">{sign.symbol}</span>
              <p className="zodiac__sign-name">{sign.name}</p>
              <p className="zodiac__sign-dates">{sign.dates}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
