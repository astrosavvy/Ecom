import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Segmented OTP input — auto-advance, backspace nav, paste fill,
 * auto-submit on complete, mint success pulse.
 */
export default function OtpInput({
  value,
  onChange,
  length = 4,
  onComplete,
  success = false,
  disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  length?: number
  onComplete?: (v: string) => void
  success?: boolean
  disabled?: boolean
}) {
  const cells = useRef<Array<HTMLInputElement | null>>([])
  const root = useRef<HTMLDivElement>(null)
  const digits = value.padEnd(length).slice(0, length).split("")

  useEffect(() => {
    if (success && root.current) {
      gsap.fromTo(
        root.current.querySelectorAll(".otp__cell"),
        { boxShadow: "0 0 0 rgba(52,211,153,0)" },
        {
          boxShadow: "0 0 22px rgba(52,211,153,0.55)",
          borderColor: "#34d399",
          stagger: 0.06,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
        },
      )
    }
  }, [success])

  const enterDigit = (i: number, d: string) => {
    const next = value.slice(0, i) + d + value.slice(i + 1)
    onChange(next)
    const cell = cells.current[i]
    if (cell) gsap.fromTo(cell, { scale: 1.12 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)" })
    if (i < length - 1) cells.current[i + 1]?.focus()
    else if (next.replace(/\D/g, "").length === length) onComplete?.(next.trim())
  }

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (/^\d$/.test(e.key)) {
      e.preventDefault()
      enterDigit(i, e.key)
    } else if (e.key === "Backspace") {
      if (value[i]) {
        onChange(value.slice(0, i) + value.slice(i + 1))
      } else if (i > 0) {
        cells.current[i - 1]?.focus()
        onChange(value.slice(0, i - 1))
      }
      e.preventDefault()
    } else if (e.key === "ArrowLeft" && i > 0) cells.current[i - 1]?.focus()
    else if (e.key === "ArrowRight" && i < length - 1) cells.current[i + 1]?.focus()
  }

  // onChange only serves autofill / IME paths that bypass keydown
  const onInput = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "")
    if (clean.length > 1) {
      const full = clean.slice(0, length)
      onChange(full)
      cells.current[length - 1]?.focus()
      if (full.length === length) onComplete?.(full)
    } else if (clean && clean !== digits[i]) {
      enterDigit(i, clean)
    }
  }

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!text) return
    e.preventDefault()
    onChange(text)
    cells.current[Math.min(text.length, length - 1)]?.focus()
    if (text.length === length) onComplete?.(text)
  }

  return (
    <div className="otp" ref={root} data-ff>
      <span className="ff__label">Verification code</span>
      <div className="otp__row" role="group" aria-label="Verification code">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => {
              cells.current[i] = el
            }}
            className={`otp__cell${digits[i].trim() ? " otp__cell--on" : ""}`}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digits[i].trim()}
            disabled={disabled}
            onChange={(e) => onInput(i, e)}
            onKeyDown={(e) => onKey(i, e)}
            onPaste={onPaste}
            onFocus={(e) => e.target.select()}
            aria-label={`Digit ${i + 1} of ${length}`}
          />
        ))}
      </div>
    </div>
  )
}
