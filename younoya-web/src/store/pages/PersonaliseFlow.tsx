import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

export default function PersonaliseFlow() {
  const [step, setStep] = useState(1)
  const { customer, setLastResult, addToCart } = useStore()
  const navigate = useNavigate()

  // Form State
  const [target, setTarget] = useState("")
  const [intentions, setIntentions] = useState<string[]>([])
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [tob, setTob] = useState("")
  const [pob, setPob] = useState("")
  const [unknownTime, setUnknownTime] = useState(false)
  const [citySearch, setCitySearch] = useState("")
  const [cities, setCities] = useState<Array<{name: string, state: string}>>([])
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<api.RecommendResult | null>(null)
  const [giftMessage, setGiftMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (citySearch.length > 2) {
      const t = setTimeout(() => {
        api.searchCities(citySearch).then(setCities).catch(() => setCities([]))
      }, 500)
      return () => clearTimeout(t)
    } else {
      setCities([])
    }
  }, [citySearch])

  const toggleIntention = (i: string) => {
    setIntentions(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const handleCreateProfile = async () => {
    if (!customer) {
      setError("Please log in to save your profile and get recommendations.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const { profile } = await api.createProfile({
        full_name: fullName,
        relationship: target,
        is_self: target === "Myself",
        dob,
        tob: unknownTime ? null : tob,
        pob
      })
      
      const res = await api.recommend({
        profile_id: profile.id,
        occasion: intentions.join(", ")
      })
      setResult(res)
      setLastResult(res)
      setStep(4)
    } catch (e: any) {
      setError(e.message || "Failed to generate recommendation")
    } finally {
      setLoading(false)
    }
  }

  const handleAddAll = async () => {
    if (!result) return
    try {
      setLoading(true)
      if (result.main?.id) {
        // Find product to get variant id. Mocked here as we only have recommendation item ID.
        // In real scenario, recommend endpoint should return variant_id.
        // For now, let's assume item.id is product id and we fetch it.
        const p = await api.getProduct(result.main.handle)
        if (p?.variants?.[0]) await addToCart(p.variants[0].id)
      }
      for (const s of result.suggestions) {
        const p = await api.getProduct(s.handle)
        if (p?.variants?.[0]) await addToCart(p.variants[0].id)
      }
      setStep(5)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section" style={{ minHeight: "80vh", maxWidth: "800px", margin: "0 auto", padding: "4rem 1rem" }}>
      <div className="pflow__progress" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "3rem" }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`pflow__dot ${step >= i ? "active" : ""}`} style={{ width: "10px", height: "10px", borderRadius: "50%", background: step >= i ? "var(--color-gold)" : "var(--color-glass-border)" }} />
        ))}
      </div>

      {error && <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

      {step === 1 && (
        <div>
          <h2 className="section__title" style={{ textAlign: "center" }}>Who is this for?</h2>
          <div className="pflow__options" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
            {["Myself", "Partner", "Family", "Friend", "Colleague", "Other"].map(o => (
              <button key={o} className={`pflow__option glass-card ${target === o ? "selected" : ""}`} onClick={() => { setTarget(o); setStep(2); }} style={{ padding: "2rem", border: target === o ? "1px solid var(--color-gold)" : undefined }}>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="section__title" style={{ textAlign: "center" }}>What should it represent?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
            {["Love", "Appreciation", "New Beginning", "Success", "Growth", "Stability", "Good Wishes", "Personal Milestone"].map(o => (
              <div key={o} className="glass-card" style={{ padding: "1rem", cursor: "pointer", border: intentions.includes(o) ? "1px solid var(--color-gold)" : undefined }} onClick={() => toggleIntention(o)}>
                {o}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="cta-personal" onClick={() => setStep(3)} disabled={intentions.length === 0}>Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="section__title" style={{ textAlign: "center" }}>Birth Details</h2>
          <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: "0.5rem" }} />
            {fullName && <p>Hello, {fullName}!</p>}
            
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{ padding: "0.5rem" }} />
            
            <div>
              <input type="time" value={tob} onChange={e => setTob(e.target.value)} disabled={unknownTime} style={{ padding: "0.5rem", marginRight: "1rem" }} />
              <label><input type="checkbox" checked={unknownTime} onChange={e => setUnknownTime(e.target.checked)} /> I don't know the exact time</label>
            </div>

            <div>
              <input type="text" placeholder="Place of Birth" value={citySearch} onChange={e => { setCitySearch(e.target.value); setPob(e.target.value) }} style={{ padding: "0.5rem", width: "100%" }} />
              {cities.length > 0 && (
                <div className="glass-card" style={{ marginTop: "0.5rem", padding: "0.5rem" }}>
                  {cities.map(c => (
                    <div key={c.name+c.state} style={{ cursor: "pointer", padding: "0.5rem" }} onClick={() => { setPob(`${c.name}, ${c.state}`); setCitySearch(`${c.name}, ${c.state}`); setCities([]) }}>
                      {c.name}, {c.state}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="cta-personal" onClick={handleCreateProfile} disabled={!fullName || !dob || !pob || loading} style={{ marginTop: "1rem" }}>
              {loading ? "Aligning Stars..." : "Generate Toolkit"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div>
          <h2 className="section__title" style={{ textAlign: "center" }}>Your Personalised Toolkit</h2>
          <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
            <h3 className="text-h2">{result.subject.full_name}'s Profile</h3>
            <p>Sun: {result.subject.sun_sign} | Moon: {result.subject.moon_sign}</p>
            {result.synergy_note && <p className="text-editorial" style={{ marginTop: "1rem" }}>{result.synergy_note}</p>}
          </div>

          {result.main && (
            <div className="product-card glass-card" style={{ display: "flex", padding: "2rem", gap: "2rem", marginBottom: "2rem" }}>
              {result.main.thumbnail && <img src={result.main.thumbnail} alt={result.main.title} style={{ width: "200px", objectFit: "cover" }} />}
              <div>
                <span className="section__label">Primary Object</span>
                <h3 className="text-h1">{result.main.title}</h3>
                <p>₹{result.main.price}</p>
                <ul style={{ marginTop: "1rem" }}>
                  {result.main.reasons.map((r,i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div>
              <h3 className="section__title">Supporting Objects</h3>
              <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {result.suggestions.map(s => (
                  <div key={s.id} className="product-card glass-card">
                    {s.thumbnail && <img src={s.thumbnail} alt={s.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
                    <div style={{ padding: "1rem" }}>
                      <h4>{s.title}</h4>
                      <p>₹{s.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button className="cta-personal" onClick={handleAddAll} disabled={loading}>
              {loading ? "Adding..." : "Add All to Cart"}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div style={{ textAlign: "center" }}>
          <h2 className="section__title">Add a Gift Message (Optional)</h2>
          <textarea className="glass-card" style={{ width: "100%", height: "150px", padding: "1rem", marginTop: "1rem", background: "transparent", color: "inherit" }} value={giftMessage} onChange={e => setGiftMessage(e.target.value)} placeholder="Write something nice..." />
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <button className="cta-outline" onClick={() => navigate("/cart")}>Skip</button>
            <button className="cta-personal" onClick={() => navigate("/cart")}>Save & Continue</button>
          </div>
        </div>
      )}
    </div>
  )
}
