import { Link } from "react-router"

export default function HomePage() {

  // Dash replica: define work cases from products + chapters — static assets, no API thumbnail
  const workCases = [
    { title: "Love — Pearl Sukh", desc: "Bespoke keepsake for harmony · Venus-led, moonstone calm.", img: "/products/pearl-chandra-sukh-bracelet.webp", handle: "pearl-chandra-sukh-bracelet" },
    { title: "Becoming — Guru Blessing", desc: "Heritage gold for growth · Jupiter pukhraj, panchaloha weight.", img: "/products/yellow-sapphire-guru-blessing-ring.webp", handle: "yellow-sapphire-guru-blessing-ring" },
    { title: "Shelter — Shree Yantra", desc: "Clear-quartz geometry · Lakshmi's Sphatik, consecrated 108×.", img: "/products/sphatik-shree-yantra-pendant.webp", handle: "sphatik-shree-yantra-pendant" },
    { title: "Calm — Amavasya Bracelet", desc: "Rainbow moonstone for water signs · Som Shanti.", img: "/products/moonstone-amavasya-bracelet.webp", handle: "moonstone-amavasya-bracelet" },
    { title: "Prosperity — Wealth Rakhi", desc: "Yellow citrine Sun-Jupiter · next-gen festive thread.", img: "/products/vedic-prosperity-wealth-attraction-rakhi.webp", handle: "vedic-prosperity-wealth-attraction-rakhi" },
    { title: "Protection — Hanuman Gada", desc: "Silver gada locket · Mars-Saturn shield, Hanuman Chalisa.", img: "/products/hanuman-gada-protection-locket.webp", handle: "hanuman-gada-protection-locket" },
  ]

  return (
    <div className="homepage" style={{ background: "#FFFBF0" }}>
      {/* Dash hero — Magnetic */}
      <section className="dash-hero">
        <h1>
          <em>Magnetic</em> gifting for every <em>chapter</em>
        </h1>
        <p className="dash-hero__sub">
          Partnering with your stars — we deliver keepsakes curated by moon sign, nakshatra and 120-year dasha. Not by category, by what you want to invite. Your chart is the brief.
        </p>
      </section>

      {/* Dash work grid — exact replica structure */}
      <section className="dash-work-grid">
        {workCases.map((c) => (
          <Link key={c.handle} to={`/product/${c.handle}`} className="dash-card">
            <div className="dash-card__img">
              <img src={c.img} alt={c.title} loading="lazy" />
            </div>
            <div className="dash-card__title">
              {c.title}
              <span className="dash-card__arrow" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: "-8px" }}><path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
            <p className="dash-card__desc">{c.desc}</p>
          </Link>
        ))}
      </section>

      {/* Retain brand Bento below work grid for chapter navigation */}
      <section className="section" style={{ background: '#FFFBF0', borderRadius: '24px', padding: '48px 24px', maxWidth: '1180px', margin: '32px auto 0' }}>
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto' }}>
          <span className="section__label" style={{ display: 'block', marginBottom: '10px' }}>Curated by meaning</span>
          <h2 className="section__title" style={{ textAlign: "center", color: '#1a1a1e', fontFamily: 'var(--yn-font-display)', fontWeight: 600 }}>For every chapter</h2>
          <p className="text-editorial" style={{ textAlign: 'center', marginTop: '10px', color: '#6b645c', fontSize: '14px' }}>One question, one chapter — your chart picks the objects that hold it.</p>
        </div>
        <div className="yn-bento" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gridTemplateRows: "auto auto", gap: "16px", marginTop: "28px" }}>
          {/* Love — 1.6fr spanning 2 rows */}
          <Link to="/shop?chapter=love" style={{ gridRow: "1 / span 2", background: "#fff", border: "1px solid rgba(232,160,191,0.22)", borderRadius: "16px", padding: "22px 18px", display: "grid", gap: "12px", textDecoration: "none", boxShadow: "0 6px 18px -14px rgba(0,0,0,0.18)", transition: "transform 0.3s, border-color 0.3s", color: "inherit" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(232,160,191,0.14)", border: "1px solid rgba(232,160,191,0.28)", fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "14px", color: "#8a4a6a" }}>♡</div>
            <span style={{ fontFamily: "var(--yn-font-label)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--yn-gold-strong)" }}>Chapter 01</span>
            <h3 style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "22px", color: "#1a1a1e", margin: 0 }}>Love</h3>
            <p style={{ fontFamily: "var(--yn-font-body)", fontSize: "13px", color: "#6b645c", lineHeight: 1.6, margin: 0 }}>Attraction, harmony, repair — Venus-led picks.</p>
            <div style={{ aspectRatio: "4/3", borderRadius: "12px", overflow: "hidden", background: "#FFFBF0", marginTop: "4px" }}>
              <img src="/products/pearl-chandra-sukh-bracelet.webp" alt="Love" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            </div>
            <span style={{ fontFamily: "var(--yn-font-label)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yn-gold-strong)" }}>Explore Love →</span>
          </Link>
          {/* Becoming — top right */}
          <Link to="/shop?chapter=becoming" style={{ background: "#fff", border: "1px solid rgba(212,175,55,0.18)", borderRadius: "16px", padding: "18px", display: "grid", gap: "8px", textDecoration: "none", boxShadow: "0 6px 18px -14px rgba(0,0,0,0.18)", color: "inherit" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.22)", fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "13px", color: "var(--yn-gold-strong)" }}>↗</div>
            <h3 style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "18px", color: "#1a1a1e", margin: 0 }}>Becoming</h3>
            <p style={{ fontFamily: "var(--yn-font-body)", fontSize: "12px", color: "#6b645c", lineHeight: 1.5, margin: 0 }}>Grow, start, steady — Mercury & Saturn.</p>
            <span style={{ fontFamily: "var(--yn-font-label)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--yn-gold-strong)" }}>Career · Confidence →</span>
          </Link>
          {/* Shelter — bottom right */}
          <Link to="/shop?chapter=shelter" style={{ background: "#fff", border: "1px solid rgba(14,42,71,0.14)", borderRadius: "16px", padding: "18px", display: "grid", gap: "8px", textDecoration: "none", boxShadow: "0 6px 18px -14px rgba(0,0,0,0.18)", color: "inherit" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(14,42,71,0.08)", border: "1px solid rgba(14,42,71,0.18)", fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "13px", color: "#0E2A47" }}>⌂</div>
            <h3 style={{ fontFamily: "var(--yn-font-display)", fontWeight: 600, fontSize: "18px", color: "#1a1a1e", margin: 0 }}>Shelter</h3>
            <p style={{ fontFamily: "var(--yn-font-body)", fontSize: "12px", color: "#6b645c", lineHeight: 1.5, margin: 0 }}>Calm, home, gifting — Moon & Jupiter.</p>
            <span style={{ fontFamily: "var(--yn-font-label)", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0E2A47" }}>Calm · Home →</span>
          </Link>
        </div>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Link to="/shop" style={{ fontFamily: "var(--yn-font-label)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--yn-gold-strong)", textDecoration: "none" }}>View all intentions →</Link>
        </div>
      </section>

      {/* Proof marquee — trust (dash style) */}
      <div className="yn-marquee" style={{ background: '#fff', borderTop: '1px solid rgba(26,26,30,0.06)', borderBottom: '1px solid rgba(26,26,30,0.06)', padding: '14px 0', margin: '16px 0 0' }}>
        <div className="yn-marquee__track" style={{ display: 'inline-flex', gap: '28px', alignItems: 'center' }}>
          {['14 keepsakes · 108 chants', '27 nakshatras · 120-year cycle', 'Vedic + intention curated', 'No generic · Only personal', 'Crafted to birth time'].concat(['14 keepsakes · 108 chants', '27 nakshatras · 120-year cycle', 'Vedic + intention curated', 'No generic · Only personal', 'Crafted to birth time']).map((t, i) => (
            <span key={i} style={{ fontFamily: 'var(--yn-font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(26,26,30,0.55)', whiteSpace: 'nowrap', display: 'inline-flex', gap: '8px', alignItems: 'center' }}><span style={{ color: 'var(--yn-gold)' }}>✦</span>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
