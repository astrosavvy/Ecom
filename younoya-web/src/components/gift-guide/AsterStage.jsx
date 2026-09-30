import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export default function AsterStage({ mood, intro = false }) {
  const reducedMotion = useReducedMotion()
  const video = useRef(null)
  const [failed, setFailed] = useState(false), [playing, setPlaying] = useState(false)
  const [source, setSource] = useState('')
  const x = useMotionValue(0), y = useMotionValue(0), tilt = useMotionValue(0)
  const spring = { stiffness: 65, damping: 22 }
  const portraitX = useSpring(x, spring), portraitY = useSpring(y, spring), portraitTilt = useSpring(tilt, spring)
  useEffect(() => { if (reducedMotion) { x.set(0); y.set(0); tilt.set(0) } }, [reducedMotion, x, y, tilt])
  useEffect(() => {
    if (reducedMotion !== false || failed) return undefined
    const controller = new AbortController()
    let url
    fetch('/media/aster-lady-loop-v2.mp4', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Animation unavailable'); return response.blob() })
      .then(blob => { if (!controller.signal.aborted) { url = URL.createObjectURL(blob); setSource(url) } })
      .catch(issue => { if (issue.name !== 'AbortError' && !controller.signal.aborted) setFailed(true) })
    return () => { controller.abort(); if (url) URL.revokeObjectURL(url); setSource('') }
  }, [reducedMotion, failed])
  useEffect(() => {
    const element = video.current
    if (!element || reducedMotion || failed) return undefined
    let visible = true, disposed = false
    const update = () => {
      if (document.hidden || !visible) element.pause()
      else element.play().catch(issue => {
        if (!disposed && visible && !document.hidden && issue.name !== 'AbortError') setFailed(true)
      })
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return () => { disposed = true; observer.disconnect(); document.removeEventListener('visibilitychange', update); element.pause() }
  }, [reducedMotion, failed, source])
  function followPointer(event) {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width - .5
    x.set(horizontal * 9); y.set(((event.clientY - bounds.top) / bounds.height - .5) * 5); tilt.set(horizontal * .8)
  }
  function resetPointer() { x.set(0); y.set(0); tilt.set(0) }
  return <aside className={`guide-stage${intro ? ' guide-stage--intro' : ''}`} aria-label="Aster, your gift guide" onPointerMove={followPointer} onPointerLeave={resetPointer}>
    <motion.div className={`guide-stage__figure guide-stage__figure--video guide-stage__figure--${mood}`} style={{ x: portraitX, y: portraitY, rotate: portraitTilt }}>
      <div className={`guide-stage__portrait guide-stage__portrait--video${playing && !reducedMotion && !failed ? ' is-playing' : ''}`}>
        <img src="/media/aster-lady-loop-poster-v2.webp" width="480" height="392"
          alt="Aster, Younoya’s guide, in her plum jacket with a welcoming open-palm gesture."
          decoding="async" draggable="false" />
        {source && reducedMotion === false && !failed && <video ref={video} src={source}
          poster="/media/aster-lady-loop-poster-v2.webp" width="480" height="392" autoPlay muted loop playsInline
          preload="metadata" aria-hidden="true" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />}
      </div>
    </motion.div>
    <div className="guide-stage__label"><span><i aria-hidden="true" /> Aster · Your personal gift guide</span></div>
  </aside>
}
