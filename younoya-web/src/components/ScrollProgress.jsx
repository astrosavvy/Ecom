import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import '../styles/ScrollProgress.css'

const CHAPTERS = [
  { id: 'gateway', num: '01', title: 'The Gateway' },
  { id: 'philosophy', num: '02', title: 'For Every Chapter' },
  { id: 'compass', num: '03', title: 'Zodiac Alignment' },
  { id: 'vault', num: '04', title: 'The Gift Vault' },
  { id: 'concierge', num: '05', title: 'Bespoke Concierge' },
  { id: 'unboxing', num: '06', title: 'The Unboxing Ritual' },
  { id: 'whispers', num: '07', title: 'Patron Whispers' },
]

export default function ScrollProgress() {
  const [activeChapter, setActiveChapter] = useState('gateway')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)

      // Detect current active section
      const sections = CHAPTERS.map((ch) => document.getElementById(ch.id)).filter(Boolean)
      const scrollPosition = window.scrollY + window.innerHeight * 0.4

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollPosition) {
          setActiveChapter(CHAPTERS[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToChapter = (id) => {
    const el = document.getElementById(id)
    if (el) {
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: -80, duration: 1.4 })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const currentChapterObj = CHAPTERS.find((c) => c.id === activeChapter) || CHAPTERS[0]

  return (
    <aside className="scroll-tracker" aria-label="Chapter navigation">
      <div className="scroll-tracker__rail">
        <div
          className="scroll-tracker__fill"
          style={{ height: `${scrollProgress}%` }}
        />
        {CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.id
          return (
            <button
              key={ch.id}
              className={`scroll-tracker__dot ${isActive ? 'active' : ''}`}
              onClick={() => scrollToChapter(ch.id)}
              aria-label={`Scroll to ${ch.title}`}
              title={`${ch.num} ${ch.title}`}
            >
              <span className="dot-circle" />
              <span className="dot-label">
                <span className="dot-num">{ch.num}</span>
                <span className="dot-title">{ch.title}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="scroll-tracker__badge">
        <span className="badge-num">{currentChapterObj.num}</span>
        <span className="badge-div">/</span>
        <span className="badge-title">{currentChapterObj.title}</span>
      </div>
    </aside>
  )
}
