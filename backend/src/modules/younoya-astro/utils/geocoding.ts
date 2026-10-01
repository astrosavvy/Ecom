/**
 * Unified Geocoding Service (OpenCage Primary + GeoNames Fallback)
 * 
 * OpenCage free tier: 2,500 requests/day.
 * Optimization: Strictly suppresses calls for queries < 4 letters.
 * Caches query results and resolved places for 24 hours.
 */

export type Place = {
  id: number
  name: string
  country: string
  region: string
  lat: number
  lng: number
}

export type ResolvedPlace = Place & {
  timezone: string
  offsetString?: string
}

const searchCache = new Map<string, { until: number; places: Place[] }>()
const placeCache = new Map<number, { until: number; place: ResolvedPlace }>()

/**
 * Generates a stable positive 31-bit integer from lat/lng coordinates
 */
export function generatePlaceId(lat: number, lng: number): number {
  const str = `${lat.toFixed(4)}:${lng.toFixed(4)}`
  let hash = 2166136261
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash | 0) || 1
}

/**
 * Returns attribution string for active geocoding provider
 */
export function getGeocodingAttribution(): string {
  if (process.env.OPENCAGE_API_KEY) {
    return "Place data © OpenCage, OpenStreetMap contributors"
  }
  return "Place data © GeoNames, CC BY 4.0"
}

/**
 * Searches places using OpenCage (or GeoNames if OpenCage key missing)
 * Strictly requires at least 4 characters to preserve API quota.
 */
export async function searchPlaces(query: string): Promise<Place[]> {
  const trimmed = query.trim().slice(0, 90)
  // Strictly suppress API calls for queries shorter than 4 characters
  if (trimmed.length < 4) {
    return []
  }

  const cacheKey = trimmed.toLowerCase()
  const cached = searchCache.get(cacheKey)
  if (cached && cached.until > Date.now()) {
    return cached.places
  }

  const openCageKey = process.env.OPENCAGE_API_KEY
  let places: Place[] = []

  if (openCageKey) {
    places = await searchOpenCage(trimmed, openCageKey)
  } else if (process.env.GEONAMES_USERNAME) {
    places = await searchGeoNames(trimmed, process.env.GEONAMES_USERNAME)
  } else {
    throw new Error("Birth-place search is not configured. Please set OPENCAGE_API_KEY.")
  }

  searchCache.set(cacheKey, { until: Date.now() + 24 * 3600_000, places })
  if (searchCache.size > 1000) {
    const firstKey = searchCache.keys().next().value
    if (firstKey) searchCache.delete(firstKey)
  }

  return places
}

/**
 * Resolves place details including coordinates and IANA timezone by placeId
 */
export async function resolvePlace(id: number): Promise<ResolvedPlace> {
  const cached = placeCache.get(id)
  if (cached && cached.until > Date.now()) {
    return cached.place
  }

  // If placeCache missed (e.g. server restart), attempt lookup in GeoNames if configured
  if (process.env.GEONAMES_USERNAME && !process.env.OPENCAGE_API_KEY) {
    return resolveGeoNames(id)
  }

  throw new Error("Choose a city from the suggestions")
}

async function searchOpenCage(query: string, apiKey: string): Promise<Place[]> {
  const url = new URL("https://api.opencagedata.com/geocode/v1/json")
  url.searchParams.set("q", query)
  url.searchParams.set("key", apiKey)
  url.searchParams.set("limit", "8")
  url.searchParams.set("no_annotations", "0")

  const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!response.ok) {
    throw new Error("City search service is temporarily unavailable")
  }

  const data = (await response.json()) as any
  const results = data.results || []

  const places: Place[] = []

  for (const item of results) {
    const lat = Number(item.geometry?.lat)
    const lng = Number(item.geometry?.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue

    const comp = item.components || {}
    const name = comp.city || comp.town || comp.village || comp.municipality || comp.state_district || item.formatted?.split(",")?.[0] || query
    const region = comp.state || comp.county || ""
    const country = comp.country || ""
    const timezone = item.annotations?.timezone?.name || "Asia/Kolkata"
    const offsetString = item.annotations?.timezone?.offset_string || "+0530"

    const id = generatePlaceId(lat, lng)

    const place: Place = { id, name: String(name), region: String(region), country: String(country), lat, lng }
    places.push(place)

    // Store in placeCache
    placeCache.set(id, {
      until: Date.now() + 24 * 3600_000,
      place: { ...place, timezone, offsetString },
    })
  }

  if (placeCache.size > 2000) {
    const firstKey = placeCache.keys().next().value
    if (firstKey) placeCache.delete(firstKey)
  }

  return places
}

async function searchGeoNames(name: string, username: string): Promise<Place[]> {
  const url = new URL("https://secure.geonames.org/searchJSON")
  url.searchParams.set("name_startsWith", name)
  url.searchParams.set("featureClass", "P")
  url.searchParams.set("maxRows", "8")
  url.searchParams.set("orderby", "population")
  url.searchParams.set("style", "FULL")
  url.searchParams.set("username", username)

  const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!response.ok) throw new Error("City search service is temporarily unavailable")
  const data = (await response.json()) as any
  if (data.status) throw new Error("City search service is temporarily unavailable")

  return (data.geonames ?? [])
    .map((item: any) => ({
      id: Number(item.geonameId),
      name: String(item.name),
      country: String(item.countryName ?? ""),
      region: String(item.adminName1 ?? ""),
      lat: Number(item.lat),
      lng: Number(item.lng),
    }))
    .filter((item: Place) => item.id && Number.isFinite(item.lat) && Number.isFinite(item.lng))
}

async function resolveGeoNames(id: number): Promise<ResolvedPlace> {
  const username = process.env.GEONAMES_USERNAME
  if (!username) throw new Error("Choose a city from the suggestions")

  const placeUrl = new URL("https://secure.geonames.org/getJSON")
  placeUrl.searchParams.set("geonameId", String(id))
  placeUrl.searchParams.set("username", username)

  const response = await fetch(placeUrl, { signal: AbortSignal.timeout(5000) })
  if (!response.ok) throw new Error("City search service is temporarily unavailable")
  const data = (await response.json()) as any

  const tzUrl = new URL("https://secure.geonames.org/timezoneJSON")
  tzUrl.searchParams.set("lat", String(data.lat))
  tzUrl.searchParams.set("lng", String(data.lng))
  tzUrl.searchParams.set("username", username)

  const tzResponse = await fetch(tzUrl, { signal: AbortSignal.timeout(5000) })
  const zone = tzResponse.ok ? (await tzResponse.json()) as any : {}
  const timezone = String(zone.timezoneId ?? "Asia/Kolkata")

  return {
    id: Number(data.geonameId),
    name: String(data.name),
    country: String(data.countryName ?? ""),
    region: String(data.adminName1 ?? ""),
    lat: Number(data.lat),
    lng: Number(data.lng),
    timezone,
  }
}
