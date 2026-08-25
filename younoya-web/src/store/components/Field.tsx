import gsap from "gsap"
import { useRef, type ReactNode } from "react"

/** Animated field: floating label, focus underline + glow, error shake, valid tick. */
export default function Field({
  label,
  children,
  filled = false,
  valid = false,
  invalid = false,
  alwaysFloat = false,
  className = "",
}: {
  label: string
  children: ReactNode
  filled?: boolean
  valid?: boolean
  invalid?: boolean
  /** labels for date/time/select must never overlap the control */
  alwaysFloat?: boolean
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const prevInvalid = useRef(false)

  if (invalid && !prevInvalid.current && root.current) {
    gsap.fromTo(
      root.current,
      { x: 0 },
      { x: 0, keyframes: [{ x: -7 }, { x: 6 }, { x: -4 }, { x: 2 }, { x: 0 }], duration: 0.4, ease: "power2.out" },
    )
  }
  prevInvalid.current = invalid

  const cls = [
    "ff",
    filled || alwaysFloat ? "ff--float" : "",
    valid ? "ff--valid" : "",
    invalid ? "ff--invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div ref={root} className={cls} data-ff>
      <div className="ff__control">
        {children}
        <span className="ff__label">{label}</span>
        <span className="ff__line" aria-hidden="true" />
        {valid && (
          <svg className="ff__tick" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 10.5 8.2 15 16 5.5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  )
}
