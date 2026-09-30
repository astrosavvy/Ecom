import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import GuideReplyDock from './GuideReplyDock'
import { prefaces, questions } from './guideCopy'
import GuideHistory from './GuideHistory'

export default function GuideConversation(props) {
  const { step, values } = props
  const reducedMotion = useReducedMotion()
  const scroll = useRef(null), question = useRef(null), replies = useRef(null)
  const self = values.forWhom === 'self'
  const titles = questions(self)
  const chapter = ['Who it’s for', self ? 'A little about you' : 'Your connection', 'The moment', 'The intention', 'Optional birth details'][step]
  useEffect(() => {
    const region = scroll.current
    let atEnd = true
    const trackPosition = () => { atEnd = region.scrollHeight - region.clientHeight - region.scrollTop < 12 }
    const resize = new ResizeObserver(() => { if (atEnd) region.scrollTop = region.scrollHeight })
    resize.observe(region)
    region.addEventListener('scroll', trackPosition, { passive: true })
    return () => { resize.disconnect(); region.removeEventListener('scroll', trackPosition) }
  }, [step])
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const region = scroll.current
      region?.scrollTo({ top: region.scrollHeight, behavior: 'instant' })
      ;(replies.current?.querySelector('input') || question.current)?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [step, reducedMotion])
  return <div className={`guide-conversation${step === 0 ? ' guide-conversation--intro' : ''}`}>
    <div className="guide-progress"><div className="guide-progress__chapter"><span>Your gift journey</span><strong>{chapter}</strong></div><div className="guide-progress__track" role="progressbar" aria-label="Gift guide progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of 5 · ${chapter}`}><i style={{ width: `${(step + 1) * 20}%` }} /></div><span className="guide-progress__count">{step + 1} of 5</span></div>
    <div className="guide-chat-scroll" ref={scroll} role="region" tabIndex={0} aria-label="Scrollable gift conversation" data-lenis-prevent>
      <div className="guide-chat-content">
        <GuideHistory values={values} step={step} />
        <motion.div className="guide-question" key={step} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
          <span className="guide-question__preface">{prefaces[step]}</span><h1 ref={question} tabIndex={-1}>{titles[step]}</h1>
        </motion.div>
      </div>
    </div>
    <div ref={replies} className="guide-replies"><GuideReplyDock key={step} {...props} /></div>
  </div>
}
