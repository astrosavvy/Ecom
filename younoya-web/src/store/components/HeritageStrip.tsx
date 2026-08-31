export default function HeritageStrip({ dasha, nakshatra }: { dasha?: string; nakshatra?: string; productHandle?: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "18px 0", borderTop: "1px solid rgba(212,175,55,0.16)", borderBottom: "1px solid rgba(212,175,55,0.16)", background: "rgba(255,251,240,0.9)", padding: 16, borderRadius: 16 }}>
      <div>
        <div style={{ fontFamily: "var(--yn-font-label)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--yn-gold-strong)", marginBottom: 6 }}>VIMŚOTTARĪ · 120Y</div>
        <div style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: 13, color: "#1a1a1e", marginBottom: 4 }}>Your Mahādaśā, not just Rāśi</div>
        <div style={{ fontFamily: "var(--yn-font-body)", fontSize: 11, color: "#6b645c", lineHeight: 1.5 }}>Ketu7 · Venus20 · Sun6 · Moon10 · Mars7 · Rāhu18 · Jup16 · Sat19 · Merc17. {nakshatra ? `${nakshatra} picks lord.` : "Birth nakshatra picks lord."} {dasha ? `Now: ${dasha}` : ""}</div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--yn-font-label)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--yn-gold-strong)", marginBottom: 6 }}>CANONICAL · ŚĀSTRA</div>
        <div style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: 13, color: "#1a1a1e", marginBottom: 4 }}>Consecrated, not manufactured</div>
        <div style={{ fontFamily: "var(--yn-font-body)", fontSize: 11, color: "#6b645c", lineHeight: 1.5 }}>108× mantra at Brahma Muhūrta, ghee-flame aarti. Prāṇa-pratiṣṭhā, not plating.</div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--yn-font-label)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--yn-gold-strong)", marginBottom: 6 }}>ATELIER SPHERE · JAIPUR</div>
        <div style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: 13, color: "#1a1a1e", marginBottom: 4 }}>Jaipur Sphere</div>
        <div style={{ fontFamily: "var(--yn-font-body)", fontSize: 11, color: "#6b645c", lineHeight: 1.5 }}>925 silver / panchaloha sphere, velvet stored. Recharge on Purnima.</div>
      </div>
    </div>
  )
}
