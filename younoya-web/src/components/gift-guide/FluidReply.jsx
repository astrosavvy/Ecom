import { useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function FluidReply({ children, note, selected, onClick, index = 0, ...props }) {
  const reduced = useReducedMotion()
  const [fluidPos, setFluidPos] = useState({ x: 50, y: 50, isHovered: false })
  const x = useMotionValue(0), y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 190, damping: 22 })
  const springY = useSpring(y, { stiffness: 190, damping: 22 })

  function handlePointerMove(event) {
    if (reduced || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    const relX = ((event.clientX - box.left) / box.width) * 100
    const relY = ((event.clientY - box.top) / box.height) * 100
    setFluidPos({ x: relX, y: relY, isHovered: true })
    x.set(((event.clientX - box.left) / box.width - 0.5) * 6)
    y.set(((event.clientY - box.top) / box.height - 0.5) * 4)
  }

  function handlePointerLeave() {
    setFluidPos(prev => ({ ...prev, isHovered: false }))
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      {...props}
      type="button"
      onClick={onClick}
      className={`guide-fluid-reply${selected ? ' is-selected' : ''}${note ? ' guide-fluid-reply--intention' : ''}`}
      style={reduced ? undefined : { x: springX, y: springY }}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : index * 0.05 }}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Interactive Liquid Fluid Bubble Fill */}
      <span
        className="guide-fluid-bubble"
        style={{
          left: `${fluidPos.x}%`,
          top: `${fluidPos.y}%`,
          opacity: fluidPos.isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <span className="guide-fluid-reply__label">
        {children}
        {note && <small>{note}</small>}
      </span>
      <span className="guide-fluid-reply__arrow" aria-hidden="true">
        <ArrowUpRight size={15} />
      </span>
    </motion.button>
  )
}
