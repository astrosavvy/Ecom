import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import gsap from "gsap"

const EASE = "expo.out"

/**
 * FluidCard — the "Aurora Glass" shell.
 * Layers: glass base → drifting aurora blobs → conic gold border shimmer →
 * cursor specular light → grain. 3D tilt via GSAP (off on touch/reduced-motion).
 */
export default function FluidCard({
  children,
  className = "",
  active = true,
}: {
  children: ReactNode
  className?: string
  active?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const spec = useRef<HTMLDivElement>(null)

  // cursor specular light + tilt
  useEffect(() => {
    const el = ref.current
    const s = spec.current
    if (!el || !s) return
    if (matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!active) return

    let raf = 0
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: EASE })
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: EASE })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        s.style.setProperty("--mx", `${px * 100}%`)
        s.style.setProperty("--my", `${py * 100}%`)
        s.style.setProperty("--mo", "1")
      })
      ry((px - 0.5) * 5)
      rx((0.5 - py) * 5)
    }
    const onLeave = () => {
      ry(0)
      rx(0)
      if (s) s.style.setProperty("--mo", "0")
    }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [active])

  return (
    <div className={`fc-deck${active ? " fc-deck--top" : ""}`}>
      {active && (
        <>
          <div className="fc-ghost fc-ghost--1" aria-hidden="true" />
          <div className="fc-ghost fc-ghost--2" aria-hidden="true" />
        </>
      )}
      <div ref={ref} className={`fc${active ? " fc--active" : ""} ${className}`} style={cardStyle} data-fc>
        <div className="fc__aurora" aria-hidden="true">
          <i className="fc__blob fc__blob--gold" />
          <i className="fc__blob fc__blob--rose" />
          <i className="fc__blob fc__blob--mint" />
        </div>
        <div ref={spec} className="fc__spec" aria-hidden="true" />
        <div className="fc__grain" aria-hidden="true" />
        <div className="fc__inner">{children}</div>
      </div>
    </div>
  )
}

const cardStyle: CSSProperties = { transformStyle: "preserve-3d" }
