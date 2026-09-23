import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import '../styles/StoryFilm.css'

const FILM = '/media/younoya-diorama-film-mobile.mp4'
const FILM_DURATION = 26.75
// Seven supplied four-second clips: arrival, entry, consultation, gallery,
// curation, packing, handover. Five frames blend each join in the web master.
const CHAPTER_TIMES = [0, 7.58, 11.38, 18.96]
const CHAPTERS = [
  { id: 'arrival', image: '/media/diorama-arrival.webp', alt: 'Arriving at the Younoya boutique', label: 'Younoya / Gifts with meaning', title: 'Every gift begins', emphasis: 'with someone.' },
  { id: 'consultation', image: '/media/diorama-consultation.webp', alt: 'A thoughtful gift consultation', label: 'A moment to listen', title: 'Their story.', emphasis: 'Your thoughtfulness.' },
  { id: 'curation', image: '/media/diorama-curation.webp', alt: 'Three keepsakes curated in a hamper', label: 'The art of choosing', title: 'Chosen with care.', emphasis: 'Given with meaning.' },
  { id: 'handover', image: '/media/diorama-handover.webp', alt: 'Receiving a wrapped Younoya gift', label: 'From you, with meaning', title: 'Beautifully wrapped.', emphasis: 'Ready for their moment.' },
]

function StoryCaption({ chapter, ending = false }) {
  return <div className={`story-film__caption${ending ? ' story-film__caption--ending' : ''}`}>
    {ending ? <div className="story-film__ending">
      <span>A thought becomes a gift</span>
      <h2>Where shall we <em>begin?</em></h2>
      <nav className="story-film__choices" aria-label="Choose your gift journey">
      <Link to="/shop">
        <span><small>Discover each object</small>Explore the collection</span>
        <i><ArrowUpRight size={20} /></i>
      </Link>
      <Link to="/find-a-gift">
        <span><small>A personal consultation</small>Let Younoya choose</span>
        <i><ArrowUpRight size={20} /></i>
      </Link>
      </nav>
    </div> : <><span>{chapter.label}</span><h2>{chapter.title}<br /><em>{chapter.emphasis}</em></h2></>}
  </div>
}

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

export default function StoryFilm() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [source, setSource] = useState(null)
  const [painted, setPainted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(0)
  const [ending, setEnding] = useState(false)
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
    let retry = 0
    let target = 0
    let lastSeek = 0
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
      if (video.readyState < 2 || video.seeking) return
      const snapped = Math.round(target * 24) / 24
      if (Math.abs(video.currentTime - snapped) < 1 / 48) return
      const delay = 50 - (performance.now() - lastSeek)
      if (delay > 0) {
        if (!retry) retry = window.setTimeout(() => { retry = 0; schedule() }, delay)
        return
      }
      lastSeek = performance.now()
      video.currentTime = Math.min(snapped, Math.max(0, video.duration - 1 / 24))
    }
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(seek) }
    const update = () => {
      const distance = Math.max(1, section.offsetHeight - viewportHeight)
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance))
      const filmProgress = progress
      const duration = Number.isFinite(video.duration) ? video.duration : FILM_DURATION
      const time = filmProgress * duration
      setEnding(time >= duration - 2.5)
      const chapterIndex = CHAPTER_TIMES.findLastIndex(start => time >= start)
      setActive(chapterIndex)
      const fadeIn = chapterIndex === 0 ? 1 : Math.min(1, (time - CHAPTER_TIMES[chapterIndex]) / 0.8)
      const fadeOut = chapterIndex === CHAPTERS.length - 1 ? 1 : Math.min(1, (CHAPTER_TIMES[chapterIndex + 1] - time) / 0.8)
      section.style.setProperty('--caption-opacity', Math.max(0, Math.min(fadeIn, fadeOut)))
      section.style.setProperty('--story-progress', progress)
      if (Number.isFinite(video.duration)) target = filmProgress * Math.max(0, video.duration - 1 / 24)
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
      window.clearTimeout(retry)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', resize)
      section.removeEventListener('pointerdown', prime)
      video.removeEventListener('loadedmetadata', update)
      video.removeEventListener('loadeddata', markPainted)
      video.removeEventListener('seeked', markPainted)
    }
  }, [source, still])

  useEffect(() => {
    const stage = sectionRef.current
    const magnetic = stage.querySelectorAll('.story-film__choices a')
    if (!magnetic.length || window.matchMedia('(pointer: coarse)').matches) return undefined
    const move = event => {
      magnetic.forEach(link => {
        const bounds = link.getBoundingClientRect()
        const dx = event.clientX - (bounds.left + bounds.width / 2)
        const dy = event.clientY - (bounds.top + bounds.height / 2)
        const distance = Math.hypot(dx, dy)
        const strength = Math.max(0, 1 - distance / 230)
        link.style.setProperty('--magnet-x', `${dx * strength * .14}px`)
        link.style.setProperty('--magnet-y', `${dy * strength * .14}px`)
      })
    }
    const reset = () => magnetic.forEach(link => { link.style.setProperty('--magnet-x', '0px'); link.style.setProperty('--magnet-y', '0px') })
    stage.addEventListener('pointermove', move, { passive: true })
    stage.addEventListener('pointerleave', reset)
    return () => { stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', reset) }
  }, [ending, still])

  return (
    <section id="story" ref={sectionRef} className={`story-film${still ? ' story-film--still' : ''}`} aria-label="The Younoya boutique film. Scroll to follow the story.">
      {still ? CHAPTERS.map(chapter => (
        <div className="story-film__still" key={chapter.id}>
          <img src={chapter.image} alt={chapter.alt} loading={chapter.id === 'arrival' ? 'eager' : 'lazy'} />
          <StoryCaption chapter={chapter} ending={chapter.id === 'handover'} />
        </div>
      )) : (
        <div className="story-film__stage">
          <div className={`story-film__media${painted && !failed ? ' is-painted' : ''}`}>
            <img src={CHAPTERS[Math.max(0, active)].image} alt={CHAPTERS[Math.max(0, active)].alt} fetchPriority="high" />
            <video ref={videoRef} src={source || undefined} muted playsInline preload="auto" aria-label="A visit to Younoya: arrival, consultation, curation and gift handover" onError={() => setFailed(true)} />
          </div>
          <StoryCaption chapter={CHAPTERS[Math.max(0, active)]} ending={ending} />
        </div>
      )}
    </section>
  )
}
