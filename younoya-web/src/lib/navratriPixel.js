export const NAVRATRI_PIXEL_ID = '1812138199833737'
export const NAVRATRI_PIXEL_PATH = '/product/navratri-shringaar-box'
export const NAVRATRI_PIXEL_FALLBACK = `<img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?id=${NAVRATRI_PIXEL_ID}&amp;ev=PageView&amp;noscript=1" />`

let lastPathname
let initialized = false

export function trackNavratriVisit(pathname) {
  // StrictMode replays effects; only a change of page starts another visit.
  if (pathname === lastPathname) return
  lastPathname = pathname
  if (pathname !== NAVRATRI_PIXEL_PATH) return

  if (!window.fbq) {
    const fbq = window.fbq = function () {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments)
      else fbq.queue.push(arguments)
    }
    if (!window._fbq) window._fbq = fbq
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }
  if (!initialized) {
    window.fbq('init', NAVRATRI_PIXEL_ID)
    initialized = true
  }
  window.fbq('track', 'PageView')
}
