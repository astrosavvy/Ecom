type Place = { id: number; name: string; country: string; region: string; lat: number; lng: number }
const searchCache = new Map<string, { until: number; places: Place[] }>()
const placeCache = new Map<number, { until: number; place: Place & { timezone: string } }>()
const quota = { hour: 0, day: 0, hourUsed: 0, dayUsed: 0 }

async function geonames(path: string, params: Record<string, string>) {
  const username = process.env.GEONAMES_USERNAME
  if (!username) throw new Error("Birth-place search is not configured")
  const hour = Math.floor(Date.now() / 3600_000)
  const day = Math.floor(Date.now() / 86_400_000)
  if (quota.hour !== hour) { quota.hour = hour; quota.hourUsed = 0 }
  if (quota.day !== day) { quota.day = day; quota.dayUsed = 0 }
  if (quota.hourUsed >= 850 || quota.dayUsed >= 9000) throw new Error("Place-service limit reached; try again later")
  quota.hourUsed++; quota.dayUsed++
  const url = new URL(`https://secure.geonames.org/${path}`)
  Object.entries({ ...params, username }).forEach(([key, value]) => url.searchParams.set(key, value))
  const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!response.ok) throw new Error("Place service unavailable")
  const data = await response.json() as any
  if (data.status) throw new Error("Place service unavailable")
  return data
}

export async function searchPlaces(query: string): Promise<Place[]> {
  const name = query.trim().slice(0, 90)
  if (name.length < 3) return []
  const key = name.toLowerCase()
  const cached = searchCache.get(key)
  if (cached && cached.until > Date.now()) return cached.places
  const data = await geonames("searchJSON", {
    name_startsWith: name, featureClass: "P", maxRows: "8", orderby: "population", style: "FULL",
  })
  const places = (data.geonames ?? []).map((item: any) => ({
    id: Number(item.geonameId), name: String(item.name), country: String(item.countryName ?? ""),
    region: String(item.adminName1 ?? ""), lat: Number(item.lat), lng: Number(item.lng),
  })).filter((item: Place) => item.id && Number.isFinite(item.lat) && Number.isFinite(item.lng))
  searchCache.set(key, { until: Date.now() + 6 * 3600_000, places })
  if (searchCache.size > 500) searchCache.delete(searchCache.keys().next().value as string)
  return places
}

export async function resolvePlace(id: number): Promise<Place & { timezone: string }> {
  const cached = placeCache.get(id)
  if (cached && cached.until > Date.now()) return cached.place
  const data = await geonames("getJSON", { geonameId: String(id) })
  if (!data.geonameId || !Number.isFinite(Number(data.lat)) || !Number.isFinite(Number(data.lng))) {
    throw new Error("Choose a city from the suggestions")
  }
  const zone = await geonames("timezoneJSON", { lat: String(data.lat), lng: String(data.lng) })
  const timezone = String(zone.timezoneId ?? "")
  try { new Intl.DateTimeFormat("en", { timeZone: timezone }) } catch { throw new Error("Could not resolve the birth time zone") }
  const place = {
    id: Number(data.geonameId), name: String(data.name), country: String(data.countryName ?? ""),
    region: String(data.adminName1 ?? ""), lat: Number(data.lat), lng: Number(data.lng), timezone,
  }
  placeCache.set(id, { until: Date.now() + 24 * 3600_000, place })
  if (placeCache.size > 1000) placeCache.delete(placeCache.keys().next().value as number)
  return place
}
