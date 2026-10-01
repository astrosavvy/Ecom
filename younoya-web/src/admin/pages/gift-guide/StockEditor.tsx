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
  return (
    <div className="offer-stock">
      <h3>Available Stock & Locations</h3>
      <p>Inventory levels are validated in real-time. Sets draw their available quantities directly from the configured pieces.</p>
      
      <div className="offer-form__grid" style={{ marginBottom: 16 }}>
        <label className="ad-field">
          <span>Fulfillment Location</span>
          <select value={locationId} onChange={(event) => setLocationId(event.target.value)}>
            {locations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}
          </select>
        </label>
      </div>

      {!locations.length && (
        <p style={{ color: "#D97706", fontSize: 13, background: "#FFFBEB", padding: "10px 14px", borderRadius: 8 }}>
          No Medusa fulfillment locations found. Please configure a stock location first.
        </p>
      )}

      {items.map((item) => (
        <div className="offer-stock__row" key={item.inventory_item_id}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ad-ink)" }}>Inventory Piece</span>
            <span style={{ fontSize: 11, color: "var(--ad-ink-muted)", fontFamily: "monospace" }}>{item.inventory_item_id}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="number"
              min="0"
              step="1"
              style={{ width: 90, textAlign: "center", height: 38 }}
              aria-label={`Stock for ${item.inventory_item_id}`}
              value={values[item.inventory_item_id] ?? 0}
              onChange={(event) => setValues((old) => ({ ...old, [item.inventory_item_id]: Number(event.target.value) }))}
            />
            <button
              type="button"
              className="ad-btn-luxury secondary"
              style={{ padding: "8px 14px", fontSize: 12 }}
              disabled={!locationId}
              onClick={() => save(item.inventory_item_id)}
            >
              Update Stock
            </button>
          </div>
        </div>
      ))}

      {notice && (
        <div role="status" style={{ marginTop: 12, fontSize: 12, color: "var(--ad-gold-strong)", fontWeight: 500 }}>
          {notice}
        </div>
      )}
    </div>
  )
}
