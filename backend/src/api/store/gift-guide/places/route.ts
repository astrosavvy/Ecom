import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { searchPlaces } from "../../../../modules/younoya-astro/utils/geonames"

const visitors = new Map<string, { minute: number; count: number }>()

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const q = String(req.query.q ?? "")
    if (q.length > 90) return res.status(400).json({ message: "Search is too long" })
    const ip = String(req.ip || req.headers["cf-connecting-ip"] || "unknown")
    const minute = Math.floor(Date.now() / 60_000)
    const usage = visitors.get(ip)
    const count = usage?.minute === minute ? usage.count + 1 : 1
    visitors.set(ip, { minute, count })
    if (visitors.size > 2000) visitors.delete(visitors.keys().next().value as string)
    if (count > 25) return res.status(429).json({ message: "Please pause a moment before searching again." })
    return res.json({ places: await searchPlaces(q), attribution: "Place data © GeoNames, CC BY 4.0" })
  } catch {
    return res.status(503).json({ message: "City search is temporarily unavailable. You can continue with your birth date only." })
  }
}
