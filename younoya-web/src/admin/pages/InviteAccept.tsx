import { useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

const API = import.meta.env.VITE_API_URL || "https://api.younoya.com"

type InviteData = {
  email: string
  first_name?: string
  last_name?: string
  role?: string
  invite?: string
  exp?: number
}

function decode(t: string): (InviteData & { sig: string }) | null {
  const dot = t.lastIndexOf(".")
  if (dot < 0) return null
  try {
    return JSON.parse(atob(t.slice(0, dot).replace(/-/g, "+").replace(/_/g, "/")))
  } catch {
    return null
  }
}

export default function InviteAccept() {
  const t = new URLSearchParams(location.search).get("t") ?? ""
  const data = useMemo(() => decode(t), [t])
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState<"password" | "accept" | "done" | "error">("password")
  const [error, setError] = useState<string | null>(null)
  const registerTokenRef = useRef<string | null>(null)

  const expired = !data?.exp || data.exp < Date.now()

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!data?.invite || !data.email) return
    if (password.length < 8) {
      setError("Password needs at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("The two passwords don't match.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      // 1. Register auth identity with the invite token
      const res = await fetch(`${API}/auth/user/emailpass/register?invite_token=${encodeURIComponent(data.invite)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          first_name: data.first_name || "Team",
          last_name: data.last_name || "",
          password,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || "Could not set up the account. Ask for a fresh invite link.")
      }
      const { token } = await res.json()
      registerTokenRef.current = token

      // 2. Accept the invite (creates the user + links auth identity)
      const acceptRes = await fetch(`${API}/admin/invites/accept?token=${encodeURIComponent(data.invite)}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          first_name: data.first_name || "Team",
          last_name: data.last_name || "",
        }),
      })
      if (!acceptRes.ok) {
        const body = await acceptRes.json().catch(() => ({}))
        throw new Error(body?.message || "Could not accept the invite. Try a fresh link.")
      }

      // 3. Stamp our console role
      const fin = await fetch(`${API}/admin/team-finalize`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ t }),
      })
      if (!fin.ok) {
        const body = await fin.json().catch(() => ({}))
        throw new Error(body?.message || "Account created, but the role could not be set. Ask the owner to resend.")
      }

      setStep("done")
    } catch (err) {
      setStep("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-login">
      <div className="ad-login__inner ad-invite">
        <img className="ad-login__brand" src="/brand.webp" alt="Younoya" />
        {!data || expired ? (
          <>
            <h1>This link isn't valid</h1>
            <p className="ad-login__fine">
              Invite links expire after 7 days. Ask the store owner to send a fresh one.
            </p>
            <Link className="ad-btn-plain" to="/admin/login">Go to sign in</Link>
          </>
        ) : step === "password" ? (
          <>
            <p className="ad-login__eyebrow">Join the {data.role === "marketing" ? "Marketing" : "Support"} team</p>
            <h1>Choose your password</h1>
            <p className="ad-invite__who">
              for <strong>{data.email}</strong>
            </p>
            {error && <p className="ad-login__error">{error}</p>}
            <form onSubmit={submit} className="ad-login__form">
              <label className="ad-field"><span>Password</span>
                <input type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              <label className="ad-field"><span>Repeat password</span>
                <input type="password" autoComplete="new-password" placeholder="Same password again" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              </label>
              <button className="ad-btn" type="submit" disabled={busy || password.length < 8}>
                {busy ? "Setting up…" : "Create my account"}
              </button>
            </form>
          </>
        ) : step === "done" ? (
          <>
            <h1>You're all set, {data.first_name || "there"}!</h1>
            <p className="ad-login__fine">
              Your account is ready. Sign in with your email and the password you just chose.
            </p>
            <Link className="ad-btn-plain" to="/admin/login">Sign in now</Link>
          </>
        ) : (
          <>
            <h1>Something went wrong</h1>
            <p className="ad-login__fine">{error}</p>
            <Link className="ad-btn-plain" to="/admin/login">Try again</Link>
          </>
        )}
      </div>
    </div>
  )
}