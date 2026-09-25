import { useState } from "react"
import { login, type Me } from "../api"

export default function Login({ onDone }: { onDone: (me: Me) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email || !password) return
    setBusy(true)
    setError(null)
    try {
      onDone(await login(email, password))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-login">
      <div className="fc" style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(212,175,55,0.2)", boxShadow: "0 12px 36px -12px rgba(0,0,0,0.08)", padding: "28px 24px", maxWidth: "440px", width: "100%" }}>
        <div className="ad-login__inner">
          <img className="ad-login__brand" src="/brand.webp" alt="Younoya" />
          <p className="ad-login__eyebrow">Younoya Console</p>
          <h1>Good to see you</h1>
          {error && <p className="ad-login__error">{error}</p>}
          <form onSubmit={submit} className="ad-login__form">
            <div className="ad-field">
              <span>Email</span>
              <input
                type="email"
                autoComplete="username"
                placeholder="you@younoya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="ad-field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="ad-btn" disabled={busy || !email || !password} style={{ width: "100%", marginTop: "8px" }}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="ad-login__fine">Only for the Younoya team. Customers don't need an account to shop.</p>
        </div>
      </div>
    </div>
  )
}

