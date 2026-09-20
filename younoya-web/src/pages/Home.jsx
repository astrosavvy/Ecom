import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import FlowShowcase from '../components/FlowShowcase'
import '../styles/CinematicHome.css'

const CATEGORIES = [
  {
    id: 'love-connection',
    name: 'Love & Connection',
    line: 'Connection • Affection • Emotional Presence',
    image: '/media/hero-apple.webp',
    number: '01',
  },
  {
    id: 'confidence-personal-power',
    name: 'Confidence & Personal Power',
    line: 'Confidence • Courage • Self-Expression',
    image: '/media/leopard-keepsake.webp',
    number: '02',
  },
  {
    id: 'vitality-inner-balance',
    name: 'Vitality & Inner Balance',
    line: 'Energy • Calm • Clarity • Grounding',
    image: '/media/constellation-set.webp',
    number: '03',
  },
  {
    id: 'wealth-prosperity',
    name: 'Wealth & Prosperity',
    line: 'Financial Intention • Stability • Growth Mindset',
    image: '/media/oracle-eye.webp',
    number: '04',
  },
]

function CursorAura() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let frame = 0
    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    const move = (event) => {
      x = event.clientX
      y = event.clientY
      dotRef.current?.style.setProperty('transform', `translate3d(${x}px,${y}px,0)`)
      const interactive = event.target.closest('a, button, input, [data-cursor]')
      ringRef.current?.classList.toggle('is-active', Boolean(interactive))
    }
    const tick = () => {
      rx += (x - rx) * 0.17
      ry += (y - ry) * 0.17
      ringRef.current?.style.setProperty('transform', `translate3d(${rx}px,${ry}px,0)`)
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move, { passive: true })
    tick()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return <><span ref={dotRef} className="cursor-dot" /><span ref={ringRef} className="cursor-ring" /></>
}

function ScrollFilm() {
  // This is the approved four-leg lets-scroll chain. It is intentionally used
  // at every viewport until a matching landscape chain is rendered.
  const filmAsset = '/media/younoya-category-film-mobile.mp4'
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const openingRef = useRef(null)
  const categoryRef = useRef(null)
  const [active, setActive] = useState(0)
  const [filmSrc, setFilmSrc] = useState(filmAsset)

  useEffect(() => {
    let objectUrl
    let cancelled = false
    fetch(filmAsset)
      .then((response) => response.blob())
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setFilmSrc(objectUrl)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [filmAsset])

  useEffect(() => {
    const section = sectionRef.current
    const video = videoRef.current
    if (!section || !video) return undefined

    let frame = 0
    let targetTime = 0
    let shownIndex = -1
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const renderProgress = () => {
      const rect = section.getBoundingClientRect()
      const distance = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      const index = Math.min(CATEGORIES.length - 1, Math.floor(progress * CATEGORIES.length))

      if (index !== shownIndex) {
        shownIndex = index
        setActive(index)
      }
      if (video.duration && Number.isFinite(video.duration) && !reducedMotion.matches) {
        targetTime = progress * Math.max(0, video.duration - 0.08)
      }
      if (openingRef.current) openingRef.current.style.opacity = `${Math.max(0, 1 - progress * 8)}`
      if (categoryRef.current) categoryRef.current.style.opacity = `${Math.min(1, Math.max(0, (progress - 0.045) * 9))}`
      section.style.setProperty('--film-progress', progress.toFixed(4))
    }

    const tick = () => {
      if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - targetTime) > 0.025) {
        video.currentTime += (targetTime - video.currentTime) * 0.22
      }
      frame = requestAnimationFrame(tick)
    }

    const prime = () => {
      const promise = video.play()
      if (promise) promise.then(() => video.pause()).catch(() => {})
      window.removeEventListener('pointerdown', prime)
    }

    window.addEventListener('scroll', renderProgress, { passive: true })
    window.addEventListener('resize', renderProgress, { passive: true })
    window.addEventListener('pointerdown', prime, { passive: true })
    video.addEventListener('loadedmetadata', renderProgress)
    renderProgress()
    tick()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', renderProgress)
      window.removeEventListener('resize', renderProgress)
      window.removeEventListener('pointerdown', prime)
      video.removeEventListener('loadedmetadata', renderProgress)
    }
  }, [filmSrc])

  return (
    <section className="film" id="story" ref={sectionRef}>
      <div className="film__sticky">
        <video ref={videoRef} className="film__video" src={filmSrc} poster="/media/hero-apple.webp" muted playsInline preload="auto" aria-hidden="true" />
        <div className="film__shade" />

        <div className="film__opening" ref={openingRef}>
          <div className="film__hero-copy">
            <span>YOUNOYA / OBJECTS OF AFFECTION</span>
            <h1>A gift should feel<br /><em>inevitable.</em></h1>
            <p>Four intentions. One continuous journey.</p>
            <a className="film__hero-cta" href="#finale">Discover Younoya <ArrowRight size={14} /></a>
          </div>
          <span className="film__opening-cue">SCROLL TO ENTER</span>
        </div>

        <div className="film__categories" ref={categoryRef}>
          <div className="film__chapter">
            <span>CHAPTER {CATEGORIES[active].number} / GIFT INTENTIONS</span>
            <AnimatePresence mode="wait">
              <motion.div key={CATEGORIES[active].id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                <h2>{CATEGORIES[active].name}</h2>
                <p>{CATEGORIES[active].line}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="film__progress" aria-hidden="true"><i style={{ width: `${((active + 1) / CATEGORIES.length) * 100}%` }} /></div>
          <span className="film__instruction">SCROLL / MOVE THROUGH THE COLLECTION</span>
        </div>
      </div>
    </section>
  )
}

function Finale() {
  return (
    <section className="quiet-finale" id="finale">
      <img src="/media/ritual-portrait.webp" alt="Younoya sculptural gifting world" />
      <div />
      <article><span>YOUNOYA / FOR EVERY CHAPTER</span><h2>The object is beautiful.<br /><em>The meaning is yours.</em></h2><a className="glow-button" href="#story">Replay the story <ArrowRight size={16} /></a></article>
      <footer><img src="/favicon.png" alt="Younoya" /><span>© 2026 Younoya</span><a href="#story">Gift intentions</a></footer>
    </section>
  )
}

export default function Home() {
  return (
    <div className="cinematic-home">
      <CursorAura />
      <ScrollFilm />
      <FlowShowcase />
      <Finale />
    </div>
  )
}
