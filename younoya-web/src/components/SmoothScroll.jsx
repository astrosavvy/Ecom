import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    window.__lenis = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    // Handle hash links smoothly
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a')
      if (target && target.hash && target.origin === window.location.origin) {
        const elem = document.querySelector(target.hash)
        if (elem) {
          e.preventDefault()
          lenis.scrollTo(elem, { offset: -80, duration: 1.4 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', handleAnchorClick)
      delete window.__lenis
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
