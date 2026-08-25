import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"
import * as api from "../../lib/api"
import { useStore } from "../../lib/store"
import FluidCard from "../components/FluidCard"
import Field from "../components/Field"
import OtpInput from "../components/OtpInput"
import FluidButton from "../components/FluidButton"
import Toggle from "../components/Toggle"

type Step = 1 | 2 | 3 | 4

const RELATIONSHIPS = [
  "self", "brother", "sister", "spouse", "mother", "father",
  "son", "daughter", "friend", "bhabhi",
]

const OCCASIONS = [
  "birthday", "rakhi", "anniversary", "wedding",
  "housewarming", "diwali", "protection", "prosperity", "new-beginnings",
]

const STEP_META: Record<Step, { name: string; title: string }> = {
  1: { name: "Entry", title: "Enter with your number" },
  2: { name: "Details", title: "Your sky, read precisely" },
  3: { name: "Intent", title: "Who is this gift for?" },
  4: { name: "Their sky", title: "Their sky, their blessing" },
}

type City = { name: string; state: string }

/** Frosted city autocomplete with keyboard navigation. */
function CitySelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [list, setList] = useState<City[]>([])
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(-1)
  const box = useRef<HTMLDivElement>(null)
  const closeTimer = useRef(0)

  useEffect(() => {
    if (value.trim().length < 2 || !open) return setList([])
    const id = window.setTimeout(() => {
      api.searchCities(value).then(setList).catch(() => setList([]))
    }, 160)
    return () => window.clearTimeout(id)
  }, [value, open])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const pick = (c: City) => {
    onChange(`${c.name}, ${c.state}`)
    setOpen(false)
    setIdx(-1)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || list.length === 0) return
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => (i + 1) % list.length) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => (i - 1 + list.length) % list.length) }
    else if (e.key === "Enter" && idx >= 0) { e.preventDefault(); pick(list[idx]) }
    else if (e.key === "Escape") setOpen(false)
  }

  return (
    <div className="city2" ref={box} onKeyDown={onKey}>
      <Field label={label} filled={value.length > 0}>
        <input
          placeholder="Start typing a city…"
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); setIdx(-1) }}
          onFocus={() => { window.clearTimeout(closeTimer.current); setOpen(true) }}
          onBlur={() => { closeTimer.current = window.setTimeout(() => setOpen(false), 140) }}
          autoComplete="off"
        />
      </Field>
      {open && list.length > 0 && (
        <ul className="city2__list" role="listbox">
          {list.map((c, i) => (
            <li key={`${c.name}-${c.state}`}>
              <button
                type="button"
                className={i === idx ? "on" : ""}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(c)}
                onMouseEnter={() => setIdx(i)}
              >
                <strong>{c.name}</strong> · {c.state}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Gold particle shimmer — burst between steps. */
function shimmer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const w = (canvas.width = canvas.offsetWidth * dpr)
  const h = (canvas.height = canvas.offsetHeight * dpr)
  const N = 40
  const parts = Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: h * (0.35 + Math.random() * 0.5),
    vx: (Math.random() - 0.5) * 0.7 * dpr,
    vy: (-0.5 - Math.random()) * dpr,
    r: (Math.random() * 1.6 + 0.4) * dpr,
    a: Math.random() * Math.PI * 2,
    life: 1,
  }))
  let raf = 0
  const tick = () => {
    ctx.clearRect(0, 0, w, h)
    let alive = false
    for (const p of parts) {
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.016
      p.a += 0.08
      if (p.life > 0) {
        alive = true
        const tw = 0.55 + 0.45 * Math.sin(p.a)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,175,55,${(p.life * tw).toFixed(3)})`
        ctx.fill()
      }
    }
    if (alive) raf = requestAnimationFrame(tick)
    else ctx.clearRect(0, 0, w, h)
  }
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
}

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

  const myProfileId = useRef<string | null>(null)
  const pendingCustomer = useRef(false)

  // ---- step transition machinery -------------------------------------------
  const deckRef = useRef<HTMLDivElement>(null)
  const cardHostRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dirRef = useRef(1)

  function goStep(next: Step) {
    if (next === step) return
    dirRef.current = next > step ? 1 : -1
    setStep(next)
  }

  // entry animation on every step change (card blooms in, fields cascade)
  useLayoutEffect(() => {
    const host = cardHostRef.current
    if (!host) return
    const card = host.querySelector("[data-fc]") as HTMLElement | null
    const fields = host.querySelectorAll(".ff__control, .choice2, .fbtn")
    gsap.set(host, { height: "auto" })
    const h = host.offsetHeight
    gsap.fromTo(
      host,
      { height: 0 },
      { height: h, duration: 0.48, ease: "expo.out", clearProps: "height" },
    )
    if (card) {
      const d = dirRef.current
      gsap.fromTo(
        card,
        { y: 34 * d, scale: 1.03, opacity: 0, filter: "blur(10px)" },
        { y: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "expo.out" },
      )
    }
    gsap.fromTo(
      fields,
      { y: 18, opacity: 0, filter: "blur(6px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, stagger: 0.055, ease: "expo.out", delay: 0.08 },
    )
    if (canvasRef.current) shimmer(canvasRef.current)
  }, [step])

  // title crossfade
  useLayoutEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 14, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "expo.out" },
      )
    }
  }, [step])

  // returning users re-enter where they belong:
  // logged in + has self chart → recipient choice; logged in without chart → their details
  useEffect(() => {
    if (!customer || pendingCustomer.current) return
    if (step !== 1) return
    const self = profiles.find((p) => p.is_self)
    if (self) {
      myProfileId.current = self.id
      goStep(3)
    } else if (profiles.length === 0) {
      goStep(2)
    }
  }, [customer, profiles, step])

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

  async function verify(codeArg?: string) {
    const code = codeArg ?? otp
    if (code.trim().length < 4) return
    setError(null)
    setBusy(true)
    try {
      const { ticket } = await api.verifyOtp(phone, code)
      await api.exchangeTicket(ticket)
      const me = await api.getCustomer()
      if (!me?.customer) {
        pendingCustomer.current = true
        await api.createCustomer({
          email: `${phone.replace("+91", "")}@phone.younoya.in`,
          first_name: fullName || "Friend",
          phone,
        })
        pendingCustomer.current = false
      }
      await refreshCustomer()
      goStep(2)
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
      goStep(3)
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

  const meta = STEP_META[step]

  return (
    <div className="journey jx">
      {/* cosmos backdrop */}
      <div className="jx__cosmos" aria-hidden="true">
        <span className="jx__glow" />
        <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <canvas ref={canvasRef} className="jx__shimmer" aria-hidden="true" />

      <header className="journey__head jx__head">
        <p className="journey__eyebrow">Begin your journey</p>
        <h1 className="journey__title" ref={titleRef}>{meta.title}</h1>
        <div className="jprog" aria-label={`Step ${step} of 4`}>
          <span className="jprog__num">{`0${step}`}</span>
          <span className="jprog__of">/ 04</span>
          <span className="jprog__name">{meta.name}</span>
          <span className="jprog__line">
            <span className="jprog__fill" style={{ transform: `scaleX(${step / 4})` }} />
            <span className="jprog__dot" style={{ left: `${(step / 4) * 100}%` }} />
          </span>
        </div>
      </header>

      {error && <p className="journey__error">{error}</p>}

      <div className="jx__deck" ref={deckRef}>
        <div className="jx__host" ref={cardHostRef}>
          <FluidCard active>
            {step === 1 && (
              <>
                {!otpSent ? (
                  <>
                    <Field label="Mobile number" filled={phone.length > 0}>
                      <input
                        inputMode="tel"
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Field>
                    <FluidButton disabled={phone.replace(/\D/g, "").length < 10} loading={busy} onClick={sendOtp}>
                      Send code
                    </FluidButton>
                  </>
                ) : (
                  <>
                    <OtpInput value={otp} onChange={setOtp} onComplete={(c) => verify(c)} success={false} disabled={busy} />
                    <Field label="Your name" filled={fullName.length > 0}>
                      <input placeholder="For the sankalpa" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </Field>
                    {mockHint && <p className="journey__hint">{mockHint}</p>}
                    <FluidButton loading={busy} onClick={() => verify()}>
                      Verify &amp; enter
                    </FluidButton>
                    <button
                      className="linkish"
                      onClick={() => { setOtpSent(false); setOtp("") }}
                    >
                      Change number
                    </button>
                  </>
                )}
                <p className="journey__fine">No passwords. Your number is your key to the vault.</p>
              </>
            )}

            {step === 2 && (
              <>
                <Field label="Date of birth" filled={dob.length > 0} alwaysFloat valid={dob.length > 0}>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </Field>
                <div className="ff-row">
                  <Field label="Time of birth" alwaysFloat filled={tob.length > 0}>
                    <input type="time" value={tob} disabled={tobUnknown} onChange={(e) => setTob(e.target.value)} />
                  </Field>
                  <Toggle checked={tobUnknown} onChange={(v) => { setTobUnknown(v); if (v) setTob("") }} label="Don't know" />
                </div>
                <CitySelect label="Place of birth" value={pob} onChange={setPob} />
                <FluidButton disabled={!dob || !pob} loading={busy} onClick={saveMyDetails}>
                  Cast my chart
                </FluidButton>
              </>
            )}

            {step === 3 && (
              <>
                <button
                  className={`choice2${gifting === false ? " choice2--on" : ""}`}
                  onClick={() => setGifting(false)}
                >
                  <span className="choice2__num">I</span>
                  <em>For myself</em>
                  <small>The reading answers my own sky</small>
                  <svg className="choice2__check" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" strokeWidth="1.5" />
                    <path d="M7 12.5 10.5 16 17 8.5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  className={`choice2${gifting === true ? " choice2--on" : ""}`}
                  onClick={() => setGifting(true)}
                >
                  <span className="choice2__num">II</span>
                  <em>For someone else</em>
                  <small>Their stars decide the gift</small>
                  <svg className="choice2__check" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" strokeWidth="1.5" />
                    <path d="M7 12.5 10.5 16 17 8.5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <Field label="Occasion" alwaysFloat filled>
                  <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>{o.replace("-", " ")}</option>
                    ))}
                  </select>
                </Field>
                <FluidButton
                  disabled={gifting === null}
                  loading={busy && gifting === false}
                  onClick={() => (gifting ? goStep(4) : saveRecipientAndExplore())}
                >
                  {gifting ? "Their details →" : "Reveal my gift"}
                </FluidButton>
              </>
            )}

            {step === 4 && (
              <>
                <Field label="Their name" filled={rName.length > 0} valid={rName.length > 2}>
                  <input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="Spoken in the sankalpa" />
                </Field>
                <Field label="They are my…" alwaysFloat filled>
                  <select value={rRel} onChange={(e) => setRRel(e.target.value)}>
                    {RELATIONSHIPS.filter((r) => r !== "self").map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Their date of birth" alwaysFloat filled={rDob.length > 0} valid={rDob.length > 0}>
                  <input type="date" value={rDob} onChange={(e) => setRDob(e.target.value)} />
                </Field>
                <div className="ff-row">
                  <Field label="Time of birth" alwaysFloat filled={rTob.length > 0}>
                    <input type="time" value={rTob} disabled={rTobUnknown} onChange={(e) => setRTob(e.target.value)} />
                  </Field>
                  <Toggle checked={rTobUnknown} onChange={(v) => { setRTobUnknown(v); if (v) setRTob("") }} label="Don't know" />
                </div>
                <CitySelect label="Place of birth" value={rPob} onChange={setRPob} />
                <FluidButton disabled={!rName || !rDob || !rPob} loading={busy} onClick={saveRecipientAndExplore}>
                  Reveal their gift
                </FluidButton>
              </>
            )}
          </FluidCard>
        </div>
      </div>
    </div>
  )
}
