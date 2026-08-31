import { useState } from "react"
import { login, type Me } from "../api"
import FluidCard from "../../store/components/FluidCard"
import Field from "../../store/components/Field"
import FluidButton from "../../store/components/FluidButton"

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
      <FluidCard>
        <div className="ad-login__inner">
          <img className="ad-login__brand" src="/brand.webp" alt="Younoya" />
          <p className="ad-login__eyebrow">Younoya Console</p>
          <h1>Good to see you</h1>
          {error && <p className="ad-login__error">{error}</p>}
          <form onSubmit={submit} className="ad-login__form">
            <Field label="Email" filled={email.length > 0}>
              <input
                type="email"
                autoComplete="username"
                placeholder="you@younoya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" filled={password.length > 0}>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <FluidButton type="submit" loading={busy} disabled={!email || !password}>
              Sign in
            </FluidButton>
          </form>
          <p className="ad-login__fine">Only for the Younoya team. Customers don't need an account to shop.</p>
        </div>
      </FluidCard>
    </div>
  )
}
