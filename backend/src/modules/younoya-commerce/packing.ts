import { CommerceError } from "./db"
export function pack(items: any[], s: any) {
  const counts = new Map<string, number>()
  for (const item of items || []) {
    const id = item.variant_id || item.variant?.id
    const quantity = Number(item.quantity)
    if (!id || !Number.isInteger(quantity) || quantity < 1) throw new CommerceError("This selection needs an approved parcel specification.")
    counts.set(id, (counts.get(id) || 0) + quantity)
  }
  if (!counts.size) throw new CommerceError("Your selection is empty.")
  const units = [...counts.values()].reduce((a,b) => a+b,0)
  let contentsKg = 0
  for (const [id, quantity] of counts) {
    const spec = s.variants.find((v: any) => v.id === id)
    if (!spec) throw new CommerceError("Packaging for this selection is being prepared. Please contact the atelier.", 409)
    contentsKg += spec.packedUnitKg * quantity
  }
  const options = s.parcels.filter((p: any) => units <= p.maxUnits && [...counts.keys()].every(id => p.variantIds.includes(id))
    && contentsKg + p.tareKg <= p.maxWeightKg)
  if (!s.packagingReviewed || !options.length) throw new CommerceError("No approved parcel fits this selection. Please contact the atelier.", 409)
  const parcel = [...options].sort((a,b) => a.lengthCm*a.widthCm*a.heightCm-b.lengthCm*b.widthCm*b.heightCm)[0]
  return { ...parcel, weightKg: Math.ceil((contentsKg + parcel.tareKg) * 1000) / 1000 }
}
