import { useState, useRef, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/FlowShowcase.css'

export const FLOW_ITEMS_DATA = [
  {
    id: 'chapter-01-love',
    chapter: '01',
    badge: 'SANKALPA I',
    name: 'Love & Connection',
    subtitle: 'Sacred Crimson • Consecrated Brass',
    desc: 'An offering to timeless bonds, consecration of affection, and unyielding emotional presence.',
    price: '₹ 4,800',
    priceNum: 4800,
    image: '/media/love-connection.webp',
  },
  {
    id: 'chapter-02-power',
    chapter: '02',
    badge: 'SANKALPA II',
    name: 'Confidence & Power',
    subtitle: 'Solar Radiance • Hand-Carved Brass',
    desc: 'Invoking the majestic courage of Surya and sovereign will. Consecrated with 108 Gayatri recitations.',
    price: '₹ 5,400',
    priceNum: 5400,
    image: '/media/confidence-personal-power.webp',
  },
  {
    id: 'chapter-03-vitality',
    chapter: '03',
    badge: 'SANKALPA III',
    name: 'Vitality & Balance',
    subtitle: 'Vedic Prana • Herbarium Keepsake',
    desc: 'Harmonizing mind and spirit through consecrated botanical geometries and serene inner equilibrium.',
    price: '₹ 4,200',
    priceNum: 4200,
    image: '/media/vitality-inner-balance.webp',
  },
  {
    id: 'chapter-04-wealth',
    chapter: '04',
    badge: 'SANKALPA IV',
    name: 'Wealth & Prosperity',
    subtitle: 'Kubera Yantra • Burnished Gold',
    desc: 'Channeling auspicious abundance, financial clarity, and grounded material elevation.',
    price: '₹ 6,200',
    priceNum: 6200,
    image: '/media/wealth-prosperity.webp',
  },
  {
    id: 'chapter-05-threshold',
    chapter: '05',
    badge: 'SANCTUARY',
    name: 'Sacred Threshold',
    subtitle: '108× Consecration • Vedic Dasha',
    desc: 'The consecrated gateway where sacred intentions are sealed with golden lacquer and bespoke sankalpa.',
    price: '₹ 7,500',
    priceNum: 7500,
    image: '/media/hero-threshold.webp',
  },
]

export default function FlowShowcase() {
  const { addToCart } = useCart()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const viewportRef = useRef(null)
  const cardRefs = useRef([])

  const targetPosRef = useRef(0)
  const currentPosRef = useRef(0)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startPosRef = useRef(0)
  const lastSnapRef = useRef(0)
  const animFrameRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const target = targetPosRef.current
      const current = currentPosRef.current
      const diff = target - current
      currentPosRef.current += diff * 0.088
      const pos = currentPosRef.current
      const velocity = diff
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
      const spacing = isMobile ? 300 : 380

      for (let i = 0; i < FLOW_ITEMS_DATA.length; i++) {
        const el = cardRefs.current[i]
        if (!el) continue
        const offset = i - pos
        const absOffset = Math.abs(offset)
        const tx = offset * spacing
        const tz = -Math.min(620, absOffset * 175) + (absOffset < 0.5 ? (1 - absOffset * 2) * 45 : 0)
        const ry = Math.max(-65, Math.min(65, offset * -22))
        const rz = Math.max(-8, Math.min(8, velocity * -3.2))
        const scale = Math.max(0.68, 1 - absOffset * 0.12)
        const opacity = Math.max(0.18, 1 - absOffset * 0.32)
        const zIndex = Math.round(100 - absOffset * 10)

        el.style.transform = `translate3d(${tx}px, 0px, ${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`
        el.style.opacity = opacity.toFixed(3)
        el.style.zIndex = zIndex
      }

      const rounded = Math.max(0, Math.min(FLOW_ITEMS_DATA.length - 1, Math.round(pos)))
      setActiveIndex(rounded)
      animFrameRef.current = requestAnimationFrame(update)
    }

    animFrameRef.current = requestAnimationFrame(update)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  const onPointerDown = (e) => {
    isDraggingRef.current = true
    setIsDragging(true)
    startXRef.current = e.clientX
    startPosRef.current = targetPosRef.current
    if (viewportRef.current && viewportRef.current.setPointerCapture) {
      try {
        viewportRef.current.setPointerCapture(e.pointerId)
      } catch (_) {}
    }
  }

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return
    const deltaX = e.clientX - startXRef.current
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const sens = isMobile ? 240 : 340
    targetPosRef.current = Math.max(
      -0.35,
      Math.min(FLOW_ITEMS_DATA.length - 0.65, startPosRef.current - deltaX / sens)
    )
  }

  const onPointerUp = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    const snap = Math.max(0, Math.min(FLOW_ITEMS_DATA.length - 1, Math.round(targetPosRef.current)))
    targetPosRef.current = snap
  }

  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (Math.abs(delta) > 5) {
      targetPosRef.current += delta * 0.0016
      targetPosRef.current = Math.max(
        -0.35,
        Math.min(FLOW_ITEMS_DATA.length - 0.65, targetPosRef.current)
      )
      clearTimeout(lastSnapRef.current)
      lastSnapRef.current = setTimeout(() => {
        const snap = Math.max(0, Math.min(FLOW_ITEMS_DATA.length - 1, Math.round(targetPosRef.current)))
        targetPosRef.current = snap
      }, 130)
    }
  }

  const goTo = (idx) => {
    targetPosRef.current = Math.max(0, Math.min(FLOW_ITEMS_DATA.length - 1, idx))
  }

  const onCardClick = (idx) => {
    const diff = Math.abs(idx - currentPosRef.current)
    if (diff > 0.4) {
      goTo(idx)
    }
  }

  const onReserve = (item, e) => {
    e.stopPropagation()
    addToCart({
      id: item.id,
      title: `${item.name} (${item.badge})`,
      subtitle: item.subtitle,
      price: item.price,
      priceNum: item.priceNum,
      image: item.image,
      chapter: item.chapter,
    })
  }

  return (
    <section className="leoparpeix-flow" id="intentions">
      <div className="flow-header">
        <div className="flow-header__eyebrow">
          <span className="flow-dot" />
          YOUNOYA / SACRED SPATIAL CAROUSEL
        </div>
        <h2 className="flow-header__title">
          Consecrated Flow of <em>Intentions.</em>
        </h2>
        <p className="flow-header__subtitle">
          Drag, scroll or glide across the five sacred sanctums. Each keepsake is purified through
          108× mantras and personalized Vedic astrological dasha.
        </p>
      </div>

      <div
        ref={viewportRef}
        className={`flow-viewport ${isDragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="flow-track">
          {FLOW_ITEMS_DATA.map((item, idx) => (
            <div
              key={item.id}
              className="flow-card-container"
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              onClick={() => onCardClick(idx)}
            >
              <div className="flow-card-inner">
                <div className="flow-card__image-box">
                  <img
                    className="flow-card__image"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="flow-card__gradient" />
                  <div className="flow-card__top-bar">
                    <span className="flow-card__badge">{item.badge}</span>
                    <span className="flow-card__num">{item.chapter} / 05</span>
                  </div>
                </div>
                <div className="flow-card__body">
                  <div>
                    <h3 className="flow-card__title">{item.name}</h3>
                    <p className="flow-card__subtitle">{item.subtitle}</p>
                    <p className="flow-card__desc">{item.desc}</p>
                  </div>
                  <div className="flow-card__footer">
                    <div className="flow-card__price-box">
                      <span className="flow-card__price-label">Consecration Tier</span>
                      <span className="flow-card__price">{item.price}</span>
                    </div>
                    <button
                      type="button"
                      className="flow-card__btn"
                      onClick={(e) => onReserve(item, e)}
                    >
                      Reserve Keepsake ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flow-controls">
        <button
          type="button"
          className="flow-arrow-btn"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous Chapter"
        >
          ←
        </button>
        <div className="flow-dots">
          {FLOW_ITEMS_DATA.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`flow-dot-btn ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => goTo(idx)}
            >
              {item.chapter}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flow-arrow-btn"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next Chapter"
        >
          →
        </button>
      </div>

      <div className="flow-instruction">DRAG • SCROLL • GLIDE THROUGH THE SANCTUMS</div>
    </section>
  )
}
