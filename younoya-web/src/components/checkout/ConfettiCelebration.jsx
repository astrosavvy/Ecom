import { useEffect, useRef } from 'react'

const COLORS = ['#D4AF37', '#F3E5AB', '#C5A880', '#E5C38C', '#8D683D', '#FAF7F2', '#E0A96D', '#2B6E3F']

export default function ConfettiCelebration() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Respect user's reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let startTime = null
    const duration = 3800 // 3.8 seconds total party bomb

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    const width = rect.width || 600
    const height = rect.height || 400

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Center of explosion (originating from checkmark emblem)
    const originX = width / 2
    const originY = height * 0.38

    // Generate 85 celebratory particles
    const particleCount = 85
    const particles = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 11 + 4.5
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed * (Math.random() * 0.8 + 0.6),
        vy: (Math.sin(angle) * speed - (Math.random() * 5 + 3)) * 0.9,
        size: Math.random() * 7 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.12 + 0.05,
        gravity: 0.28,
        drag: 0.965,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      }
    })

    function render(timestamp) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      ctx.clearRect(0, 0, width, height)

      const fadeOutProgress = elapsed > 2400 ? (elapsed - 2400) / 1400 : 0

      particles.forEach(p => {
        p.vx *= p.drag
        p.vy = p.vy * p.drag + p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.wobble += p.wobbleSpeed
        p.alpha = Math.max(0, 1 - fadeOutProgress)

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)

        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      })

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, width, height)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="celebration-confetti-canvas"
      aria-hidden="true"
    />
  )
}
