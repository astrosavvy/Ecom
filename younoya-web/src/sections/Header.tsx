import { useEffect, useRef, useState } from 'react'
import { gsap, scrollToSection, ScrollTrigger } from '../lib/scroll'
import { SCENES } from '../lib/data'

export function Header() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      ticking = false
      const y = window.scrollY
      el.dataset.scrolled = y > 50 ? 'true' : 'false'
      // hide on fast down-scroll, reveal on any up-scroll
      const goingDown = y > lastY + 4
      const goingUp = y < lastY - 4
      if (goingDown && y > 220) el.dataset.hidden = 'true'
      else if (goingUp) el.dataset.hidden = 'false'
      if (goingDown || goingUp) lastY = y
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="header" ref={ref} data-hidden="false">
      <a className="brand" href="#top" aria-label="Younoya home">
        <span className="brand__mark" aria-hidden="true" />
      </a>
      <p className="header__tagline">Younoya — Astrology Recommendation Engine for Gifting</p>
      <button
        className="header__cta"
        type="button"
        onClick={() => window.location.assign('/journey')}
        data-hover
      >
        Begin the Journey
      </button>
    </header>
  )
}

const COUNT = SCENES.length

export function Rail() {
  const fillRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    // continuous progress line + chapter index — one trigger, mutated directly
    const st = ScrollTrigger.create({
      trigger: '.chapters',
      start: 'top top',
      end: 'bottom top',
      onUpdate(self) {
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleY(${self.progress})`
        }
        setActive(Math.min(COUNT - 1, Math.max(0, Math.floor(self.progress * COUNT))))
      },
    })
    return () => st.kill()
  }, [])

  const jump = (i: number) => scrollToSection(`#chapter-${i}`)

  return (
    <nav className="rail" aria-label="Chapters">
      <span className="rail__count">{String(active + 1).padStart(2, '0')}</span>
      <div className="rail__track" aria-hidden="true">
        <div className="rail__fill" ref={fillRef} />
      {Array.from({ length: COUNT }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to chapter ${i + 1}`}
          aria-current={active === i ? 'true' : undefined}
          data-active={active === i}
          onClick={() => jump(i)}
          style={{ pointerEvents: 'auto', top: `${(i / (COUNT - 1)) * 100}%` }}
        />
      ))}
      </div>
      <span className="rail__count rail__count--dim">{String(COUNT).padStart(2, '0')}</span>
    </nav>
  )
}

export function Cursor() {
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarse || reduced) return

    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    document.body.append(dot, ring)

    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.38, ease: 'power3.out' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.38, ease: 'power3.out' })

    let shown = false
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement | null)?.closest(
        'button, a, [data-hover]',
      )
      ring.dataset.hover = hit ? 'true' : 'false'
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      dot.remove()
      ring.remove()
    }
  }, [])

  return null
}
