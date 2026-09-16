import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mountLetsScroll } from '../../lib/scrub-engine.js'

export default function LetsScrollWorld() {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Scroll to top upon entering the world
    window.scrollTo(0, 0)

    const destroy = mountLetsScroll(el, {
      brand: { name: 'YOUNOYA', href: '/' },
      cta: { label: 'Shop Collection', href: '/shop' },
      hint: 'scroll to explore the world',
      diveScroll: 1.4,
      connScroll: 0.9,
      crossfade: 0.14,
      atmosphere: true,
      nav: true,
      onNavigate: (path) => navigate(path),
      sections: [
        {
          id: 'prologue',
          label: 'Prologue',
          still: '/assets/story_poster.webp',
          stillMobile: '/assets/story_poster.webp',
          clip: '/assets/vid/story_10s.mp4',
          clipMobile: '/assets/vid/story_10s-m.mp4',
          scroll: 1.5,
          linger: 0.4,
          accent: '#D4AF37',
          eyebrow: 'YOUNOYA · For Every Chapter',
          title: 'Gifts shaped by intention, chosen by your stars.',
          body: 'A scroll-driven journey through sacred birth parameters, Jaipur lapidary craft, and 108x Vedic consecration.',
          tags: ['Astro-First', 'Consecrated Atelier'],
        },
        {
          id: 'threshold',
          label: 'Threshold',
          still: '/scenes/threshold-c.webp',
          stillMobile: '/scenes/threshold-c-m.webp',
          scroll: 1.3,
          linger: 0.35,
          accent: '#D4AF37',
          eyebrow: '01 · Threshold',
          title: 'Every gift begins with an intention.',
          body: 'Seekers share sacred birth coordinates (DOB, TOB, POB). The ephemeris computes Moon Rashi, Nakshatra, and current Dasha.',
          tags: ['Vedic Ephemeris', 'Zero-Password OTP'],
        },
        {
          id: 'cosmos',
          label: 'Cosmos',
          still: '/scenes/cosmos-c.webp',
          stillMobile: '/scenes/cosmos-c-m.webp',
          scroll: 1.3,
          linger: 0.35,
          accent: '#7B9EBB',
          eyebrow: '02 · Cosmos',
          title: 'Your chart is the celestial blueprint.',
          body: 'Planetary alignments dictate the resonance of unheated gems, crystal lattices, and sacred metal alloys.',
          tags: ['120-Year Vimshottari', 'Planetary Affinities'],
        },
        {
          id: 'intent',
          label: 'Intention',
          still: '/scenes/intent-c.webp',
          stillMobile: '/scenes/intent-c-m.webp',
          scroll: 1.3,
          linger: 0.35,
          accent: '#E8A0BF',
          eyebrow: '03 · Intention',
          title: 'Sacred geometry forged by hand.',
          body: 'Untreated Zambian emeralds, Ceylon sapphires, and Himalayan clear quartz set in pure silver and 18K gold vermeil.',
          tags: ['Natural Minerals', 'Jaipur Goldsmiths'],
        },
        {
          id: 'seek',
          label: 'Consecration',
          still: '/scenes/seek-c.webp',
          stillMobile: '/scenes/seek-c-m.webp',
          scroll: 1.3,
          linger: 0.35,
          accent: '#C88A5A',
          eyebrow: '04 · Consecration',
          title: '108 sacred chants awaken the keepsake.',
          body: 'Energized during auspicious muhurtas to elevate personal vibration and shield the seeker on their path.',
          tags: ['108x Ritual', 'Auspicious Muhurta'],
        },
        {
          id: 'reveal',
          label: 'The Reveal',
          still: '/scenes/reveal-c.webp',
          stillMobile: '/scenes/reveal-c-m.webp',
          scroll: 1.6,
          linger: 0.45,
          accent: '#D4AF37',
          eyebrow: '05 · The Reveal',
          title: 'One consecrated keepsake. Delivered for your chapter.',
          body: 'Presented in archival gold-foil cases with Vedic birth chart folio and insured express air dispatch.',
          tags: ['Cartier Configurator', 'Express Air Insured'],
          cta: {
            primary: { label: 'Begin Your Chart →', href: '/personalise' },
            secondary: { label: 'Explore Keepsakes', href: '/shop' },
          },
        },
      ],
      connectors: [],
    })

    return () => {
      if (typeof destroy === 'function') destroy()
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#07080E',
        color: '#FFFBF0',
      }}
    >
      {/* Return to Atelier Link */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 70,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '999px',
            backgroundColor: 'rgba(7, 8, 14, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#FFFBF0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            letterSpacing: '0.04em',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.8)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(7, 8, 14, 0.75)'
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'
          }}
        >
          <span>←</span>
          <span>Return to Atelier</span>
        </Link>
      </div>

      {/* Scrub Engine Container */}
      <div
        ref={containerRef}
        id="world"
        style={{
          ['--sw-bg' as any]: '#07080E',
          ['--sw-ink' as any]: '#FFFBF0',
          ['--sw-ink-soft' as any]: '#A39B8E',
          ['--sw-accent' as any]: '#D4AF37',
        }}
      />
    </div>
  )
}
