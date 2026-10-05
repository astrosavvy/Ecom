import { useLayoutEffect } from 'react'

export default function useGuideLayout(main, screen) {
  useLayoutEffect(() => {
    const root = main.current
    if (!root) return undefined
    const conversation = root.querySelector('.guide-conversation')
    const content = root.querySelector('.guide-chat-content')
    let frame
    function measure() {
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const page = root.closest('.guide-page')
      page.style.setProperty('--guide-viewport-height', `${viewportHeight}px`)
      if (window.matchMedia('(min-width: 960px)').matches) {
        root.style.removeProperty('--guide-stage-height')
        return
      }
      const nav = root.querySelector('.guide-page__top')
      const progress = root.querySelector('.guide-progress')
      const available = root.clientHeight - nav.offsetHeight
      const wide = root.clientWidth > 600
      const minimum = viewportHeight < 550 ? 0 : wide ? 120 : 80
      const maximum = Math.min(root.clientWidth * 392 / 480 + 38, 520)
      const spacing = element => {
        const css = getComputedStyle(element)
        return ['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].reduce((sum, key) => sum + (parseFloat(css[key]) || 0), 0)
      }
      const needed = conversation ? progress.offsetHeight + spacing(conversation) + parseFloat(getComputedStyle(progress).marginBottom) + content.scrollHeight + 4 : available
      const height = Math.max(minimum, Math.min(maximum, available - needed))
      root.style.setProperty('--guide-stage-height', `${height}px`)
    }
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    ;[root, content].filter(Boolean).forEach(element => observer.observe(element))
    window.visualViewport?.addEventListener('resize', schedule)
    measure()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.visualViewport?.removeEventListener('resize', schedule) }
  }, [main, screen])
}
