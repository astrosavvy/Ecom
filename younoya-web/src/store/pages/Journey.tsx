import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"

type Step = 1 | 2 | 3 | 4

const RELATIONSHIPS = [
  "self", "brother", "sister", "spouse", "mother", "father",
  "son", "daughter", "friend", "bhabhi",
]

const OCCASIONS = [
  "birthday", "rakhi", "anniversary", "wedding",
  "housewarming", "diwali", "protection", "prosperity", "new-beginnings",
]

export default function Journey() {
  const nav = useNavigate()
  const { customer, profiles, refreshCustomer, refreshProfiles, setLastResult } = useStore()
  const [step, setStep] = useState<Step>(customer ? 2 : 1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // step 1 — mobile login
  const [phone, setPhone] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [mockHint, setMockHint] = useState<string | null>(null)
  const [otp, setOtp] = useState("")
  const [fullName, setFullName] = useState("")

  // step 2 — your astro details
  const [dob, setDob] = useState("")
  const [tob, setTob] = useState("")
  const [tobUnknown, setTobUnknown] = useState(false)
  const [pob, setPob] = useState("")
  const [cityList, setCityList] = useState<Array<{ name: string; state: string }>>([])
  const [showCities, setShowCities] = useState(false)

  // step 3 — who is it for
  const [gifting, setGifting] = useState<boolean | null>(null)
  const [occasion, setOccasion] = useState("birthday")

  // step 4 — recipient details
  const [rName, setRName] = useState("")
  const [rRel, setRRel] = useState("brother")
  const [rDob, setRDob] = useState("")
  const [rTob, setRTob] = useState("")
  const [rTobUnknown, setRTobUnknown] = useState(false)
  const [rPob, setRPob] = useState("")
  const [rCityList, setRCityList] = useState<Array<{ name: string; state: string }>>([])
  const [rShowCities, setRShowCities] = useState(false)

  const myProfileId = useRef<string | null>(null)
  const pendingCustomer = useRef(false)

  // returning users re-enter where they belong:
  // logged in + has self chart → recipient choice; logged in without chart → their details
  useEffect(() => {
    if (!customer || pendingCustomer.current) return
    if (step !== 1) return
    const self = profiles.find((p) => p.is_self)
    if (self) {
      myProfileId.current = self.id
      setStep(3)
    } else if (profiles.length === 0) {
      setStep(2)
    }
  }, [customer, profiles, step])

  // city autocomplete
  useEffect(() => {
    if (step === 2 && pob.trim().length >= 2 && showCities) {
      const id = window.setTimeout(() => {
        api.searchCities(pob).then(setCityList).catch(() => setCityList([]))
      }, 180)
      return () => window.clearTimeout(id)
    }
  }, [pob, showCities, step])

  useEffect(() => {
    if (step === 4 && rPob.trim().length >= 2 && rShowCities) {
      const id = window.setTimeout(() => {
        api.searchCities(rPob).then(setRCityList).catch(() => setRCityList([]))
      }, 180)
      return () => window.clearTimeout(id)
    }
  }, [rPob, rShowCities, step])

  async function sendOtp() {
    setError(null)
    setBusy(true)
    try {
      const r = await api.requestOtp(phone)
      setOtpSent(true)
      if (r.mock_otp) {
        setMockHint(`Dev mode — use code ${r.mock_otp}`)
        setOtp(r.mock_otp)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send code")
    } finally {
      setBusy(false)
    }
  }

  async function verify() {
    setError(null)
    setBusy(true)
    try {
      const { ticket } = await api.verifyOtp(phone, otp)
      await api.exchangeTicket(ticket)
      const me = await api.getCustomer()
      if (!me?.customer) {
        // first login — create customer record with the name
        pendingCustomer.current = true
        await api.createCustomer({
          email: `${phone.replace("+91", "")}@phone.younoya.in`,
          first_name: fullName || "Friend",
          phone,
        })
        pendingCustomer.current = false
      }
      await refreshCustomer()
      setStep(2)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code")
    } finally {
      setBusy(false)
    }
  }

  async function saveMyDetails() {
    setError(null)
    setBusy(true)
    try {
      const { profile } = await api.createProfile({
        full_name: fullName || customer?.first_name || "Me",
        relationship: "self",
        is_self: true,
        phone,
        dob,
        tob: tobUnknown ? null : (tob || null),
        pob,
      })
      myProfileId.current = profile.id
      await refreshProfiles()
      setStep(3)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save details")
    } finally {
      setBusy(false)
    }
  }

  async function saveRecipientAndExplore() {
    setError(null)
    setBusy(true)
    try {
      let recipientId: string | null = null
      if (gifting) {
        const { profile } = await api.createProfile({
          full_name: rName,
          relationship: rRel,
          is_self: false,
          dob: rDob,
          tob: rTobUnknown ? null : rTob || null,
          pob: rPob,
        })
        recipientId = profile.id
      }
      const result = await api.recommend({
        profile_id: (gifting ? recipientId : myProfileId.current)!,
        sender_profile_id: gifting ? myProfileId.current || undefined : undefined,
        occasion,
      })
      setLastResult(result)
      nav("/explore")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read the sky")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="journey">
      <header className="journey__head">
        <p className="journey__eyebrow">Begin your journey</p>
        <h1 className="journey__title">
          {step === 1 && "Enter with your number"}
          {step === 2 && "Your sky, read precisely"}
          {step === 3 && "Who is this gift for?"}
          {step === 4 && "Their sky, their blessing"}
        </h1>
        <div className="journey__steps" aria-hidden="true">
          {[1, 2, 3, 4].map((s) => (
            <span key={s} className={s === step ? "on" : s < step ? "done" : ""} />
          ))}
        </div>
      </header>

      {error && <p className="journey__error">{error}</p>}

      {step === 1 && (
        <section className="tile">
          <label className="field">
            <span>Mobile number</span>
            <input
              inputMode="tel"
              placeholder="98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
            />
          </label>
          {!otpSent ? (
            <button className="btn" disabled={busy || phone.replace(/\D/g, "").length < 10} onClick={sendOtp}>
              {busy ? "Sending…" : "Send code"}
            </button>
          ) : (
            <>
              <label className="field">
                <span>6-digit code</span>
                <input inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
              </label>
              <label className="field">
                <span>Your name</span>
                <input placeholder="For the sankalpa" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>
              {mockHint && <p className="journey__hint">{mockHint}</p>}
              <button className="btn" disabled={busy || otp.trim().length < 4} onClick={verify}>
                {busy ? "Verifying…" : "Verify & enter"}
              </button>
              <button className="linkish" onClick={() => { setOtpSent(false); setOtp("") }}>Change number</button>
            </>
          )}
          <p className="journey__fine">No passwords. Your number is your key to the vault.</p>
        </section>
      )}

      {step === 2 && (
        <section className="tile">
          <label className="field">
            <span>Date of birth</span>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Time of birth</span>
              <input type="time" value={tob} disabled={tobUnknown} onChange={(e) => setTob(e.target.value)} />
            </label>
            <label className="check">
              <input type="checkbox" checked={tobUnknown} onChange={(e) => setTobUnknown(e.target.checked)} />
              <span>I don't know</span>
            </label>
          </div>
          <div className="field city">
            <span>Place of birth</span>
            <input
              placeholder="Start typing a city…"
              value={pob}
              onChange={(e) => { setPob(e.target.value); setShowCities(true) }}
              onFocus={() => setShowCities(true)}
              onBlur={() => window.setTimeout(() => setShowCities(false), 150)}
            />
            {showCities && cityList.length > 0 && (
              <ul className="city__list">
                {cityList.map((c) => (
                  <li key={`${c.name}-${c.state}`}>
                    <button type="button" onMouseDown={() => { setPob(`${c.name}, ${c.state}`); setShowCities(false) }}>
                      <strong>{c.name}</strong> · {c.state}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="btn" disabled={busy || !dob || !pob} onClick={saveMyDetails}>
            {busy ? "Reading the sky…" : "Cast my chart"}
          </button>
        </section>
      )}

      {step === 3 && (
        <section className="tile tile--choice">
          <button
            className={`choice${gifting === false ? " choice--on" : ""}`}
            onClick={() => setGifting(false)}
          >
            <em>For myself</em>
            <span>The reading answers my own sky</span>
          </button>
          <button
            className={`choice${gifting === true ? " choice--on" : ""}`}
            onClick={() => setGifting(true)}
          >
            <em>For someone else</em>
            <span>Their stars decide the gift</span>
          </button>
          <label className="field">
            <span>Occasion</span>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>{o.replace("-", " ")}</option>
              ))}
            </select>
          </label>
          <button className="btn" disabled={gifting === null} onClick={() => (gifting ? setStep(4) : saveRecipientAndExplore())}>
            {gifting ? "Their details →" : "Reveal my gift"}
          </button>
        </section>
      )}

      {step === 4 && (
        <section className="tile">
          <label className="field">
            <span>Their name</span>
            <input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Spoken in the sankalpa" />
          </label>
          <label className="field">
            <span>They are my…</span>
            <select value={rRel} onChange={(e) => setRRel(e.target.value)}>
              {RELATIONSHIPS.filter((r) => r !== "self").map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Their date of birth</span>
            <input type="date" value={rDob} onChange={(e) => setRDob(e.target.value)} />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Time of birth</span>
              <input type="time" value={rTob} disabled={rTobUnknown} onChange={(e) => setRTob(e.target.value)} />
            </label>
            <label className="check">
              <input type="checkbox" checked={rTobUnknown} onChange={(e) => setRTobUnknown(e.target.checked)} />
              <span>Don't know</span>
            </label>
          </div>
          <div className="field city">
            <span>Place of birth</span>
            <input
              placeholder="Start typing a city…"
              value={rPob}
              onChange={(e) => { setRPob(e.target.value); setRShowCities(true) }}
              onFocus={() => setRShowCities(true)}
              onBlur={() => window.setTimeout(() => setRShowCities(false), 150)}
            />
            {rShowCities && rCityList.length > 0 && (
              <ul className="city__list">
                {rCityList.map((c) => (
                  <li key={`${c.name}-${c.state}`}>
                    <button type="button" onMouseDown={() => { setRPob(`${c.name}, ${c.state}`); setRShowCities(false) }}>
                      <strong>{c.name}</strong> · {c.state}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="btn" disabled={busy || !rName || !rDob || !rPob} onClick={saveRecipientAndExplore}>
            {busy ? "Reading their sky…" : "Reveal their gift"}
          </button>
        </section>
      )}
    </div>
  )
}
