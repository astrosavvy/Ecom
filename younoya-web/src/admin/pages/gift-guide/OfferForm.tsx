import { useState } from "react"
import { api, getToken } from "../../api"
import { compressImage } from "../../utils/imageCompressor"

export type OfferRow = { id: string; title: string; handle: string; description?: string; thumbnail?: string;
  metadata?: Record<string, any>; variant?: { id: string; sku: string; price: number | null;
    inventoryItems: Array<{ inventory_item_id: string; required_quantity: number }> } }
const intentions = ["love-connection", "confidence-power", "vitality-balance", "wealth-prosperity"]
const empty = { title: "", handle: "", sku: "", description: "", thumbnail: "", price: "",
  approved: false, intentions: [] as string[], matrixKeys: "", components: [] as Array<{ variantId: string; quantity: number }> }

export default function OfferForm({ selected, catalog, onSaved }: { selected: OfferRow | null; catalog: OfferRow[]; onSaved: () => void }) {
  const initial = selected ? { title: selected.title, handle: selected.handle, sku: selected.variant?.sku || "",
    description: selected.description || "", thumbnail: selected.thumbnail || "",
    price: selected.variant?.price ? String(selected.variant.price / 100) : "",
    approved: selected.metadata?.gift_guide_approved === true,
    intentions: selected.metadata?.gift_guide_intentions || [],
    matrixKeys: (selected.metadata?.gift_guide_matrix_keys || []).join(", "),
    components: selected.metadata?.gift_guide_component_variants || [] } : empty
  const [form, setForm] = useState(initial)
  const [component, setComponent] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const change = (field: string, value: any) => setForm((old) => ({ ...old, [field]: value }))
  const options = catalog.filter((row) => row.variant?.id && row.id !== selected?.id &&
    row.variant.inventoryItems?.length && row.metadata?.recommendation_only !== true)
  async function upload(file: File) {
    setUploading(true); setError("")
    try {
      const prepared = await compressImage(file, { quality: .85 })
      const data = new FormData(); data.append("files", prepared.file)
      const host = import.meta.env.VITE_API_URL || "https://api.younoya.com"
      const response = await fetch(`${host}/admin/uploads`, {
        method: "POST", headers: { authorization: `Bearer ${getToken()}` }, body: data,
      })
      if (!response.ok) throw new Error("Image upload failed")
      const result = await response.json()
      const url = result.files?.[0]?.url || result.file?.url
      if (!url) throw new Error("Upload returned no image URL")
      change("thumbnail", new URL(url, host).href)
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not upload image") }
    finally { setUploading(false) }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("")
    try {
      await api(`/admin/gift-guide/offers${selected ? `/${selected.id}` : ""}`, {
        method: selected ? "PUT" : "POST", body: JSON.stringify({ ...form, price: Number(form.price),
          matrixKeys: form.matrixKeys.split(",").map((key) => key.trim()).filter(Boolean) }),
      })
      onSaved()
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Could not save the offer") }
    finally { setBusy(false) }
  }
  return <form className="offer-form" onSubmit={submit}>
    <div className="offer-form__head"><span>PRIVATE EDITION</span><h2>{selected ? "Refine this offer" : "Create an offer"}</h2>
      <p>A private edition appears only in the guide and through its direct link. Approval and stock determine when it can be recommended.</p></div>
    <div className="offer-form__grid"><label>Offer name<input required value={form.title} onChange={(event) => change("title", event.target.value)} /></label>
      <label>URL handle<input required disabled={!!selected} value={form.handle} onChange={(event) => change("handle", event.target.value)} /></label>
      <label>SKU<input required disabled={!!selected} value={form.sku} onChange={(event) => change("sku", event.target.value)} /></label>
      <label>Price in INR<input required type="number" min="100" step="1" value={form.price} onChange={(event) => change("price", event.target.value)} /></label></div>
    <label>Description<textarea required rows={3} value={form.description} onChange={(event) => change("description", event.target.value)} /></label>
    <label>Image URL<input required type="url" placeholder="https://…" value={form.thumbnail} onChange={(event) => change("thumbnail", event.target.value)} /></label>
    <label>Upload imagery<input type="file" accept="image/*" disabled={uploading} onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
      <small>{uploading ? "Optimizing and uploading…" : "Or paste an approved image URL above."}</small></label>
    <fieldset><legend>Intentions</legend>{intentions.map((value) => <label key={value}><input type="checkbox" checked={form.intentions.includes(value)}
      onChange={(event) => change("intentions", event.target.checked ? [...form.intentions, value] : form.intentions.filter((item) => item !== value))} />{value.replaceAll("-", " & ")}</label>)}</fieldset>
    <label>Mercury / Ketu matrix keys <small>Optional, comma separated</small><input value={form.matrixKeys} onChange={(event) => change("matrixKeys", event.target.value)} placeholder="ARIES-Mercury-love-connection" /></label>
    <div className="offer-form__kit"><strong>Included pieces</strong><p>Leave empty for a single keepsake. A set has its own price and uses each component’s tracked stock.</p>
      {form.components.map((part, index) => <div className="offer-form__component" key={`${part.variantId}-${index}`}>
        <span>{catalog.find((row) => row.variant?.id === part.variantId)?.title || part.variantId} × {part.quantity}</span>
        <button type="button" onClick={() => change("components", form.components.filter((_, at) => at !== index))}>Remove</button></div>)}
      <div className="offer-form__add"><select value={component} onChange={(event) => setComponent(event.target.value)}><option value="">Choose a stocked component</option>
        {options.map((row) => <option value={row.variant!.id} key={row.id}>{row.title}</option>)}</select>
        <button type="button" disabled={!component} onClick={() => { change("components", [...form.components, { variantId: component, quantity: 1 }]); setComponent("") }}>Add piece</button></div></div>
    <label className="offer-form__approval"><input type="checkbox" checked={form.approved} onChange={(event) => change("approved", event.target.checked)} />Approved for recommendations</label>
    {error && <p className="ad-error" role="alert">{error}</p>}
    <button className="offer-form__submit" disabled={busy}>{busy ? "Saving…" : selected ? "Save offer" : "Create private offer"}</button>
  </form>
}
