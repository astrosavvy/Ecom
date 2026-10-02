import React from 'react'

/**
 * Cartier-grade minimalist geometric line-art icons for Vedic Astrological Rashis and Dasha Lords.
 * Designed with 1.5px hairline strokes, clean sacred geometry, and 24x24 viewBox.
 */

// 12 ZODIAC MOON SIGNS
export function AriesIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21V9" />
      <path d="M12 9C9.5 9 6.5 7 6.5 4.5C6.5 3 7.8 2 9.5 2C11.5 2 12 4.5 12 4.5" />
      <path d="M12 9C14.5 9 17.5 7 17.5 4.5C17.5 3 16.2 2 14.5 2C12.5 2 12 4.5 12 4.5" />
    </svg>
  )
}

export function TaurusIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="14" r="6" />
      <path d="M5.5 3.5C7.5 6.5 10 7.5 12 7.5C14 7.5 16.5 6.5 18.5 3.5" />
    </svg>
  )
}

export function GeminiIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 4C9 6 15 6 19 4" />
      <path d="M5 20C9 18 15 18 19 20" />
      <line x1="9" y1="5.5" x2="9" y2="18.5" />
      <line x1="15" y1="5.5" x2="15" y2="18.5" />
    </svg>
  )
}

export function CancerIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="7.5" cy="8.5" r="3" />
      <path d="M10.5 8.5C13.5 8.5 19 10 19 14.5C19 17 16.5 18.5 14 18.5" />
      <circle cx="16.5" cy="15.5" r="3" />
      <path d="M13.5 15.5C10.5 15.5 5 14 5 9.5C5 7 7.5 5.5 10 5.5" />
    </svg>
  )
}

export function LeoIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="6.5" cy="15.5" r="2.5" />
      <path d="M9 15.5C9 10 12 4.5 16 4.5C18.5 4.5 20.5 6.5 20.5 9C20.5 13 16 16.5 17 20" />
      <circle cx="17.5" cy="19.5" r="1.5" />
    </svg>
  )
}

export function VirgoIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5V15C4 17.5 5.5 19 8 19C10.5 19 12 17.5 12 15V5" />
      <path d="M8 15V5" />
      <path d="M12 15C12 17.5 13.5 19 16 19C18.5 19 20 17.5 20 15V7" />
      <path d="M16 14L21 21" />
      <path d="M21 17C21 19.5 19.5 21 17 21" />
    </svg>
  )
}

export function LibraIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="19" x2="20" y2="19" />
      <line x1="4" y1="14" x2="8" y2="14" />
      <line x1="16" y1="14" x2="20" y2="14" />
      <path d="M8 14C8 10.5 9.8 8 12 8C14.2 8 16 10.5 16 14" />
    </svg>
  )
}

export function ScorpioIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 5V15C4 17.5 5.5 19 8 19C10.5 19 12 17.5 12 15V5" />
      <path d="M8 15V5" />
      <path d="M12 15C12 17.5 13.5 19 16 19C18.5 19 20 17.5 20 15V8" />
      <path d="M18 10L21 7M21 7V11M21 7H17" />
    </svg>
  )
}

export function SagittariusIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="13 5 19 5 19 11" />
      <line x1="9" y1="11" x2="15" y2="17" />
    </svg>
  )
}

export function CapricornIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 7L8 16L11 9" />
      <path d="M11 9C12 6.5 14 5 16 5C18.5 5 20 7 20 9.5C20 13 14 17 15 20C15.5 21.5 17 21.5 18 20.5" />
    </svg>
  )
}

export function AquariusIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9L7 6L11 9L15 6L19 9L22 7" />
      <path d="M3 16L7 13L11 16L15 13L19 16L22 14" />
    </svg>
  )
}

export function PiscesIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 4C8.5 8 8.5 16 6 20" />
      <path d="M18 4C15.5 8 15.5 16 18 20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  )
}

// 9 PLANETARY DASHA LORDS
export function SunIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function MoonLordIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13.5C17.5 17.5 14 20.5 10 20.5C5.5 20.5 2 17 2 12.5C2 8.5 5 5 9 4.5C8 6.5 8 9 9.5 11C11 13 13.5 14 18 13.5Z" />
    </svg>
  )
}

export function MarsIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9.5" cy="14.5" r="5.5" />
      <line x1="13.5" y1="10.5" x2="20" y2="4" />
      <polyline points="15 4 20 4 20 9" />
    </svg>
  )
}

export function MercuryIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="11" r="4.5" />
      <line x1="12" y1="15.5" x2="12" y2="21" />
      <line x1="9" y1="18.5" x2="15" y2="18.5" />
      <path d="M8 3.5C9.5 5 12 5.5 12 5.5C12 5.5 14.5 5 16 3.5" />
    </svg>
  )
}

export function JupiterIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9C6 6.5 7.5 4.5 10 4.5C12.5 4.5 14 6.5 14 9V18" />
      <line x1="5" y1="13" x2="18" y2="13" />
      <path d="M14 18C14 19.5 15.5 20.5 17 20.5" />
    </svg>
  )
}

export function VenusIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8.5" r="5.5" />
      <line x1="12" y1="14" x2="12" y2="21" />
      <line x1="8.5" y1="17.5" x2="15.5" y2="17.5" />
    </svg>
  )
}

export function SaturnIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="3" x2="7" y2="15" />
      <line x1="4" y1="7" x2="10" y2="7" />
      <path d="M7 11C9 9 12 9 14 10.5C16 12 17 14 17 17C17 19.5 15 21 13 21C11.5 21 10.5 20 10.5 18.5C10.5 17 11.5 16 13 16" />
    </svg>
  )
}

export function RahuIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* North Node / Dragon's Head */}
      <circle cx="7" cy="16.5" r="3" />
      <circle cx="17" cy="16.5" r="3" />
      <path d="M7 13.5C7 8 9 5 12 5C15 5 17 8 17 13.5" />
    </svg>
  )
}

export function KetuIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* South Node / Dragon's Tail */}
      <circle cx="7" cy="7.5" r="3" />
      <circle cx="17" cy="7.5" r="3" />
      <path d="M7 10.5C7 16 9 19 12 19C15 19 17 16 17 10.5" />
    </svg>
  )
}

/**
 * Dynamic Lookup Functions returning the exact bespoke SVG icon component
 */
export function getZodiacIcon(signName) {
  if (!signName) return null
  const normalized = signName.toLowerCase().trim()
  switch (normalized) {
    case 'aries': return AriesIcon
    case 'taurus': return TaurusIcon
    case 'gemini': return GeminiIcon
    case 'cancer': return CancerIcon
    case 'leo': return LeoIcon
    case 'virgo': return VirgoIcon
    case 'libra': return LibraIcon
    case 'scorpio': return ScorpioIcon
    case 'sagittarius': return SagittariusIcon
    case 'capricorn': return CapricornIcon
    case 'aquarius': return AquariusIcon
    case 'pisces': return PiscesIcon
    default: return null
  }
}

export function getDashaIcon(dashaName) {
  if (!dashaName) return null
  const normalized = dashaName.toLowerCase().trim()
  switch (normalized) {
    case 'sun':
    case 'surya': return SunIcon
    case 'moon':
    case 'chandra': return MoonLordIcon
    case 'mars':
    case 'mangal': return MarsIcon
    case 'mercury':
    case 'budha': return MercuryIcon
    case 'jupiter':
    case 'guru': return JupiterIcon
    case 'venus':
    case 'shukra': return VenusIcon
    case 'saturn':
    case 'shani': return SaturnIcon
    case 'rahu': return RahuIcon
    case 'ketu': return KetuIcon
    default: return MercuryIcon
  }
}
