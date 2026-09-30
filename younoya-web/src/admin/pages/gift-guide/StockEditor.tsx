import { useEffect, useState } from "react"
import { api } from "../../api"
import type { OfferRow } from "./OfferForm"

type Location = { id: string; name: string }
export default function StockEditor({ offer }: { offer: OfferRow }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [locationId, setLocationId] = useState("")
  const [levels, setLevels] = useState<Record<string, number>>({})
  const [values, setValues] = useState<Record<string, number>>({})
  const [notice, setNotice] = useState("")
  const items = offer.variant?.inventoryItems || []
  useEffect(() => { api<{ stock_locations: Location[] }>("/admin/stock-locations?limit=50")
    .then((data) => { setLocations(data.stock_locations || []); setLocationId(data.stock_locations?.[0]?.id || "") })
    .catch((error) => setNotice(error.message)) }, [])
  useEffect(() => {
    if (!locationId) return
    Promise.all(items.map(async (item) => {
      const data = await api<{ inventory_levels: Array<{ location_id: string; stocked_quantity: number }> }>(
        `/admin/inventory-items/${item.inventory_item_id}/location-levels`)
      return [item.inventory_item_id, data.inventory_levels?.find((level) => level.location_id === locationId)?.stocked_quantity] as const
    })).then((entries) => { const map = Object.fromEntries(entries.filter(([, qty]) => qty !== undefined))
      setLevels(map); setValues(map) }).catch((error) => setNotice(error.message))
  }, [offer.id, locationId])
  async function save(id: string) {
    const quantity = Number(values[id])
    if (!Number.isInteger(quantity) || quantity < 0) { setNotice("Stock must be a whole number of pieces."); return }
    try {
      const existing = levels[id] !== undefined
      await api(`/admin/inventory-items/${id}/location-levels${existing ? `/${locationId}` : ""}`, {
        method: "POST", body: JSON.stringify(existing ? { stocked_quantity: quantity } : { location_id: locationId, stocked_quantity: quantity }),
      })
      setLevels((old) => ({ ...old, [id]: quantity })); setNotice("Stock saved at this location.")
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save stock") }
  }
  return <div className="offer-stock"><h3>Available stock</h3><p>Inventory is checked again before checkout. A set draws from the pieces it contains.</p>
    <label>Stock location <select value={locationId} onChange={(event) => setLocationId(event.target.value)}>
      {locations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}</select></label>
    {!locations.length && <p>Add a Medusa stock location before making this offer available.</p>}
    {items.map((item) => <div className="offer-stock__row" key={item.inventory_item_id}><span>{item.inventory_item_id}</span>
      <input type="number" min="0" step="1" aria-label={`Stock for ${item.inventory_item_id}`} value={values[item.inventory_item_id] ?? 0}
        onChange={(event) => setValues((old) => ({ ...old, [item.inventory_item_id]: Number(event.target.value) }))} />
      <button type="button" disabled={!locationId} onClick={() => save(item.inventory_item_id)}>Save stock</button></div>)}
    {notice && <p role="status">{notice}</p>}</div>
}
