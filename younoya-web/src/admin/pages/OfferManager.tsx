import { useEffect, useState } from "react"
import { api, formatINR } from "../api"
import OfferForm, { type OfferRow } from "./gift-guide/OfferForm"
import StockEditor from "./gift-guide/StockEditor"
import "../../styles/OfferManager.css"

export default function OfferManager() {
  const [rows, setRows] = useState<OfferRow[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")
  const refresh = () => api<{ products: OfferRow[] }>("/admin/gift-guide/offers")
    .then((data) => setRows(data.products || [])).catch((error) => setNotice(error.message))
  useEffect(() => { refresh() }, [])
  async function importCatalog() {
    setBusy(true); setNotice("")
    try { const result = await api<{ count: number; message: string }>("/admin/gift-guide/catalog", { method: "POST" })
      setNotice(`${result.count} public pieces imported. ${result.message}`); await refresh()
    } catch (error) { setNotice(error instanceof Error ? error.message : "Import failed") }
    finally { setBusy(false) }
  }
  const privateOffers = rows.filter((row) => row.metadata?.recommendation_only === true)
  const current = privateOffers.find((row) => row.id === selected) || null
  return <div className="ad__page offer-admin"><header className="ad__head"><h1>Gift guide offers</h1>
    <p>Curate recommendation-only pieces and sets, with real prices and inventory.</p></header>
    <div className="offer-admin__catalog"><div><strong>Public collection</strong><p>Import the ten current brooches into Medusa. Existing products are left untouched. Add stock before they can be recommended.</p></div>
      <button type="button" disabled={busy} onClick={importCatalog}>{busy ? "Importing…" : "Import missing pieces"}</button></div>
    {notice && <p className="offer-admin__notice" role="status">{notice}</p>}
    <div className="offer-admin__layout"><aside className="offer-admin__list"><div className="offer-admin__list-head"><h2>Private editions</h2><button type="button" onClick={() => setSelected(null)}>New +</button></div>
      {privateOffers.map((offer) => <button className={selected === offer.id ? "is-selected" : ""} type="button" key={offer.id} onClick={() => setSelected(offer.id)}>
        {offer.thumbnail && <img src={offer.thumbnail} alt="" />}<span><strong>{offer.title}</strong><small>{formatINR(offer.variant?.price)} · {offer.metadata?.gift_guide_approved ? "Approved" : "Draft"}</small></span></button>)}
      {!privateOffers.length && <p>No private editions yet.</p>}</aside>
      <div><OfferForm key={selected || "new"} selected={current} catalog={rows} onSaved={() => { setNotice("Offer saved."); refresh() }} />
        {current && <StockEditor key={current.id} offer={current} />}</div></div>
  </div>
}
