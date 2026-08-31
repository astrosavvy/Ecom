import { useEffect, useRef, type ReactNode, type ButtonHTMLAttributes } from "react"
import gsap from "gsap"

// Re-export of FluidButton with design-system naming + token compliance
// Uses .fbtn styles from global.css (now tokenized via tokens.css)

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  loading?: boolean
  variant?: "solid" | "ghost" | "outline"
}

export function Button({ children, loading = false, variant = "solid", className = "", disabled, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const ripples = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "expo.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "expo.out" })
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist < Math.max(60, r.width)) {
        xTo(gsap.utils.clamp(-4, 4, dx * 0.12))
        yTo(gsap.utils.clamp(-4, 4, dy * 0.12))
      } else { xTo(0); yTo(0) }
    }
    const onLeave = () => { xTo(0); yTo(0) }
    window.addEventListener("pointermove", onMove, { passive: true })
    el.addEventListener("pointerleave", onLeave)
    return () => { window.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave) }
  }, [])

  const ripple = (e: React.PointerEvent) => {
    const host = ripples.current
    const el = ref.current
    if (!host || !el) return
    const r = el.getBoundingClientRect()
    const s = document.createElement("span")
    const size = Math.max(r.width, r.height) * 2.2
    s.className = "fbtn__ripple"
    s.style.width = s.style.height = `${size}px`
    s.style.left = `${e.clientX - r.left - size / 2}px`
    s.style.top = `${e.clientY - r.top - size / 2}px`
    host.appendChild(s)
    s.addEventListener("animationend", () => s.remove(), { once: true })
  }

  const variantClass = variant === "ghost" ? "fbtn--ghost" : variant === "outline" ? "fbtn--ghost" : ""
  return (
    <button ref={ref} className={`fbtn ${variantClass}${loading ? " fbtn--loading" : ""} ${className}`} disabled={disabled || loading} onPointerDown={ripple} {...rest}>
      <span className="fbtn__shine" aria-hidden="true" />
      <span ref={ripples} className="fbtn__ripples" aria-hidden="true" />
      <span className="fbtn__label">{children}</span>
      <span className="fbtn__spinner" aria-hidden="true" />
    </button>
  )
}

export default Button
