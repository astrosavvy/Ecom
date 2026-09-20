import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import '../styles/HowItWorks.css'

const STEPS = [
  {
    num: 1,
    icon: '🌙',
    title: 'Enter Their Sign',
    desc: "Tell us your recipient's zodiac sign — or their birthday and we'll figure it out.",
  },
  {
    num: 2,
    icon: '✨',
    title: 'Cosmic Match',
    desc: 'Our algorithm aligns planetary energies with curated products tailored to their sign.',
  },
  {
    num: 3,
    icon: '🎁',
    title: 'Gift with Meaning',
    desc: 'Send a beautifully wrapped gift with a personalized astrology card included.',
  },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const revealUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HowItWorks() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section className="how-works section-pad" id="how-it-works" ref={ref}>
      <div className="container">
        <motion.div
          className="how-works__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="how-works__label">✦ Simple & Magical</p>
          <h2 className="how-works__title">
            How It <span className="gold-text">Works</span>
          </h2>
        </motion.div>

        <motion.div
          className="how-works__steps"
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {STEPS.map((step) => (
            <motion.div key={step.num} className="how-works__step" variants={revealUp}>
              <div className="how-works__step-num">{step.num}</div>
              <span className="how-works__step-icon">{step.icon}</span>
              <h3 className="how-works__step-title">{step.title}</h3>
              <p className="how-works__step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
