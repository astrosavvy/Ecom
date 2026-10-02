import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const STAGES = [
  {
    step: 1,
    title: 'Reading Astrological Coordinates',
    caption: 'Aligning the celestial landscape of your birth moment…',
  },
  {
    step: 2,
    title: 'Curating Your Bespoke Gift Selection',
    caption: 'Consulting the atelier archives based on your details and intentions…',
  },
  {
    step: 3,
    title: 'Harmonizing Keepsakes & Rituals',
    caption: 'Aster is finalizing your signature pieces across all four chapters…',
  },
]

export default function AsterDivinationCeremony({ onComplete, intention = '', isReady = false }) {
  const reduced = useReducedMotion()
  const [currentStage, setCurrentStage] = useState(0)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  useEffect(() => {
    if (reduced) {
      setMinTimeElapsed(true)
      return
    }

    const t1 = setTimeout(() => setCurrentStage(1), 1100)
    const t2 = setTimeout(() => setCurrentStage(2), 2200)
    const t3 = setTimeout(() => setMinTimeElapsed(true), 3300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [reduced])

  useEffect(() => {
    if (minTimeElapsed && isReady) {
      const exitTimer = setTimeout(() => {
        onComplete?.()
      }, 350)
      return () => clearTimeout(exitTimer)
    }
  }, [minTimeElapsed, isReady, onComplete])

  const stage = STAGES[currentStage] || STAGES[0]

  return (
    <motion.section
      className="divination-ceremony"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      aria-live="polite"
      aria-label="Aster Divination Ceremony"
    >
      <div className="divination-ceremony__orb-container">
        <motion.div
          className="divination-ceremony__ring divination-ceremony__ring--outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="divination-ceremony__ring divination-ceremony__ring--inner"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="divination-ceremony__center"
          animate={reduced ? false : {
            scale: [1, 1.26, 0.94, 1.15, 1],
            boxShadow: [
              '0 0 20px rgba(197, 168, 128, 0.35)',
              '0 0 45px rgba(228, 200, 157, 0.75), 0 0 12px rgba(255, 255, 255, 0.8)',
              '0 0 18px rgba(197, 168, 128, 0.25)',
              '0 0 38px rgba(228, 200, 157, 0.65)',
              '0 0 20px rgba(197, 168, 128, 0.35)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.img
            src="/favicon.png"
            alt=""
            className="divination-ceremony__monogram"
            animate={reduced ? false : { scale: [0.94, 1.08, 0.9, 1.04, 0.94] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      <div className="divination-ceremony__content">
        <span className="divination-ceremony__eyebrow">
          <Sparkles size={13} /> Sacred Divination · Phase {currentStage + 1} of 3
        </span>
        <h2 className="divination-ceremony__title">{stage.title}</h2>
        <p className="divination-ceremony__caption">{stage.caption}</p>

        <div className="divination-ceremony__progress-bar">
          <motion.div
            className="divination-ceremony__progress-fill"
            initial={{ width: '15%' }}
            animate={{ width: `${((currentStage + 1) / 3) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.section>
  )
}
