import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function FluidReply({ children, note, selected, onClick, index = 0, ...props }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 190, damping: 22 })
  const springY = useSpring(y, { stiffness: 190, damping: 22 })
  function follow(event) {
    if (reduced || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    x.set(((event.clientX - box.left) / box.width - .5) * 7)
    y.set(((event.clientY - box.top) / box.height - .5) * 5)
  }
  return <motion.button {...props} type="button" onClick={onClick}
    className={`guide-fluid-reply${selected ? ' is-selected' : ''}${note ? ' guide-fluid-reply--intention' : ''}`}
    style={reduced ? undefined : { x: springX, y: springY }}
    initial={reduced ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: reduced ? 0 : .35, delay: reduced ? 0 : index * .055 }}
    whileHover={reduced ? undefined : { scale: 1.025 }} whileTap={reduced ? undefined : { scale: .97 }}
    onPointerMove={follow} onPointerLeave={() => { x.set(0); y.set(0) }}>
    <span>{children}{note && <small>{note}</small>}</span><span className="guide-fluid-reply__arrow" aria-hidden="true"><ArrowUpRight size={15} /></span>
  </motion.button>
}
