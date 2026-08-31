import { useEffect, useRef } from "react"

export default function HeroCinematic() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Autoplay muted inline video reliably
    const p = v.play()
    if (p && p.catch) p.catch(() => {})
  }, [])

  return (
    <section
      id="younoya-hero"
      style={{
        position: "relative",
        minHeight: "88vh",
        overflow: "hidden",
        background: "var(--yn-canvas)",
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* Video backdrop - uses the GenZ 10s thriller clip */}
      <video
        ref={videoRef}
        src="/assets/vid/story_10s.mp4"
        poster="/assets/story_poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 42%",
          filter: "brightness(0.72) saturate(1.05)",
        }}
      />
      {/* Midnight scrim for legibility - premium */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 38%, rgba(7,8,14,0.18) 0%, rgba(7,8,14,0.55) 62%, rgba(7,8,14,0.82) 100%), linear-gradient(to bottom, rgba(7,8,14,0.22) 0%, transparent 28%, rgba(7,8,14,0.48) 100%)",
        }}
      />
      {/* Amber glow accent */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "18%",
          width: "680px",
          height: "680px",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.11), transparent 66%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />

      {/* Centered content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "clamp(24px, 6vw, 64px) 24px",
          maxWidth: "780px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "7px 16px",
            borderRadius: "999px",
            background: "rgba(8,10,16,0.58)",
            border: "1px solid rgba(212,175,55,0.22)",
            backdropFilter: "blur(10px)",
            fontFamily: "var(--yn-font-label)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--yn-gold)",
            marginBottom: "18px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--yn-gold)", boxShadow: "0 0 10px rgba(212,175,55,0.7)" }} />
          For every chapter
        </div>

        <h1
          className="text-display"
          style={{
            color: "var(--yn-ink)",
            fontFamily: "var(--yn-font-display)",
            fontWeight: 420,
            fontSize: "clamp(38px, 6vw, 64px)",
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 18px rgba(0,0,0,0.65), 0 12px 44px rgba(0,0,0,0.55)",
            margin: 0,
          }}
        >
          Meaning, <em style={{ fontStyle: "italic", fontWeight: 440, color: "var(--yn-gold)" }}>made personal.</em>
        </h1>
        <p
          className="section__subtitle"
          style={{
            color: "rgba(245,237,224,0.88)",
            fontSize: "clamp(14px, 1.6vw, 17px)",
            lineHeight: 1.6,
            maxWidth: "560px",
            margin: "14px auto 0",
            textShadow: "0 2px 14px rgba(0,0,0,0.7)",
          }}
        >
          Two objects, not twenty. A thrilling, minimal drop — curated by your stars, not a cluttered shelf.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "22px" }}>
          <a href="/shop" className="fbtn fbtn--ghost" style={{ backdropFilter: "blur(8px)", background: "rgba(8,10,16,0.46)" }}>
            Shop YOUNOYA
          </a>
          <a href="/personalise" className="fbtn">
            Build My Toolkit
          </a>
        </div>
        <p style={{ marginTop: "14px", fontFamily: "var(--yn-font-label)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,237,224,0.55)" }}>
          Astrology • Intention • Craft
        </p>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "22px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          color: "rgba(245,237,224,0.62)",
          fontFamily: "var(--yn-font-label)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        Scroll
        <span style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom, rgba(212,175,55,0.7), transparent)", display: "block" }} />
      </div>
    </section>
  )
}
