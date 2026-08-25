import { useEffect, useRef } from 'react'
import { SCENES } from '../lib/data'
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToSection } from '../lib/scroll'
import SceneCanvas, { webglAvailable } from '../scene/SceneCanvas'

type Props = {
  stateRef: React.RefObject<{ t: number; vel: number }>
  onProgress?: (loaded: number, total: number) => void
  onReady?: () => void
}

export default function FilmStage({ stateRef, onProgress, onReady }: Props) {
  const stageRef = useRef<HTMLElement>(null)
  const useWebGL =
    typeof window !== 'undefined' && webglAvailable() && !prefersReducedMotion()

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    if (!useWebGL) onReady?.()

    const ctx = gsap.context(() => {
      const chaptersWrap = stage.querySelector<HTMLElement>('.chapters')

      if (useWebGL && chaptersWrap) {
        // master film timeline lives on the chapters block only, so the
        // finale zone keeps scene 5 on screen at t = 1
        // master film timeline: 'bottom top' makes the scroll span exactly N
        // viewports, so scene segments align 1:1 with the 100vh chapter blocks
        // and the last scene stays lit through the finale
        ScrollTrigger.create({
          trigger: chaptersWrap,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate(self) {
            if (stateRef.current) {
              stateRef.current.t = self.progress
              stateRef.current.vel = self.getVelocity() / 1200
            }
          },
        })
      }

      // hero scroll cue fades as soon as the journey starts
      const cue = stage.querySelector<HTMLElement>('.scrollcue')
      if (cue && !prefersReducedMotion()) {
        gsap.to(cue, {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=35%',
            scrub: true,
          },
        })
      }

      // typographic beats: SCRUBBED word reveals — same motion language as
      // the film itself (position-linked, reversible, no discrete tweens)
      stage.querySelectorAll<HTMLElement>('.chapter').forEach((chapter) => {
        const lineEl = chapter.querySelector<HTMLElement>('.chapter__line')
        const eyebrow = chapter.querySelector<HTMLElement>('.chapter__eyebrow')
        if (!lineEl || !eyebrow) return

        // split into word parts; |word| becomes a rose-italic accent
        const words = (lineEl.textContent ?? '').trim().split(/\s+/)
        lineEl.textContent = ''
        const parts = words.map((w) => {
          const accent = w.includes('|')
          const el = document.createElement(accent ? 'em' : 'span')
          el.className = 'w'
          el.style.display = 'inline-block'
          el.style.whiteSpace = 'pre'
          el.textContent = w.replaceAll('|', '')
          lineEl.appendChild(el)
          lineEl.appendChild(document.createTextNode(' '))
          return el
        })

        if (prefersReducedMotion()) return

        const sub = chapter.querySelector('.chapter__sub')
        const scrim = chapter.querySelector('.chapter__scrim')
        const group = [
          ...(scrim ? [scrim] : []),
          eyebrow,
          ...parts,
          ...(sub ? [sub] : []),
        ]

        // ONE timeline drives the whole passage — in, hold, out — so no two
        // tweens ever fight over opacity (a scrubbed .to captures start
        // values at load and will animate 0→0 if it races the reveal).
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: chapter,
              start: 'top 75%',
              end: 'center 10%',
              scrub: 0.6,
            },
          })
          .fromTo(
            group,
            { opacity: 0, filter: 'blur(10px)' },
            { opacity: 1, filter: 'blur(0px)', stagger: 0.02, duration: 0.3 },
            0,
          )
          .to(group, { opacity: 0, duration: 0.26 }, 0.74)
      })

      // finale: wordmark + CTA rise over the resting companion scene
      const finaleInner = stage.querySelector<HTMLElement>('.finale__inner')
      if (finaleInner && !prefersReducedMotion()) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.finale',
              start: 'top 85%',
              end: 'top 25%',
              scrub: 0.6,
            },
          })
          .fromTo(
            '.finale__scrim',
            { autoAlpha: 0 },
            { autoAlpha: 1, ease: 'none' },
            0,
          )
          .fromTo(
            finaleInner.children,
            { autoAlpha: 0, y: 42 },
            { autoAlpha: 1, y: 0, stagger: 0.12, ease: 'power1.out' },
            0.05,
          )
      }
    }, stage)

    return () => ctx.revert()
  }, [stateRef, useWebGL, onReady])

  const fallbackMode = !useWebGL

  return (
    <section className="stage" ref={stageRef} id="film">
      <div className="canvas-wrap" data-fallback={fallbackMode}>
        {!fallbackMode ? (
          <SceneCanvas stateRef={stateRef} onProgress={onProgress} onReady={onReady} />
        ) : (
          <img
            src="/scenes/threshold-c.webp"
            alt="A neon-night miniature gift store under a starry sky"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        <button
          className="scrollcue"
          type="button"
          onClick={() => scrollToSection('#chapter-1')}
        >
          <span className="scrollcue__wheel" aria-hidden="true" />
          Scroll
        </button>
      </div>

      <div className="chapters">
        {SCENES.map((s, i) => (
          <article
            key={s.id}
            className="chapter"
            id={`chapter-${i}`}
            aria-label={`${s.eyebrow} — ${String(s.line).replaceAll('|', '')}`}
          >
            <div className="chapter__scrim" aria-hidden="true" />
            <div className="chapter__inner">
              <p className="chapter__eyebrow">{s.eyebrow}</p>
              <h2 className="chapter__line">{String(s.line)}</h2>
            </div>
          </article>
        ))}
      </div>

      <section className="finale" aria-label="Finale">
        <div className="finale__scrim" aria-hidden="true" />
        <div className="finale__inner">
          <p className="finale__eyebrow">Act V · The Vault</p>
          <p className="finale__mark">
            <em>Every gift,</em>
            <span>a small constellation.</span>
          </p>
          <p className="finale__sub">
            Younoya — consecrated gifting beneath the neon sky.
          </p>
          <button
            className="finale__cta"
            type="button"
            data-hover
            onClick={() => window.location.assign('/journey')}
          >
            <span>Begin the reading</span>
            <i aria-hidden="true">→</i>
          </button>
          <div className="finale__base">
            <span>© {new Date().getFullYear()} Younoya</span>
            <span>Crafted under a waxing moon</span>
          </div>
        </div>
      </section>
    </section>
  )
}
