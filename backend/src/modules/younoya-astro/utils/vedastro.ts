/**
 * VedAstro Open API Client
 * 
 * Interacts with https://api.vedastro.org/api
 * Strictly handles Vimshottari Dasha and Moon Sign calculations with
 * a sliding-window rate limiter (max 5 calls/min) and in-memory cache.
 */

export type VedAstroBirthInput = {
  dob: string // YYYY-MM-DD
  tob: string // HH:mm
  lat: number
  lng: number
  timezone: string // IANA timezone e.g. "Asia/Kolkata"
  offsetString?: string // e.g. "+0530" or "+05:30"
  placeName: string
}

export type VedAstroAstroResult = {
  moonSign: string
  mahadasha: string
  antardasha: string
  pratyantardasha?: string
  description?: string
  nature?: string
  source: "vedastro"
}

// 24-hour LRU in-memory calculation cache
type CachedCalculation = {
  until: number
  result: VedAstroAstroResult
}
const calcCache = new Map<string, CachedCalculation>()

// Rate Limiter: Max 5 calls per rolling 60-second window across the instance
class VedAstroRateLimiter {
  private timestamps: number[] = []
  private readonly maxCallsPerMinute = 5

  async acquire(): Promise<void> {
    const now = Date.now()
    // Retain timestamps within the last 60 seconds
    this.timestamps = this.timestamps.filter((t) => now - t < 60_000)

    if (this.timestamps.length >= this.maxCallsPerMinute) {
      const oldest = this.timestamps[0]
      const waitMs = 60_000 - (now - oldest) + 50
      if (waitMs > 10_000) {
        throw new Error("The Vedic calculation service is busy. Please pause a moment and try again.")
      }
      await new Promise((resolve) => setTimeout(resolve, waitMs))
      return this.acquire()
    }

    this.timestamps.push(Date.now())
  }
}

export const vedAstroLimiter = new VedAstroRateLimiter()

/**
 * Format timezone offset to '+HH:mm' or '-HH:mm'
 */
export function formatOffset(rawOffset?: string): string {
  if (rawOffset) {
    const trimmed = rawOffset.trim()
    if (/^[+-]\d{2}:\d{2}$/.test(trimmed)) return trimmed
    if (/^[+-]\d{4}$/.test(trimmed)) {
      return `${trimmed.slice(0, 3)}:${trimmed.slice(3)}`
    }
  }
  return "+00:00"
}

/**
 * Derives offset string from IANA timezone if not supplied
 */
export function getOffsetForDate(ianaTimezone: string, dateStr: string, timeStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number)
    const [hh, mm] = timeStr.split(":").map(Number)
    const date = new Date(Date.UTC(y, m - 1, d, hh, mm))

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      timeZoneName: "longOffset",
    })
    const parts = formatter.formatToParts(date)
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || ""
    const match = tzPart.match(/GMT([+-]\d{1,2}:?\d{2})?/)
    if (match && match[1]) {
      const raw = match[1]
      return formatOffset(raw.includes(":") ? raw : `${raw.slice(0, 3)}:${raw.slice(3)}`)
    }
  } catch {
    // fallback
  }
  return "+05:30" // default Indian Standard Time
}

/**
 * Calls VedAstro API strictly without synthetic fallback
 */
export async function fetchVedAstroAstrology(input: VedAstroBirthInput): Promise<VedAstroAstroResult> {
  const ayanamsa = process.env.VEDASTRO_AYANAMSA || "LAHIRI"
  const cacheKey = `${input.dob}_${input.tob}_${input.lat.toFixed(3)}_${input.lng.toFixed(3)}_${ayanamsa}`

  const cached = calcCache.get(cacheKey)
  if (cached && cached.until > Date.now()) {
    return cached.result
  }

  const [year, month, day] = input.dob.split("-")
  const offset = input.offsetString
    ? formatOffset(input.offsetString)
    : getOffsetForDate(input.timezone, input.dob, input.tob)

  const stdTime = `${input.tob} ${day}/${month}/${year} ${offset}`
  const baseUrl = process.env.VEDASTRO_API_URL || "https://api.vedastro.org/api"
  const apiKey = process.env.VEDASTRO_API_KEY || ""

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (apiKey) {
    headers["x-api-key"] = apiKey
  }

  const location = {
    Name: input.placeName || "Birth Place",
    Longitude: input.lng,
    Latitude: input.lat,
  }

  // Rate-limited call to DasaForNow
  await vedAstroLimiter.acquire()
  const dasaPayload = await callVedAstroEndpoint(`${baseUrl}/Calculate/DasaForNow`, {
    Ayanamsa: ayanamsa,
    BirthTime: { StdTime: stdTime, Location: location },
    Levels: 2,
  }, headers)

  // Rate-limited call to MoonSignName
  await vedAstroLimiter.acquire()
  const moonPayload = await callVedAstroEndpoint(`${baseUrl}/Calculate/MoonSignName`, {
    Ayanamsa: ayanamsa,
    Time: { StdTime: stdTime, Location: location },
  }, headers)

  // Parse Dasa
  const dasaObj = dasaPayload?.Payload?.DasaForNow || {}
  const mahaLordKey = Object.keys(dasaObj)[0]
  if (!mahaLordKey) {
    throw new Error("Could not compute Vimshottari Dasa from VedAstro.")
  }

  const mahaInfo = dasaObj[mahaLordKey] || {}
  const subDasas = mahaInfo.SubDasas || {}
  const antarLordKey = Object.keys(subDasas)[0] || mahaLordKey
  const antarInfo = subDasas[antarLordKey] || {}

  // Parse Moon Sign
  const moonSign = String(moonPayload?.Payload?.MoonSignName || "").trim()
  if (!moonSign) {
    throw new Error("Could not compute Moon Sign from VedAstro.")
  }

  const result: VedAstroAstroResult = {
    moonSign,
    mahadasha: mahaLordKey,
    antardasha: antarLordKey,
    pratyantardasha: undefined,
    description: antarInfo.Description || mahaInfo.Description || undefined,
    nature: antarInfo.Nature || mahaInfo.Nature || undefined,
    source: "vedastro",
  }

  // Cache for 24 hours
  calcCache.set(cacheKey, { until: Date.now() + 24 * 3600_000, result })
  if (calcCache.size > 2000) {
    const firstKey = calcCache.keys().next().value
    if (firstKey) calcCache.delete(firstKey)
  }

  return result
}

async function callVedAstroEndpoint(url: string, body: unknown, headers: Record<string, string>): Promise<any> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(6000),
  })

  if (!response.ok) {
    throw new Error(`VedAstro API call failed with status ${response.status}`)
  }

  const data = await response.json() as any
  if (data.Status !== "Pass") {
    throw new Error(data.Payload ? JSON.stringify(data.Payload) : "VedAstro calculation returned non-pass status")
  }

  return data
}
