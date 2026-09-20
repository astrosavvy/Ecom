import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import '../styles/StoryFilm.css'

const FILM = '/media/younoya-category-film-mobile.mp4'
const INTRO_END = 0.12
// Copy follows the actual product arrivals in the approved 32-second film.
const CHAPTER_TIMES = [0, 10, 20, 27]
const CHAPTERS = [
  { id: 'love-connection', label: 'Connection', title: 'For the bonds', emphasis: 'that become home.', body: 'A little warmth. A lasting reminder. Give something that says what words sometimes cannot.', image: '/media/love-connection.webp', accent: '#E0A996' },
  { id: 'confidence-personal-power', label: 'Confidence', title: 'For the courage', emphasis: 'to begin again.', body: 'Mark a brave decision, a new direction, or the quiet moment someone chooses themselves.', image: '/media/confidence-personal-power.webp', accent: '#F0D08F' },
  { id: 'vitality-inner-balance', label: 'Balance', title: 'For a moment', emphasis: 'of coming back.', body: 'Make space for a slower ritual. A considered keepsake for the everyday art of finding your balance.', image: '/media/vitality-inner-balance.webp', accent: '#8FA892' },
  { id: 'wealth-prosperity', label: 'Prosperity', title: 'For everything', emphasis: 'still to unfold.', body: 'Celebrate a milestone and the possibilities ahead. A meaningful gesture for their next chapter.', image: '/media/wealth-prosperity.webp', accent: '#D6B06A' },
]

function useStillExperience() {
  const [still, setStill] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(navigator.connection?.saveData))
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setStill(query.matches || Boolean(navigator.connection?.saveData))
    query.addEventListener('change', update)
    navigator.connection?.addEventListener('change', update)
    return () => {
      query.removeEventListener('change', update)
      navigator.connection?.removeEventListener('change', update)
    }
  }, [])
  return still
}

function ChapterCopy({ chapter, index }) {
  return <>
    <span className="story-film__eyebrow">CHAPTER 0{index + 1} / {chapter.label}</span>
    <h2>{chapter.title}<br /><em>{chapter.emphasis}</em></h2>
    <p>{chapter.body}</p>
    <Link className="story-film__link" to={`/product/${chapter.id}`}>Explore {chapter.label.toLowerCase()} <ArrowUpRight size={17} /></Link>
  </>
}

export default function StoryFilm() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [source, setSource] = useState(null)
  const [painted, setPainted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(-1)
  const still = useStillExperience()

  useEffect(() => {
    if (still) return undefined
    const controller = new AbortController()
    let objectUrl
    setPainted(false)
    setFailed(false)
    fetch(FILM, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Film unavailable: ${response.status}`)
        return response.blob()
      })
      .then(blob => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setSource(objectUrl)
      })
      .catch(error => { if (error.name !== 'AbortError') setFailed(true) })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setSource(null)
    }
  }, [still])

  useEffect(() => {
    if (still) return undefined
    const section = sectionRef.current
    const video = videoRef.current
    let frame = 0
    let target = 0
    let width = window.innerWidth
    let viewportHeight = window.innerHeight
    let disposed = false
    let primed = false
    const touch = window.matchMedia('(pointer: coarse)').matches
    const measure = () => {
      if (!touch || width !== window.innerWidth) {
        width = window.innerWidth
        viewportHeight = window.innerHeight
        section.style.setProperty('--story-height', `${viewportHeight}px`)
      }
    }
    section.style.setProperty('--story-height', `${viewportHeight}px`)
    const seek = () => {
      frame = 0
      if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - target) > 1 / 48) video.currentTime = target
    }
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(seek) }
    const update = () => {
      const distance = Math.max(1, section.offsetHeight - viewportHeight)
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance))
      const filmProgress = Math.max(0, Math.min(1, (progress - INTRO_END) / (1 - INTRO_END)))
      setActive(progress < INTRO_END ? -1 : CHAPTER_TIMES.findLastIndex(time => filmProgress * 32 >= time))
      section.style.setProperty('--story-progress', progress)
      section.style.setProperty('--opening-opacity', Math.max(0, 1 - progress / INTRO_END))
      section.style.setProperty('--opening-scale', 1 + Math.min(progress / INTRO_END, 1) * 0.07)
      if (Number.isFinite(video.duration)) target = filmProgress * Math.max(0, video.duration - 0.05)
      schedule()
    }
    const resize = () => { measure(); update() }
    const markPainted = () => { if (!disposed && video.readyState >= 2) setPainted(true); schedule() }
    const prime = () => {
      if (!touch || primed || !source || video.readyState < 2) return
      primed = true
      video.play()?.then(() => { video.pause(); if (!disposed) { update(); markPainted() } }).catch(() => { primed = false })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    section.addEventListener('pointerdown', prime, { passive: true })
    video.addEventListener('loadedmetadata', update)
    video.addEventListener('loadeddata', markPainted)
    video.addEventListener('seeked', markPainted)
    update()
    if (video.readyState >= 2) markPainted()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', resize)
      section.removeEventListener('pointerdown', prime)
      video.removeEventListener('loadedmetadata', update)
      video.removeEventListener('loadeddata', markPainted)
      video.removeEventListener('seeked', markPainted)
    }
  }, [source, still])

  const goToChapter = index => {
    const section = sectionRef.current
    if (still) {
      document.getElementById(index < 0 ? 'story' : `story-${CHAPTERS[index].id}`)?.scrollIntoView()
      return
    }
    const progress = index < 0 ? 0 : INTRO_END + ((CHAPTER_TIMES[index] + 0.6) / 32) * (1 - INTRO_END)
    const height = parseFloat(section.style.getPropertyValue('--story-height')) || window.innerHeight
    const top = window.scrollY + section.getBoundingClientRect().top + progress * (section.offsetHeight - height)
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.25 })
    else window.scrollTo({ top, behavior: 'smooth' })
  }

  const pointerDepth = event => {
    if (still || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${(event.clientX / rect.width - 0.5) * 8}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`)
  }

  return (
    <section id="story" ref={sectionRef} className={`story-film${still ? ' story-film--still' : ''}`} aria-label="The Younoya story">
      <div className="story-film__stage" onPointerMove={pointerDepth} onPointerLeave={event => { event.currentTarget.style.setProperty('--pointer-x', '0px'); event.currentTarget.style.setProperty('--pointer-y', '0px') }}>
        {!still && <div className={`story-film__media${painted && !failed ? ' is-painted' : ''}`} aria-hidden="true">
          <img src={CHAPTERS[Math.max(0, active)].image} alt="" />
          <video ref={videoRef} src={source || undefined} muted playsInline preload="auto" onError={() => setFailed(true)} />
        </div>}
        <picture className="story-film__opening-image" aria-hidden="true">
          <source media="(max-width: 700px)" srcSet="/media/younoya-hamper-hero-portrait-9x16.jpg" />
          <img src="/media/younoya-hamper-hero-landscape-16x9.jpg" alt="" fetchPriority="high" />
        </picture>
        <div className="story-film__scrim" aria-hidden="true" />
        <div className="story-film__intro" inert={!still && active !== -1}>
          <span className="story-film__eyebrow">MEANINGFUL GIFTS. WRITTEN IN THE STARS.</span>
          <h1>A gift should<br />feel <em>inevitable.</em></h1>
          <p>Astrology-backed gifting, <br />curated for what matters.</p>
          <button className="story-film__link" onClick={() => goToChapter(0)}>Enter the story <ArrowDown size={16} /></button>
        </div>
        {!still && CHAPTERS.map((chapter, index) => <article key={chapter.id} className="story-film__chapter" style={{ '--chapter-accent': chapter.accent }} hidden={active !== index}>
          <ChapterCopy chapter={chapter} index={index} />
        </article>)}
        <div className="story-film__topline" aria-hidden="true"><span>THE ART OF GIVING</span><span>FOR EVERY CHAPTER.</span></div>
        {!still && <div className="story-film__bottom">
          <span className="story-film__scroll"><ArrowDown size={15} /> Scroll to unfold</span>
          <nav className="story-film__rail" aria-label="Story chapters">
            <button aria-label="Return to story opening" aria-current={active === -1 ? 'step' : undefined} onClick={() => goToChapter(-1)}><span className="story-film__rail-number">✦</span><span className="story-film__rail-label">Opening</span></button>
            {CHAPTERS.map((chapter, index) => <button key={chapter.id} aria-label={`Chapter ${index + 1}: ${chapter.label}`} aria-current={active === index ? 'step' : undefined} onClick={() => goToChapter(index)}><span className="story-film__rail-number">0{index + 1}</span><span className="story-film__rail-label">{chapter.label}</span></button>)}
          </nav>
          <a className="story-film__skip" href="#intentions">The collection <ArrowUpRight size={15} /></a>
        </div>}
        {!still && <div className="story-film__progress" aria-hidden="true" />}
      </div>
      {still && CHAPTERS.map((chapter, index) => <article id={`story-${chapter.id}`} key={chapter.id} className="story-film__static-chapter" style={{ '--chapter-accent': chapter.accent }}>
        <img src={chapter.image} alt={`Younoya ${chapter.label.toLowerCase()} keepsake collection`} loading="lazy" />
        <div><ChapterCopy chapter={chapter} index={index} /></div>
      </article>)}
    </section>
  )
}
