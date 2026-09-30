import { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export default function AsterStage({ mood, message }) {
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0), tilt = useMotionValue(0)
  const spring = { stiffness: 65, damping: 22 }
  const portraitX = useSpring(x, spring), portraitY = useSpring(y, spring), portraitTilt = useSpring(tilt, spring)
  useEffect(() => { if (reducedMotion) { x.set(0); y.set(0); tilt.set(0) } }, [reducedMotion, x, y, tilt])
  function followPointer(event) {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width - .5
    x.set(horizontal * 9); y.set(((event.clientY - bounds.top) / bounds.height - .5) * 5); tilt.set(horizontal * .8)
  }
  function resetPointer() { x.set(0); y.set(0); tilt.set(0) }
  return <aside className="guide-stage" aria-label="Aster, your gift guide" onPointerMove={followPointer} onPointerLeave={resetPointer}>
    <motion.div className={`guide-stage__figure guide-stage__figure--${mood}`} style={{ x: portraitX, y: portraitY, rotate: portraitTilt }}>
      <div className="guide-stage__portrait">
        <img src="/media/aster-3d-guide.webp" width="640" height="585"
          alt="Aster, Younoya’s guide, rendered in a warm 3D illustration style with her plum jacket and welcoming gesture."
          decoding="async" draggable="false" />
      </div>
    </motion.div>
    <div className="guide-stage__label"><span><i aria-hidden="true" /> Aster · Your personal gift guide</span><strong>{mood === 'thinking' ? 'Finding the meaning in your answers…' : message}</strong></div>
  </aside>
}
