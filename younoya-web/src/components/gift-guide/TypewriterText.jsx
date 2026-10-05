import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function TypewriterText({
  text = '',
  duration = 2500,
  onComplete,
  className = '',
  cursorColor = '#C5A880',
}) {
  const reduced = useReducedMotion()
  const [displayedLength, setDisplayedLength] = useState(reduced ? text.length : 0)
  const [isTyping, setIsTyping] = useState(!reduced)
  const frameRef = useRef(null)
  const completeRef = useRef(onComplete)
  useEffect(() => { completeRef.current = onComplete }, [onComplete])

  useEffect(() => {
    if (reduced || !text || duration <= 0) {
      setDisplayedLength(text.length)
      setIsTyping(false)
      completeRef.current?.()
      return
    }

    setDisplayedLength(0)
    setIsTyping(true)
    const start = performance.now()
    function typeNext(now) {
      const progress = Math.min(1, (now - start) / duration)
      setDisplayedLength(Math.floor(text.length * progress))
      if (progress === 1) {
        frameRef.current = null
        setIsTyping(false)
        completeRef.current?.()
      } else frameRef.current = requestAnimationFrame(typeNext)
    }

    frameRef.current = requestAnimationFrame(typeNext)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text, duration, reduced])

  const handleSkip = () => {
    if (isTyping) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
      setDisplayedLength(text.length)
      setIsTyping(false)
      completeRef.current?.()
    }
  }

  return (
    <span
      className={`typewriter-text ${className}`}
      onClick={handleSkip}
      onKeyDown={event => {
        if (isTyping && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault(); handleSkip()
        }
      }}
      role={isTyping ? 'button' : undefined}
      tabIndex={isTyping ? 0 : undefined}
      title={isTyping ? 'Click to show full reading' : undefined}
      data-typing={isTyping}
    >
      <span className="typewriter-text__measure" aria-hidden="true">{text}</span>
      <span className="sr-only">{text}</span>
      <span className="typewriter-text__visible" aria-hidden="true">{text.slice(0, displayedLength)}
      {isTyping && (
        <span
          className="typewriter-cursor"
          style={{ color: cursorColor }}
          aria-hidden="true"
        >
          ▍
        </span>
      )}
      </span>
    </span>
  )
}
