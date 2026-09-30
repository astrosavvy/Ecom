import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getCustomerId } from "../../../utils/auth"
import { YOUNOYA_ASTRO_MODULE } from "../../../../modules/younoya-astro"
import { computeChart } from "../../../../modules/younoya-astro/utils/chart"
import { resolvePlace } from "../../../../modules/younoya-astro/utils/geonames"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const astro = req.scope.resolve(YOUNOYA_ASTRO_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const profiles = await astro.listAstroProfiles(
    { owner_customer_id: customerId },
    { order: { created_at: "DESC" } }
  )
  return res.json({ profiles })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const astro = req.scope.resolve(YOUNOYA_ASTRO_MODULE) as any
  const customerId = getCustomerId(req)
  if (!customerId) return res.status(401).json({ message: "Unauthorized" })

  const body = (req.body ?? {}) as {
    full_name?: string
    relationship?: string
    is_self?: boolean
    phone?: string
    dob?: string
    tob?: string | null
    pob?: string
    placeId?: number
  }

  if (!body.full_name || !body.dob || !/^\d{4}-\d{2}-\d{2}$/.test(body.dob)) {
    return res.status(400).json({ message: "full_name and dob (YYYY-MM-DD) are required." })
  }
  if (body.tob && !/^\d{1,2}:\d{2}$/.test(body.tob)) {
    return res.status(400).json({ message: "tob must be HH:mm (24h) or omitted." })
  }

  if (!Number.isSafeInteger(Number(body.placeId))) {
    return res.status(400).json({ message: "Choose a birth city from the place suggestions." })
  }
  let place
  try { place = await resolvePlace(Number(body.placeId)) }
  catch { return res.status(400).json({ message: "Birth city could not be resolved. Please choose it again." }) }
  const pobLabel = [place.name, place.region, place.country].filter(Boolean).join(", ")

  let chart
  try {
    chart = computeChart({
      dob: body.dob,
      tob: body.tob || null,
      pob_lat: place.lat,
      pob_lng: place.lng,
      pob_tz: place.timezone,
    })
  } catch (e) {
    return res.status(400).json({ message: "Could not compute chart. Check dob/tob values." })
  }

  const isSelf = body.is_self !== false && (body.relationship ?? "self") === "self"

  const profile = await astro.createAstroProfiles({
    owner_customer_id: customerId,
    full_name: body.full_name.trim(),
    relationship: body.relationship || (isSelf ? "self" : "friend"),
    is_self: isSelf,
    phone: body.phone || null,
    dob: body.dob,
    tob: body.tob || null,
    pob: pobLabel,
    pob_lat: place.lat,
    pob_lng: place.lng,
    pob_tz: place.timezone,
    sun_sign: chart.sun_sign,
    moon_sign: chart.moon_sign,
    nakshatra: chart.nakshatra,
    nakshatra_index: chart.nakshatra_index,
    element: chart.element,
    ruling_planet: chart.ruling_planet,
    chart: chart as unknown as Record<string, unknown>,
  })

  return res.json({ profile, chart })
}
