import { useLayoutEffect } from 'react'

export default function useGuideLayout(main, screen) {
  useLayoutEffect(() => {
    const root = main.current
    if (!root) return undefined
    const conversation = root.querySelector('.guide-conversation')
    const content = root.querySelector('.guide-chat-content')
    const dock = root.querySelector('.guide-reply-dock')
    let frame
    function measure() {
      if (window.matchMedia('(min-width: 960px)').matches) {
        root.style.removeProperty('--guide-stage-height')
        return
      }
      const nav = root.querySelector('.guide-page__top')
      const progress = root.querySelector('.guide-progress')
      const available = root.clientHeight - nav.offsetHeight
      const wide = root.clientWidth > 600
      const minimum = wide ? 144 : 116
      const maximum = Math.min(root.clientWidth * 392 / 480 + 38, 520)
      const needed = conversation ? progress.offsetHeight + content.scrollHeight + dock.scrollHeight + 42 : available
      const height = Math.max(minimum, Math.min(maximum, available - needed))
      root.style.setProperty('--guide-stage-height', `${height}px`)
    }
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    ;[root, content, ...(dock ? [...dock.children] : [])].filter(Boolean).forEach(element => observer.observe(element))
    measure()
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [main, screen])
}
