import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import GuideReplyDock from './GuideReplyDock'
import { prefaces, questions } from './guideCopy'
import GuideHistory from './GuideHistory'
import GuideProgress from './GuideProgress'
import GuideDialog from './GuideDialog'

export default function GuideConversation(props) {
  const { step, values } = props
  const reducedMotion = useReducedMotion()
  const scroll = useRef(null), question = useRef(null), replies = useRef(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const self = values.forWhom === 'self'
  const titles = questions(self)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const region = scroll.current
      region?.scrollTo({ top: 0, behavior: 'instant' })
      ;(step === 1 ? replies.current?.querySelector('input') : question.current)?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [step, reducedMotion])
  return <div className={`guide-conversation${step === 0 ? ' guide-conversation--intro' : ''}`} data-step={step}>
    <GuideProgress step={step} self={self} onHistory={() => setHistoryOpen(true)} />
    <div className="guide-chat-scroll guide-active-question" ref={scroll} role="region" tabIndex={0} aria-label="Current question and reply options" data-lenis-prevent>
      <div className="guide-chat-content">
        <motion.div className="guide-question" key={step} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .45, ease: [.22, 1, .36, 1] }}>
          <span className="guide-question__preface">{prefaces[step]}</span><h1 ref={question} tabIndex={-1}>{titles[step]}</h1>
        </motion.div>
        <div ref={replies} className="guide-replies"><GuideReplyDock key={step} {...props} /></div>
      </div>
    </div>
    {historyOpen && <GuideDialog title="Your gift conversation" className="guide-dialog--history" onClose={() => setHistoryOpen(false)}><GuideHistory values={values} step={step} /></GuideDialog>}
  </div>
}
