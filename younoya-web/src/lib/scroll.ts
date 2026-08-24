import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null

export function initScroll(): Lenis | null {
  if (lenis) return lenis
  if (prefersReducedMotion()) return null

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToSection(target: string) {
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.6 })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
