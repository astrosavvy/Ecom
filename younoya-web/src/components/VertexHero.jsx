import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import '../styles/VertexHero.css'

// 10 local photoshoot keepsake cards
const CARDS_DATA = [
  {
    v: 'chapter',
    ch: '01',
    badge: 'SANKALPA I',
    title: 'Love & Connection',
    sub: 'Sacred Crimson • Rose Quartz',
    price: '₹ 4,800',
    url: '/media/love-connection.webp',
  },
  {
    v: 'power',
    ch: '02',
    badge: 'SANKALPA II',
    title: 'Confidence & Power',
    sub: 'Solar Radiance • Cast Bronze',
    price: '₹ 5,400',
    url: '/media/confidence-personal-power.webp',
  },
  {
    v: 'vitality',
    ch: '03',
    badge: 'SANKALPA III',
    title: 'Vitality & Balance',
    sub: 'Vedic Prana • Raw Clear Quartz',
    price: '₹ 4,200',
    url: '/media/vitality-inner-balance.webp',
  },
  {
    v: 'wealth',
    ch: '04',
    badge: 'SANKALPA IV',
    title: 'Wealth & Prosperity',
    sub: 'Kubera Yantra • 24K Gold Lacquer',
    price: '₹ 6,200',
    url: '/media/wealth-prosperity.webp',
  },
  {
    v: 'threshold',
    ch: '05',
    badge: 'SANCTUARY',
    title: 'Sacred Threshold',
    sub: '108× Maha Sankalpa',
    price: '₹ 7,500',
    url: '/media/hero-threshold.webp',
  },
  {
    v: 'plain',
    t: 'SOLAR SCARAB',
    sub: 'Metamorphosis • Obsidian',
    price: '₹ 5,900',
    url: '/media/beetle-keepsake.webp',
  },
  {
    v: 'oracle',
    ch: '07',
    badge: 'ORACLE',
    title: 'Feathered Vision',
    sub: 'Lapis Lazuli • Throat Chakra',
    price: '₹ 4,600',
    url: '/media/toucan-keepsake.webp',
  },
  {
    v: 'plain',
    t: 'ASTRAL VESSEL',
    sub: 'Subconscious Clarity',
    price: '₹ 3,900',
    url: '/media/dream-jar.webp',
  },
  {
    v: 'apple',
    ch: '01',
    badge: 'ATELIER ICON',
    title: 'Sacred Apple',
    sub: 'Eternal Connection',
    price: '₹ 4,800',
    url: '/media/hero-apple.webp',
  },
  {
    v: 'plain',
    t: 'ROYAL TALISMAN',
    sub: 'Solar Midday Zenith',
    price: '₹ 5,400',
    url: '/media/leopard-keepsake.webp',
  },
]

export default function VertexHero() {
  const { totalItems, setIsOpen, addToCart } = useCart()
  const trackRef = useRef(null)
  const canvasRef = useRef(null)
  const ringRef = useRef(null)
  const browserRef = useRef(null)
  const heroCopyRef = useRef(null)
  const stARef = useRef(null)
  const stBRef = useRef(null)
  const cardElementsRef = useRef([])

  const [scrollProgress, setScrollProgress] = useState(0)

  // Generate procedural starfield on mount
  useEffect(() => {
    const makeStars = (count, blur, minA, maxA) => {
      const arr = []
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * 100).toFixed(2)
        const y = (Math.random() * 100).toFixed(2)
        const a = (minA + Math.random() * (maxA - minA)).toFixed(3)
        arr.push(`${x}vw ${y}vh ${blur}px 0 rgba(255,235,198,${a})`)
      }
      return arr.join(',')
    }

    if (stARef.current) stARef.current.style.boxShadow = makeStars(140, 0, 0.05, 0.28)
    if (stBRef.current) stBRef.current.style.boxShadow = makeStars(22, 1.4, 0.35, 0.7)
  }, [])

  // 3D Perspective Cylinder Ring loop (R = 891px, 37 cards, culling at 42deg)
  useEffect(() => {
    const R = 891
    const n = 37
    const step = 360 / n
    let phase = -2
    let lastTime = performance.now()
    let reqId = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      if (!reducedMotion) {
        phase -= 1.9 * dt
      }

      for (let i = 0; i < n; i++) {
        const el = cardElementsRef.current[i]
        if (!el) continue

        const a = (((i * step + phase) % 360) + 540) % 360 - 180
        if (Math.abs(a) > 42) {
          el.style.visibility = 'hidden'
          continue
        }

        el.style.visibility = 'visible'
        const rad = (a * Math.PI) / 180
        const c = Math.cos(rad)
        const s = Math.sin(rad)
        const tx = (R * s).toFixed(2)
        const tz = (R * (1 - c)).toFixed(2)
        const ry = (-a).toFixed(2)
        const bright = Math.min(1.2, Math.max(0.4, 0.84 + 0.5 * (1 / c - 1))).toFixed(3)

        el.style.transform = `translate3d(${tx}px, 0px, ${tz}px) rotateY(${ry}deg)`
        el.style.filter = `brightness(${bright})`
      }

      reqId = requestAnimationFrame(tick)
    }

    reqId = requestAnimationFrame(tick)

    const onVisibility = () => {
      lastTime = performance.now()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(reqId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // Canvas Scaling & Scroll-to-Expand Kinematics
  useEffect(() => {
    const canvas = canvasRef.current
    const browser = browserRef.current
    const heroCopy = heroCopyRef.current
    const ring = ringRef.current
    const track = trackRef.current

    if (!canvas || !track) return

    const handleResizeAndScroll = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight

      // 1. Canvas Scale Law
      const TAB_MAX = 1080
      const TAB_MIN = 701
      const DW_MIN = 920
      const CW = 1172

      let k = 1
      let fill = 0
      let stShift = 0
      let sShift = 0
      let rScale = 1

      if (vw > TAB_MAX) {
        // Desktop (> 1080px)
        k = Math.min(vw / CW, vh / 560)
        fill = Math.max(0, vh / k - 657)
      } else if (vw >= TAB_MIN) {
        // Tablet ramp (701 - 1080px)
        const W = DW_MIN + ((vw - TAB_MIN) * (CW - DW_MIN)) / (TAB_MAX - TAB_MIN)
        const clampedW = vh > vw * 1.15 ? Math.min(W, 900) : W
        k = Math.min(vw / clampedW, vh / 560)
        const ramp = Math.min(1, (TAB_MAX - vw) / 120)
        fill = Math.max(0, vh / k - 657)

        if (fill > 0) {
          sShift = Math.min(fill * 0.55, 420) * ramp
          rScale = 1 + Math.min(fill / 1100, 0.75) * ramp
          const slack = 219.5 - 125 * rScale + sShift
          stShift = Math.max(0, slack / 2 - 28) * ramp
          fill -= sShift
        }
      } else {
        // Mobile (<= 700px): genuine flow column
        k = 1
        fill = 0
      }

      canvas.style.setProperty('--k', k)
      canvas.style.setProperty('--fill', `${fill}px`)
      canvas.style.setProperty('--stshift', `${stShift}px`)
      canvas.style.setProperty('--sshift', `${sShift}px`)
      canvas.style.setProperty('--rs', rScale)

      // 2. Scroll-to-Expand Kinematics
      const rect = track.getBoundingClientRect()
      const trackDistance = Math.max(1, track.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / trackDistance))
      setScrollProgress(progress)

      if (vw > 700 && browser && heroCopy && ring) {
        // Fade out top hero headlines & 3D ring as user scrolls
        const fadeProgress = Math.min(1, Math.max(0, progress / 0.42))
        const heroOpacity = (1 - fadeProgress).toFixed(3)
        const heroTranslateY = (-fadeProgress * 45).toFixed(1)
        heroCopy.style.opacity = heroOpacity
        heroCopy.style.transform = `translate(-50%, ${heroTranslateY}px)`
        heroCopy.style.pointerEvents = fadeProgress > 0.6 ? 'none' : 'auto'

        // Scale & push 3D ring into z-depth
        ring.style.opacity = (1 - fadeProgress).toFixed(3)
        ring.style.transform = `scale(${(1 - fadeProgress * 0.12).toFixed(3)})`

        // Expand floating browser window to full-screen website window
        // From rest (progress = 0) to full takeover (progress = 0.85 -> 1.0)
        const expandProgress = Math.min(1, Math.max(0, (progress - 0.1) / 0.75))
        // Smooth exponential ease
        const ease = Math.pow(expandProgress, 1.8)

        // Calculate targets:
        // Width: 842px -> 100vw / k
        const currentTargetW = 842 + (vw / k - 842) * ease
        // Left: 165px -> centered at (1172 - currentTargetW)/2
        const currentLeft = 165 + (586 - currentTargetW / 2 - 165) * ease
        // Top: 558px -> 0px
        const currentTop = 558 * (1 - ease)
        // Height: (99px + fill) -> vh / k
        const baseH = 99 + fill
        const currentH = baseH + (vh / k - baseH) * ease
        // Radius: 28px -> 0px
        const currentRadius = (28 * (1 - ease)).toFixed(1)
        // Chrome opacity: 1 -> 0.3 as it expands
        const chromeOpacity = (1 - ease * 0.7).toFixed(2)

        browser.style.left = `${currentLeft}px`
        browser.style.top = `${currentTop}px`
        browser.style.width = `${currentTargetW}px`
        browser.style.height = `${currentH}px`
        browser.style.borderRadius = `${currentRadius}px ${currentRadius}px 0 0`
        browser.style.boxShadow = `0 -${(14 * (1 - ease)).toFixed(0)}px ${(44 * (1 - ease)).toFixed(0)}px rgba(0,0,0,${(0.7 * (1 - ease)).toFixed(2)})`

        const chromeBar = browser.querySelector('.browser-bar')
        if (chromeBar) {
          chromeBar.style.opacity = chromeOpacity
        }
      } else if (browser) {
        // Reset styles for mobile flow column
        browser.style.left = ''
        browser.style.top = ''
        browser.style.width = ''
        browser.style.height = ''
        browser.style.borderRadius = ''
        browser.style.boxShadow = ''
      }
    }

    window.addEventListener('resize', handleResizeAndScroll, { passive: true })
    window.addEventListener('scroll', handleResizeAndScroll, { passive: true })
    handleResizeAndScroll()

    return () => {
      window.removeEventListener('resize', handleResizeAndScroll)
      window.removeEventListener('scroll', handleResizeAndScroll)
    }
  }, [])

  return (
    <section className="vertex-scroll-track" ref={trackRef}>
      <div className="vertex-stage">
        {/* Background Starfield */}
        <div className="vertex-bg" />
        <div className="stars stars-a" ref={stARef} />
        <div className="stars stars-b" ref={stBRef} />

        {/* Scaled 1172x657 Canvas */}
        <div className="vertex-canvas" ref={canvasRef}>
          {/* Top Atelier Nav Pill */}
          <header className="vertex-nav">
            {/* Celestial Orbit Logo */}
            <Link to="/" className="vertex-mark" aria-label="Younoya Home">
              <svg viewBox="0 0 48 48" className="mark-svg">
                <defs>
                  <linearGradient id="yg-sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFF6D6" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8A6318" />
                  </linearGradient>
                  <linearGradient id="yg-sw2" x1="40" y1="10" x2="10" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FFEAA7" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <g transform="rotate(-32 24 24)">
                  <ellipse
                    cx="24"
                    cy="24"
                    rx="18.5"
                    ry="9.6"
                    stroke="url(#yg-sw2)"
                    strokeWidth="3.1"
                    strokeLinecap="round"
                    strokeDasharray="58 30"
                    strokeDashoffset="14"
                    fill="none"
                  />
                  <circle cx="41.4" cy="20.6" r="3.1" fill="#FFF6D6" />
                </g>
                <circle cx="24" cy="24" r="6.6" fill="url(#yg-sw)" />
                <circle cx="24" cy="24" r="2.6" fill="#fff" />
              </svg>
            </Link>

            {/* Wordmark */}
            <div className="vertex-wm">
              <span className="wm-kick">ATELIER</span>
              <span className="wm-name">YOUNOYA</span>
            </div>

            {/* Nav Links */}
            <nav className="vertex-links">
              <a href="#intentions">Intentions</a>
              <a href="#story">The Story</a>
              <a href="#sanctums">Sanctums</a>
              <a href="#consecration">108× Mantras</a>
              <a href="#finale">Younoya</a>
            </nav>

            {/* Signature Gold Foot-Glow CTA Button */}
            <a href="#intentions" className="btn-glow nav-btn">
              <span>Explore Sanctums</span>
            </a>
          </header>

          {/* Hero Stack (Badge, H1, Subtitle, CTA) */}
          <div className="hero-stack" ref={heroCopyRef}>
            {/* Sacred Badge */}
            <div className="vertex-badge">
              <i>
                <svg viewBox="5 1 14 22" preserveAspectRatio="none">
                  <path
                    d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
                    fill="rgba(212, 175, 55, 0.72)"
                    stroke="rgba(255, 234, 167, 0.85)"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
              <b>✦ Consecrated Vedic Keepsakes</b>
            </div>

            {/* Headline */}
            <h1 className="vertex-h1 h1-a">OBJECTS OF AFFECTION</h1>
            <h1 className="vertex-h1 h1-b">FOR EVERY CHAPTER</h1>

            {/* Subtitle */}
            <p className="vertex-sub sub-1">
              <b>Vedic astrology guidance & 108× consecrated keepsakes</b> orchestrated with
            </p>
            <p className="vertex-sub sub-2">
              Cartier-level spatial aesthetics, planetary muhurtas, and heirloom consecration.
            </p>

            {/* Hero CTA Button */}
            <a href="#intentions" className="btn-glow cta-hero">
              <span>Enter Sanctum</span>
            </a>
          </div>

          {/* 3D Cylinder Perspective Ring (R = 891px, 37 cards) */}
          <div className="vertex-ring" ref={ringRef}>
            {Array.from({ length: 37 }).map((_, idx) => {
              const item = CARDS_DATA[idx % CARDS_DATA.length]
              return (
                <div
                  key={idx}
                  className="ring-card"
                  ref={(el) => {
                    cardElementsRef.current[idx] = el
                  }}
                >
                  <img src={item.url} alt="" loading="lazy" />
                  <div className="ring-card__overlay">
                    <div className="ring-card__top">
                      <span className="ring-card__badge">{item.badge || item.t}</span>
                      {item.ch && <span className="ring-card__ch">{item.ch}</span>}
                    </div>
                    <div className="ring-card__bottom">
                      <strong className="ring-card__title">{item.title || item.t}</strong>
                      <span className="ring-card__sub">{item.sub}</span>
                      <span className="ring-card__price">{item.price}</span>
                    </div>
                  </div>
                  <div className="ring-card__edge" />
                </div>
              )
            })}
          </div>

          {/* Floating macOS Browser Window (Overlaps Ring in Front, Scrolls to Expand!) */}
          <div className="vertex-browser" ref={browserRef}>
            {/* macOS Chrome Bar */}
            <div className="browser-bar">
              <div className="browser-dots">
                <i className="dot-red" />
                <i className="dot-yellow" />
                <i className="dot-green" />
              </div>
              <div className="browser-omni">
                <Search size={10} className="omni-icon" />
                <span>younoya.com · The Sacred Sanctums</span>
              </div>
              <div className="browser-tools">
                <User size={11} className="text-gold" />
                <ShoppingBag
                  size={11}
                  className="text-gold"
                  onClick={() => setIsOpen(true)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Browser Page Surface (Live Storefront Preview that expands into view) */}
            <div className="browser-page">
              {/* Announcement Bar */}
              <div className="browser-ann">
                <span>✦ 108× CONSECRATED HEIRLOOMS • COMPLIMENTARY INSURED COURIER ✦</span>
              </div>

              {/* Storefront Header */}
              <div className="browser-shopheader">
                <em>YOUNOYA</em>
                <i>ATELIER OBJECTS OF AFFECTION</i>
              </div>

              {/* Storefront Content */}
              <div className="browser-pagebody">
                {/* Hero Banner */}
                <div className="browser-pghero">
                  <img src="/media/ritual-portrait.webp" alt="Younoya Atelier" />
                  <div className="pghero-scrim" />
                  <div className="pghero-copy">
                    <u>SACRED SANKALPA</u>
                    <em>A gift should feel<br />inevitable.</em>
                    <a href="#intentions" className="pghero-btn">
                      Explore Sanctums ↗
                    </a>
                  </div>
                </div>

                {/* Best Consecrated Keepsakes 4-Column Grid */}
                <div className="browser-pgsec">
                  <b>Consecrated Heirlooms</b>
                  <a href="#intentions">SEE ALL SANCTUMS ↗</a>
                </div>

                <div className="browser-pggrid">
                  {CARDS_DATA.slice(0, 4).map((p, pIdx) => (
                    <div key={pIdx} className="browser-pgcard">
                      <div className="pgcard-img">
                        <img src={p.url} alt={p.title} />
                        <span className="pgcard-tag">{p.badge}</span>
                      </div>
                      <b>{p.title}</b>
                      <i>{p.sub}</i>
                      <s>{p.price}</s>
                    </div>
                  ))}
                </div>

                {/* Assurance Strip */}
                <div className="browser-pgstrip">
                  <span>✦ 108× Gayatri Recitations</span>
                  <span>✦ Vedic Astrological Attunement</span>
                  <span>✦ Insured White-Glove Courier</span>
                  <span>✦ Authenticity Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <div className={`vertex-scroll-cue ${scrollProgress > 0.2 ? 'is-faded' : ''}`}>
          <span>SCROLL TO ENTER ATELIER</span>
          <div className="cue-line" />
        </div>
      </div>
    </section>
  )
}
