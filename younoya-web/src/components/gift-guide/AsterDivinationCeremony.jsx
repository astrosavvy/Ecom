import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const STAGES = [
  {
    step: 1,
    title: 'Charting Celestial Coordinates',
    caption: 'Aster is reading your natal planetary alignment…',
  },
  {
    step: 2,
    title: 'Calculating Moon Sign & Active Dasha',
    caption: 'Mapping the subtle shifts of your present energetic climate…',
  },
  {
    step: 3,
    title: 'Curating Sacred Keepsakes & Rituals',
    caption: 'Consulting the atelier archives for your intention chapter…',
  },
]

export default function AsterDivinationCeremony({ onComplete, intention = '' }) {
  const reduced = useReducedMotion()
  const [currentStage, setCurrentStage] = useState(0)

  useEffect(() => {
    if (reduced) {
      const quick = setTimeout(() => onComplete?.(), 800)
      return () => clearTimeout(quick)
    }

    const t1 = setTimeout(() => setCurrentStage(1), 1100)
    const t2 = setTimeout(() => setCurrentStage(2), 2200)
    const t3 = setTimeout(() => onComplete?.(), 3300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [reduced, onComplete])

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
        <div className="divination-ceremony__center">
          <img src="/favicon.png" alt="" className="divination-ceremony__monogram" />
        </div>
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
