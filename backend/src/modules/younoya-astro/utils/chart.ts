import * as Astronomy from "astronomy-engine"

export const WESTERN_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const

export const RASHIS = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
] as const

export const ELEMENTS = [
  "Fire", "Earth", "Air", "Water",
] as const

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
] as const

export const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
] as const

// element cycle: Fire, Earth, Air, Water repeating per trine
export function elementForSignIndex(i: number): string {
  return ELEMENTS[i % 4]
}

// Lahiri ayanamsa (approx): 23.853 deg at J2000, precession ~50.29"/yr
export function lahiriAyanamsa(date: Date): number {
  const j2000 = Date.UTC(2000, 0, 1, 12, 0, 0)
  const years = (date.getTime() - j2000) / (365.25 * 24 * 3600 * 1000)
  return 23.853 + (years * 50.29) / 3600
}

function norm360(x: number): number {
  return ((x % 360) + 360) % 360
}

export type ChartInput = {
  dob: string // YYYY-MM-DD
  tob: string | null // HH:mm (local at pob)
  pob_lat: number
  pob_lng: number
  pob_tz: string // IANA time zone, or an explicit +HH:mm offset
}

export type Chart = {
  sun_sign: string
  sun_longitude: number
  moon_sign: string
  moon_sign_index: number
  moon_longitude_sidereal: number
  nakshatra: string
  nakshatra_index: number
  nakshatra_pada: number
  element: string
  ruling_planet: string
  ascendant: string | null
  approximate: boolean
}

export function computeChart(input: ChartInput): Chart {
  const { dob, pob_lat, pob_lng } = input
  const tob = input.tob && /^\d{1,2}:\d{2}/.test(input.tob) ? input.tob : null
  const approximate = tob === null
  const [hh, mm] = tob ? tob.split(":").map((v) => parseInt(v, 10)) : [12, 0]

  // local birth time -> UTC
  const utc = birthInstant(dob, `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, input.pob_tz)

  // Sun (tropical ecliptic longitude)
  const sun = Astronomy.SunPosition(utc)
  const sunLon = norm360(sun.elon)
  const sunSign = WESTERN_SIGNS[Math.floor(sunLon / 30)]

  // Moon (geocentric ecliptic longitude) -> sidereal via Lahiri
  const moon = Astronomy.EclipticGeoMoon(utc)
  const ayan = lahiriAyanamsa(utc)
  const moonSid = norm360(moon.lon - ayan)
  const moonIdx = Math.floor(moonSid / 30)
  const moonSign = RASHIS[moonIdx]
  const nakIdx = Math.floor(moonSid / (360 / 27))
  const nakshatra = NAKSHATRAS[nakIdx]
  const pada = Math.floor(moonSid / (360 / 108)) % 4 + 1

  // Ascendant needs birth time; approximate when TOB unknown
  let ascendant: string | null = null
  if (!approximate) {
    try {
      const gst = Astronomy.SiderealTime(utc) * 15 // degrees
      const lst = norm360(gst + pob_lng)
      const ramc = lst
      const eps = 23.4367 // obliquity, deg
      const latRad = (pob_lat * Math.PI) / 180
      const ramcRad = (ramc * Math.PI) / 180
      const epsRad = (eps * Math.PI) / 180
      // ascendant formula (tropical)
      const asc =
        Math.atan2(
          Math.cos(ramcRad),
          -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad))
        ) * (180 / Math.PI)
      const ascNorm = norm360(asc)
      const ayanNow = lahiriAyanamsa(utc)
      const ascSid = norm360(ascNorm - ayanNow)
      ascendant = RASHIS[Math.floor(ascSid / 30)]
    } catch {
      ascendant = null
    }
  }

  return {
    sun_sign: sunSign,
    sun_longitude: Math.round(sunLon * 100) / 100,
    moon_sign: moonSign,
    moon_sign_index: moonIdx,
    moon_longitude_sidereal: Math.round(moonSid * 100) / 100,
    nakshatra,
    nakshatra_index: nakIdx,
    nakshatra_pada: pada,
    element: elementForSignIndex(moonIdx),
    ruling_planet: RASHI_LORDS[moonIdx],
    ascendant,
    approximate,
  }
}

export function birthInstant(dob: string, tob: string, timezone: string): Date {
  const [year, month, day] = dob.split("-").map(Number)
  const [hour, minute] = tob.split(":").map(Number)
  const localEpoch = Date.UTC(year, month - 1, day, hour, minute)
  if (!Number.isFinite(localEpoch) || new Date(localEpoch).toISOString().slice(0, 10) !== dob || hour > 23 || minute > 59) {
    throw new Error("Invalid birth date or time")
  }
  if (/^[+-]\d{2}:\d{2}$/.test(timezone)) {
    const [h, m] = timezone.slice(1).split(":").map(Number)
    if (h > 14 || m > 59) throw new Error("Invalid time-zone offset")
    return new Date(localEpoch - (timezone[0] === "-" ? -1 : 1) * (h * 60 + m) * 60000)
  }
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  })
  const wallEpoch = (utc: number) => {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(utc)).map((part) => [part.type, Number(part.value)]))
    return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  }
  let utc = localEpoch
  for (let i = 0; i < 4; i++) utc += localEpoch - wallEpoch(utc)
  if (wallEpoch(utc) !== localEpoch) throw new Error("Birth time does not exist in this time zone")
  return new Date(utc)
}
