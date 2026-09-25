import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

export default function SmoothScroll({ children }) {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      window.__lenis?.destroy()
      delete window.__lenis
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis
    let frame = 0
    const configure = () => {
      cancelAnimationFrame(frame)
      lenis?.destroy()
      delete window.__lenis
      lenis = undefined
      if (reduced.matches) return
      lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), orientation: 'vertical', gestureOrientation: 'vertical', smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2 })
      window.__lenis = lenis
      const raf = time => { lenis.raf(time); frame = requestAnimationFrame(raf) }
      frame = requestAnimationFrame(raf)
    }
    configure()
    reduced.addEventListener('change', configure)
    const handleAnchorClick = event => {
      const target = event.target.closest('a')
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || target?.target === '_blank') return
      if (!target?.hash || target.origin !== window.location.origin || target.pathname !== window.location.pathname) return
      let id
      try { id = decodeURIComponent(target.hash.slice(1)) } catch { return }
      const element = document.getElementById(id)
      if (!element) return
      event.preventDefault()
      if (lenis) lenis.scrollTo(element, { offset: -80, duration: 1.4 })
      else element.scrollIntoView({ behavior: 'instant' })
    }
    document.addEventListener('click', handleAnchorClick)
    return () => {
      cancelAnimationFrame(frame)
      reduced.removeEventListener('change', configure)
      document.removeEventListener('click', handleAnchorClick)
      delete window.__lenis
      lenis?.destroy()
    }
  }, [])
  return <>{children}</>
}
