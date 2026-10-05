import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'

export default function FluidReply({ children, note, selected, onClick, index = 0, compact = false, ...props }) {
  const reduced = useReducedMotion()
  const bubbleX = useMotionValue(0), bubbleY = useMotionValue(0)
  function followPointer(event) {
    if (reduced || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    bubbleX.set(event.clientX - box.left); bubbleY.set(event.clientY - box.top)
  }
  return <motion.button {...props} type="button" onClick={onClick}
    className={`guide-fluid-reply${selected ? ' is-selected' : ''}${note ? ' guide-fluid-reply--intention' : ''}${compact ? ' guide-fluid-reply--compact' : ''}`}
    initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reduced ? 0 : .4, delay: reduced ? 0 : index * .045, ease: [.22, 1, .36, 1] }}
    whileTap={reduced ? undefined : { scale: .99 }} onPointerMove={followPointer}>
    {!reduced && <motion.span className="guide-fluid-bubble" style={{ x: bubbleX, y: bubbleY }} aria-hidden="true" />}
    {!compact && <span className="guide-fluid-reply__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>}
    <span className="guide-fluid-reply__label">{children}{note && <small>{note}</small>}</span>
    <span className="guide-fluid-reply__arrow" aria-hidden="true">{selected ? <Check size={16} strokeWidth={1.5} /> : <ArrowUpRight size={17} strokeWidth={1.5} />}</span>
  </motion.button>
}
