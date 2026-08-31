import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import Journey from "./Journey"

type Chapter = "threshold" | "cosmos" | "intent" | "reveal" | "seek"

// Wrapper around Journey that syncs URL like Cartier configurator
// ?chapter=threshold|cosmos|intent|reveal&dob=YYYY-MM-DD&rashi=Simha&occasion=rakhi&for=self&sankalpa=...
export default function Configurator() {
  const [params, setParams] = useSearchParams()
  const chapter = (params.get("chapter") as Chapter) || "threshold"
  const [sankalpa, setSankalpa] = useState(() => params.get("sankalpa") || "")

  // Keep URL sankalpa in sync
  useEffect(() => {
    const id = setTimeout(() => {
      if (sankalpa) {
        if (params.get("sankalpa") !== sankalpa) {
          const next = new URLSearchParams(params)
          next.set("sankalpa", sankalpa)
          setParams(next, { replace: true })
        }
      } else {
        if (params.has("sankalpa")) {
          const next = new URLSearchParams(params)
          next.delete("sankalpa")
          setParams(next, { replace: true })
        }
      }
    }, 120)
    return () => clearTimeout(id)
  }, [sankalpa, params, setParams])

  // Expose a helper to navigate chapters (Cartier-style)
  const goChapter = (c: Chapter, patch: Record<string, string | null> = {}) => {
    const next = new URLSearchParams(params)
    next.set("chapter", c)
    Object.entries(patch).forEach(([k, v]) => {
      if (v == null) next.delete(k)
      else next.set(k, v)
    })
    setParams(next)
  }

  // If reveal reached via direct shop link, allow quick jump
  useEffect(() => {
    // Hydrate from URL on mount - if dob/rashi present, we could auto-advance
    // For now, Journey handles its own internal step; this wrapper just provides URL sync and sankalpa
  }, [])

  return (
    <div>
      {/* Sankalpa live engraving bar — Cartier engraving equivalent */}
      {chapter === "reveal" && (
        <div style={{ maxWidth: 520, margin: "16px auto 0", padding: "0 16px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 16, padding: 16, boxShadow: "0 6px 18px -14px rgba(0,0,0,0.18)" }}>
            <label style={{ display: "block", fontFamily: "var(--yn-font-label)", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--yn-gold-strong)", marginBottom: 8 }}>Sankalpa — engraving preview</label>
            <input
              value={sankalpa}
              onChange={(e) => setSankalpa(e.target.value.slice(0, 48))}
              placeholder="Spoken in the sankalpa — e.g. For Aaryan, steady in Shani"
              maxLength={48}
              style={{ width: "100%", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 12, padding: "12px 14px", fontFamily: "var(--yn-font-display)", fontStyle: "italic", fontSize: 14, color: "#1a1a1e", background: "rgba(255,251,240,0.9)" }}
            />
            <div style={{ marginTop: 10, padding: 12, borderRadius: 12, background: "radial-gradient(ellipse at center, rgba(212,175,55,0.12), transparent 70%)", border: "1px dashed rgba(212,175,55,0.22)", textAlign: "center", fontFamily: "var(--yn-font-display)", fontStyle: "italic", fontSize: 13, color: "#5a534a", minHeight: 38, display: "grid", placeItems: "center" }}>
              {sankalpa ? <span style={{ color: "#B8860B", letterSpacing: "0.02em" }}>{sankalpa}</span> : <span style={{ opacity: 0.6 }}>Your words, foiled on the keepsake card</span>}
            </div>
            <p style={{ marginTop: 8, fontFamily: "var(--yn-font-label)", fontSize: 10, color: "rgba(26,26,30,0.45)", textAlign: "center" }}>Live preview — also saved to cart metadata on Add to Cart</p>
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "14px 0 0" }}>
        {(["threshold", "cosmos", "reveal"] as Chapter[]).map((c) => (
          <button key={c} onClick={() => goChapter(c)} style={{ fontFamily: "var(--yn-font-label)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 999, border: chapter === c ? "1px solid var(--yn-gold)" : "1px solid rgba(0,0,0,0.08)", background: chapter === c ? "rgba(212,175,55,0.12)" : "#fff", color: chapter === c ? "var(--yn-gold-strong)" : "rgba(26,26,30,0.55)" }}>{c}</button>
        ))}
      </div>
      <Journey />
    </div>
  )
}
