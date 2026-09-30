import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

const expressions = ['listen', 'speak', 'blink']

export default function AsterStage({ mood, message }) {
  const reducedMotion = useReducedMotion()
  const [blinking, setBlinking] = useState(false)
  const x = useMotionValue(0), y = useMotionValue(0), tilt = useMotionValue(0)
  const spring = { stiffness: 65, damping: 22 }
  const portraitX = useSpring(x, spring), portraitY = useSpring(y, spring), portraitTilt = useSpring(tilt, spring)
  useEffect(() => {
    if (reducedMotion || mood === 'asking') return undefined
    let reopen
    const interval = setInterval(() => {
      setBlinking(true)
      reopen = setTimeout(() => setBlinking(false), 170)
    }, 5400)
    return () => { clearInterval(interval); clearTimeout(reopen); setBlinking(false) }
  }, [mood, reducedMotion])
  useEffect(() => { if (reducedMotion) { x.set(0); y.set(0); tilt.set(0) } }, [reducedMotion, x, y, tilt])
  const expression = reducedMotion ? 'listen' : mood === 'asking' ? 'speak' : blinking ? 'blink' : 'listen'
  function followPointer(event) {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width - .5
    x.set(horizontal * 9); y.set(((event.clientY - bounds.top) / bounds.height - .5) * 5); tilt.set(horizontal * .8)
  }
  function resetPointer() { x.set(0); y.set(0); tilt.set(0) }
  return <aside className="guide-stage" aria-label="Aster, your gift guide" onPointerMove={followPointer} onPointerLeave={resetPointer}>
    <Link to="/shop" className="guide-stage__return">← Collection</Link>
    <div className="guide-stage__orbit" aria-hidden="true" />
    <motion.div className="guide-stage__figure" style={{ x: portraitX, y: portraitY, rotate: portraitTilt }}>
      <div className="guide-stage__portrait">
        {expressions.map(item => <img key={item} src={`/media/guide-${item}.webp`} width="800" height="800"
          className={expression === item ? 'is-visible' : ''} aria-hidden={item !== 'listen'}
          alt={item === 'listen' ? 'Aster, the Younoya boutique guide, welcoming you in her plum jacket.' : ''}
          decoding="async" draggable="false" />)}
      </div>
    </motion.div>
    <div className="guide-stage__label"><span>YOUR GUIDE · ASTER</span><strong>{message}</strong></div>
  </aside>
}
