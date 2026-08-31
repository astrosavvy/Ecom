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
          filter: "brightness(0.98) saturate(1.02) contrast(1.02)",
        }}
      />
      {/* Light scrim — barely there, just bottom legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 52%, rgba(7,8,14,0.22) 85%, rgba(7,8,14,0.38) 100%)",
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
        <h1
          className="text-display"
          style={{
            color: "#fff",
            fontFamily: "var(--yn-font-display)",
            fontWeight: 440,
            fontSize: "clamp(36px, 5.8vw, 62px)",
            lineHeight: 0.97,
            letterSpacing: "-0.02em",
            textShadow: "0 1px 18px rgba(0,0,0,0.38), 0 6px 32px rgba(0,0,0,0.32)",
            margin: 0,
          }}
        >
          Meaning, <em style={{ fontStyle: "italic", fontWeight: 440, color: "#FFE9A3", textShadow: "0 1px 12px rgba(0,0,0,0.22)" }}>made personal.</em>
        </h1>
        <p
          className="section__subtitle"
          style={{
            color: "rgba(255,255,255,0.92)",
            fontSize: "clamp(14px, 1.45vw, 16px)",
            lineHeight: 1.55,
            maxWidth: "520px",
            margin: "12px auto 0",
            textShadow: "0 1px 10px rgba(0,0,0,0.45)",
            fontWeight: 400,
          }}
        >
          Curated by your stars — not the shelf.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
          <a href="/shop" className="fbtn" style={{ background: "var(--yn-gold)", color: "#1a1a1e" }}>
            Shop YOUNOYA
          </a>
        </div>
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
