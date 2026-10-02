import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function TypewriterText({
  text = '',
  speed = 18,
  onComplete,
  className = '',
  cursorColor = '#C5A880',
}) {
  const reduced = useReducedMotion()
  const [displayedLength, setDisplayedLength] = useState(reduced ? text.length : 0)
  const [isTyping, setIsTyping] = useState(!reduced)
  const timerRef = useRef(null)

  useEffect(() => {
    if (reduced) {
      setDisplayedLength(text.length)
      setIsTyping(false)
      onComplete?.()
      return
    }

    setDisplayedLength(0)
    setIsTyping(true)
    let currentIdx = 0

    function typeNext() {
      if (currentIdx < text.length) {
        currentIdx += 1
        setDisplayedLength(currentIdx)
        timerRef.current = setTimeout(typeNext, speed)
      } else {
        setIsTyping(false)
        onComplete?.()
      }
    }

    timerRef.current = setTimeout(typeNext, speed)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, speed, reduced, onComplete])

  const handleSkip = () => {
    if (isTyping) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setDisplayedLength(text.length)
      setIsTyping(false)
      onComplete?.()
    }
  }

  return (
    <span
      className={`typewriter-text ${className}`}
      onClick={handleSkip}
      title={isTyping ? 'Click to show full reading' : undefined}
      style={{ cursor: isTyping ? 'pointer' : 'default' }}
    >
      {text.slice(0, displayedLength)}
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
  )
}
