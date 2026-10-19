import React, { useState, useEffect } from "react"
import { requestOtpCode, loginWithOtp, type Me, type ContactInput } from "../api"

export default function Login({ onDone }: { onDone: (me: Me) => void }) {
  const [identifier, setIdentifier] = useState("")
  const [step, setStep] = useState<"contact" | "otp">("contact")
  const [otp, setOtp] = useState("")
  const [challengeId, setChallengeId] = useState<string | undefined>(undefined)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)

  // Countdown ticker for OTP resend cooldown
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => {
      setResendTimer((t) => (t > 0 ? t - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  function parseContact(raw: string): ContactInput {
    const trimmed = raw.trim()
    if (trimmed.includes("@")) {
      return { email: trimmed.toLowerCase(), channel: "email" }
    }
    // Clean digits for Indian mobile numbers (+91 standard)
    const digits = trimmed.replace(/\D/g, "")
    const mobile = digits.length === 10 ? `+91${digits}` : digits.startsWith("91") && digits.length === 12 ? `+${digits}` : trimmed
    return { phone: mobile, channel: "whatsapp" }
  }

  async function handleRequestCode(e?: React.FormEvent) {
    e?.preventDefault()
    if (!identifier.trim()) return
    setBusy(true)
    setError(null)
    try {
      const contact = parseContact(identifier)
      const res = await requestOtpCode(contact)
      setChallengeId(res.challenge_id)
      setStep("otp")
      setResendTimer(60)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send verification code. Please check your email or phone.")
    } finally {
      setBusy(false)
    }
  }

  async function handleVerify(e?: React.FormEvent) {
    e?.preventDefault()
    if (!otp.trim()) return
    setBusy(true)
    setError(null)
    try {
      const contact = parseContact(identifier)
      const me = await loginWithOtp(contact, otp.trim(), challengeId)
      onDone(me)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired verification code.")
    } finally {
      setBusy(false)
    }
  }

  function handleResend() {
    if (resendTimer > 0 || busy) return
    handleRequestCode()
  }

  return (
    <div className="ad-login">
      <div 
        className="fc" 
        style={{ 
          background: "#FFFFFF", 
          borderRadius: "20px", 
          border: "1px solid rgba(212, 175, 55, 0.25)", 
          boxShadow: "0 12px 36px -12px rgba(0,0,0,0.08)", 
          padding: "32px 28px", 
          maxWidth: "440px", 
          width: "100%" 
        }}
      >
        <div className="ad-login__inner">
          <img className="ad-login__brand" src="/brand.webp" alt="YOUNOYA" />
          <p className="ad-login__eyebrow">Younoya Console</p>
          <h1>Good to see you</h1>
          
          {error && <p className="ad-login__error">{error}</p>}

          {step === "contact" ? (
            <form onSubmit={handleRequestCode} className="ad-login__form">
              <div className="ad-field">
                <span>Email or Mobile Number</span>
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="name@younoya.com or +91 98765 43210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={busy}
                  autoFocus
                />
              </div>

              <button 
                type="submit" 
                className="ad-btn" 
                disabled={busy || !identifier.trim()} 
                style={{ width: "100%", marginTop: "12px" }}
              >
                {busy ? "Sending Code…" : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="ad-login__form">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "13px", color: "#7A6F62" }}>
                <span>Code sent to <strong>{identifier}</strong></span>
                <button
                  type="button"
                  onClick={() => { setStep("contact"); setError(null); setOtp("") }}
                  style={{ background: "none", border: "none", color: "#8C6A24", cursor: "pointer", textDecoration: "underline", fontSize: "12px", padding: 0 }}
                >
                  Change
                </button>
              </div>

              <div className="ad-field">
                <span>Six-Digit Code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  disabled={busy}
                  style={{ letterSpacing: "8px", fontSize: "20px", textAlign: "center", fontWeight: "600" }}
                  autoFocus
                />
              </div>

              <button 
                type="submit" 
                className="ad-btn" 
                disabled={busy || otp.length < 6} 
                style={{ width: "100%", marginTop: "12px" }}
              >
                {busy ? "Verifying…" : "Sign In to Console"}
              </button>

              <div style={{ textAlign: "center", marginTop: "14px" }}>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || busy}
                  style={{
                    background: "none",
                    border: "none",
                    color: resendTimer > 0 ? "#A39688" : "#8C6A24",
                    cursor: resendTimer > 0 ? "default" : "pointer",
                    fontSize: "12.5px",
                    fontWeight: "500",
                  }}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend verification code"}
                </button>
              </div>
            </form>
          )}

          <p className="ad-login__fine">Only for the Younoya team. Customers don't need an account to shop.</p>
        </div>
      </div>
    </div>
  )
}
