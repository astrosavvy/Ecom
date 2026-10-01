import React, { useEffect, useState } from "react"
import { Gift, Plus, RefreshCw, CheckCircle2, AlertCircle, X, Package } from "lucide-react"
import { api, formatINR } from "../api"
import OfferForm, { type OfferRow } from "./gift-guide/OfferForm"
import StockEditor from "./gift-guide/StockEditor"
import "../../styles/OfferManager.css"

export default function OfferManager() {
  const [rows, setRows] = useState<OfferRow[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = () =>
    api<{ products: OfferRow[] }>("/admin/gift-guide/offers")
      .then((data) => setRows(data.products || []))
      .catch((err) => setError(err.message))

  useEffect(() => {
    refresh()
  }, [])

  async function importCatalog() {
    setBusy(true)
    setNotice(null)
    setError(null)
    try {
      const result = await api<{ count: number; message: string }>("/admin/gift-guide/catalog", {
        method: "POST",
      })
      setNotice(`${result.count} authentic brand pieces synced with Medusa.`)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed")
    } finally {
      setBusy(false)
    }
  }

  const privateOffers = rows.filter((row) => row.metadata?.recommendation_only === true)
  const current = privateOffers.find((row) => row.id === selected) || null

  return (
    <div className="ad__page ad__page--wide offer-admin">
      {/* Studio Header */}
      <header className="ad__head">
        <div className="ad-eyebrow">CURATION & BUNDLES</div>
        <h1>Custom Gift Sets & Hampers</h1>
        <p>
          Curate multi-piece gift hampers and intentional gift sets with tracked inventory and tailored pricing.
        </p>
      </header>

      {/* Catalog Sync Banner */}
      <div className="offer-admin__catalog">
        <div>
          <strong>Brand Products Collection</strong>
          <p>
            Ensure all 10 authentic Younoya keepsakes and brooches are populated in Medusa. Tracked pieces can be combined into custom gift hampers.
          </p>
        </div>
        <button
          type="button"
          className="ad-btn-luxury"
          disabled={busy}
          onClick={importCatalog}
        >
          <RefreshCw size={14} className={busy ? "ad-spin-icon" : ""} />
          <span>{busy ? "Syncing Collection…" : "Sync Catalog Pieces"}</span>
        </button>
      </div>

      {/* Alerts */}
      {notice && (
        <div className="ad-alert ad-alert--success" style={{ marginBottom: "20px" }}>
          <CheckCircle2 size={16} />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="ad-alert-close">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="ad-alert ad-alert--danger" style={{ marginBottom: "20px" }}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ad-alert-close">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Two-Column Studio Layout */}
      <div className="offer-admin__layout">
        {/* Left Sidebar: Sets List */}
        <aside className="offer-admin__list">
          <div className="offer-admin__list-head">
            <h2>Curated Hampers ({privateOffers.length})</h2>
            <button
              type="button"
              className="ad-btn-plain"
              style={{
                border: "1px solid var(--ad-border-gold)",
                borderRadius: "8px",
                padding: "4px 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
              }}
              onClick={() => setSelected(null)}
            >
              <Plus size={13} />
              <span>New Hamper</span>
            </button>
          </div>

          {privateOffers.map((offer) => {
            const isApproved = offer.metadata?.gift_guide_approved === true
            return (
              <button
                className={selected === offer.id ? "is-selected" : ""}
                type="button"
                key={offer.id}
                onClick={() => setSelected(offer.id)}
              >
                {offer.thumbnail ? (
                  <img
                    src={offer.thumbnail}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = "/media/shop-wild-poise-card.webp"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "8px",
                      background: "var(--ad-bg)",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid var(--ad-border)",
                    }}
                  >
                    <Package size={20} color="var(--ad-ink-faint)" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{offer.title}</strong>
                  <small>
                    {formatINR(offer.variant?.price)} ·{" "}
                    <span
                      style={{
                        color: isApproved ? "var(--ad-sage)" : "var(--ad-amber)",
                        fontWeight: 600,
                      }}
                    >
                      {isApproved ? "Approved" : "Draft"}
                    </span>
                  </small>
                </div>
              </button>
            )
          })}

          {!privateOffers.length && (
            <div style={{ padding: "20px 8px", textAlign: "center", color: "var(--ad-ink-soft)", fontSize: "13px" }}>
              No custom hampers created yet. Click "+ New Hamper" to build one.
            </div>
          )}
        </aside>

        {/* Right Stage: Set / Hamper Editor */}
        <div>
          <OfferForm
            key={selected || "new"}
            selected={current}
            catalog={rows}
            onSaved={() => {
              setNotice("Gift set saved and updated successfully.")
              refresh()
            }}
          />
          {current && <StockEditor key={current.id} offer={current} />}
        </div>
      </div>
    </div>
  )
}
