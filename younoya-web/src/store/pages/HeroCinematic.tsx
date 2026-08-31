import { useEffect, useRef } from "react"

export default function HeroCinematic() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    ;(async () => {
      // @ts-ignore
      const mod: any = await import("../../lib/scrub-engine.js")
      const mount =
        mod.mountLetsScroll ||
        mod.default?.mountLetsScroll ||
        mod.default ||
        (typeof window !== "undefined" && (window as any).mountLetsScroll)
      if (typeof mount !== "function" || !ref.current) {
        console.warn("[HeroCinematic] scrub-engine mount not found", mod)
        return
      }
      cleanup = mount(ref.current, {
        brand: { name: "YOUNOYA" },
        diveScroll: 1.3,
        connScroll: 0.9,
        sections: [
          {
            id: "hero",
            label: "Hero",
            still: "/assets/story_poster.webp",
            stillMobile: "/assets/story_poster.webp",
            clip: "/assets/vid/story_10s.mp4",
            clipMobile: "/assets/vid/story_10s-m.mp4",
            scroll: 1.4,
            linger: 0.45,
            accent: "#D4AF37",
            eyebrow: "YOUNOYA",
            title: "Generic is easy. Personal is meaningful.",
            body: "Overload → intelligence → curated drop. 2 real products, not clutter.",
            tags: ["Itr", "Brooch", "Heavy Jewellery"],
          },
        ],
        connectors: [],
      })
    })()
    return () => { if (typeof cleanup === "function") cleanup() }
  }, [])

  return (
    <section id="younoya-hero" ref={ref} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "var(--yn-canvas)" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: 2, pointerEvents: "none", textAlign: "center", padding: "2rem" }}>
        <h1 className="text-display" style={{ color: "var(--yn-ink)", textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>Meaning, Made Personal.</h1>
        <p className="section__subtitle" style={{ color: "var(--yn-ink-soft)", maxWidth: 560, margin: "1rem auto 1.5rem" }}>2 objects, not 20. Thrilling drop, GenZ minimal.</p>
        <div style={{ pointerEvents: "auto", display: "flex", gap: "1rem" }}>
          <a href="/shop" className="fbtn fbtn--ghost">Shop YOUNOYA</a>
          <a href="/personalise" className="fbtn">Build My Toolkit</a>
        </div>
      </div>
    </section>
  )
}
