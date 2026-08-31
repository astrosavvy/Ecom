/**
 * Vimshottari Dasha System
 * 
 * The Dasha sequence: Ketu(7), Venus(20), Sun(6), Moon(10), Mars(7),
 * Rahu(18), Jupiter(16), Saturn(19), Mercury(17) = 120 years total
 * 
 * Starting Dasha lord is determined by the Nakshatra at birth.
 * Balance of first Dasha = remaining portion of Nakshatra at birth.
 */

export const DASHA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars",
  "Rahu", "Jupiter", "Saturn", "Mercury",
] as const

export const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
}

// Each Nakshatra is ruled by a Dasha lord (repeating pattern of 9 lords across 27 nakshatras)
// Ashwini=Ketu, Bharani=Venus, Krittika=Sun, Rohini=Moon, Mrigashira=Mars,
// Ardra=Rahu, Punarvasu=Jupiter, Pushya=Saturn, Ashlesha=Mercury, then repeats
export const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
] as const

export type DashaResult = {
  mahadasha: string
  mahadasha_start: Date
  mahadasha_end: Date
  mahadasha_total_years: number
  antardasha: string
  antardasha_start: Date
  antardasha_end: Date
  sequence: Array<{
    lord: string
    start: Date
    end: Date
    years: number
    isCurrent: boolean
  }>
}

/**
 * Calculate the Vimshottari Dasha periods from birth
 * @param nakshatraIndex - 0-26 index of the birth Nakshatra
 * @param moonLongitudeSidereal - sidereal moon longitude in degrees (0-360)
 * @param birthDate - Date of birth
 */
export function computeDasha(
  nakshatraIndex: number,
  moonLongitudeSidereal: number,
  birthDate: Date
): DashaResult {
  const nakshatraSpan = 360 / 27 // 13.333... degrees per nakshatra
  const nakshatraStart = nakshatraIndex * nakshatraSpan
  const positionInNakshatra = moonLongitudeSidereal - nakshatraStart
  const fractionElapsed = positionInNakshatra / nakshatraSpan

  // Starting lord is the Nakshatra's lord
  const startingLord = NAKSHATRA_LORDS[nakshatraIndex]
  const startingLordIndex = DASHA_LORDS.indexOf(startingLord)

  // Balance of first dasha = (1 - fractionElapsed) * total years of that lord
  const firstDashaBalance = (1 - fractionElapsed) * DASHA_YEARS[startingLord]

  // Build the full dasha sequence (120 years from birth)
  const sequence: DashaResult["sequence"] = []
  let cursor = new Date(birthDate.getTime())
  const now = new Date()

  for (let i = 0; i < 9; i++) {
    const lordIndex = (startingLordIndex + i) % 9
    const lord = DASHA_LORDS[lordIndex]
    const years = i === 0 ? firstDashaBalance : DASHA_YEARS[lord]
    const start = new Date(cursor.getTime())
    const end = new Date(cursor.getTime() + years * 365.25 * 24 * 3600 * 1000)
    const isCurrent = now >= start && now < end
    sequence.push({ lord, start, end, years: Math.round(years * 100) / 100, isCurrent })
    cursor = end
  }

  // Find current Mahadasha
  const currentMaha = sequence.find(d => d.isCurrent) || sequence[0]

  // Calculate Antardasha within current Mahadasha
  const mahaLordIndex = DASHA_LORDS.indexOf(currentMaha.lord as typeof DASHA_LORDS[number])
  const mahaDurationMs = currentMaha.end.getTime() - currentMaha.start.getTime()
  const totalDashaYears = DASHA_YEARS[currentMaha.lord]

  let antarCursor = new Date(currentMaha.start.getTime())
  let currentAntar = { lord: currentMaha.lord, start: currentMaha.start, end: currentMaha.end }

  for (let i = 0; i < 9; i++) {
    const antarLordIndex = (mahaLordIndex + i) % 9
    const antarLord = DASHA_LORDS[antarLordIndex]
    const antarYears = DASHA_YEARS[antarLord]
    const antarFraction = antarYears / 120
    const antarDuration = mahaDurationMs * (antarYears / totalDashaYears)
    const antarStart = new Date(antarCursor.getTime())
    const antarEnd = new Date(antarCursor.getTime() + antarDuration)

    if (now >= antarStart && now < antarEnd) {
      currentAntar = { lord: antarLord, start: antarStart, end: antarEnd }
      break
    }
    antarCursor = antarEnd
  }

  return {
    mahadasha: currentMaha.lord,
    mahadasha_start: currentMaha.start,
    mahadasha_end: currentMaha.end,
    mahadasha_total_years: DASHA_YEARS[currentMaha.lord],
    antardasha: currentAntar.lord,
    antardasha_start: currentAntar.start,
    antardasha_end: currentAntar.end,
    sequence,
  }
}
