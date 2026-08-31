import { Link } from "react-router"

export default function About() {
  return (
    <div className="section" style={{ padding: "4rem 1rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span className="section__label">About</span>
        <h1 className="section__title text-display">About YOUNOYA</h1>
      </div>

      <div className="text-body-lg" style={{ display: "flex", flexDirection: "column", gap: "2rem", fontSize: "1.125rem", lineHeight: "1.8" }}>
        <p className="text-body">
          YOUNOYA was born from a simple belief: the objects we surround ourselves with should do more than just exist—they should empower us. We are an intentionally curated gifting platform blending ancient wisdom with modern aesthetics.
        </p>

        <p className="text-body">
          Our name represents the harmony of you and the universe. We use astrological insights not as a rigid rulebook, but as a map to help you discover tools that resonate with your current life phase, intentions, and inner self.
        </p>
        
        <p className="text-body">
          Whether you're seeking clarity, inviting love, or looking for the perfect meaningful gift for someone special, we curate high-quality, sustainably sourced objects that serve as tangible anchors for your highest aspirations.
        </p>

        <div className="glass-card" style={{ padding: "3rem", textAlign: "center", marginTop: "2rem" }}>
          <h2 className="text-editorial" style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>"Meaning, Made Personal."</h2>
          <Link to="/personalise" className="cta-personal">Discover Your Cosmic Toolkit</Link>
        </div>
      </div>
    </div>
  )
}
