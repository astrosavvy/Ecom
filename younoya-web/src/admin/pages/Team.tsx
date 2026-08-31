import { useEffect, useState } from "react"
import { api, fmtDate } from "../api"

type Member = { id: string; email: string; first_name?: string; last_name?: string; role: string; created_at: string }

const ROLE_LABEL: Record<string, string> = {
  admin: "Owner",
  support: "Support",
  marketing: "Marketing",
}

export default function Team() {
  const [members, setMembers] = useState<Member[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("support")
  const [inviteBusy, setInviteBusy] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  function load() {
    setBusy(true)
    api("/admin/team")
      .then((d: any) => setMembers(d.members ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load the team."))
      .finally(() => setBusy(false))
  }
  useEffect(load, [])

  async function invite(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email.includes("@")) return
    setInviteBusy(true)
    setError(null)
    try {
      const d = await api<{ link: string }>("/admin/team", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), first_name: name.trim(), role }),
      })
      setInviteLink(d.link)
      setAdding(false)
      setEmail("")
      setName("")
      setRole("support")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the invite.")
    } finally {
      setInviteBusy(false)
    }
  }

  async function removeMember(m: Member) {
    if (!confirm(`Remove ${m.email} from the team? They will lose access immediately.`)) return
    setRemoving(m.id)
    try {
      await api(`/admin/team/${m.id}`, { method: "DELETE" })
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove this member.")
    } finally {
      setRemoving(null)
    }
  }

  async function copyLink() {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="ad__page">
      <header className="ad__head ad__head--row">
        <div>
          <h1>Team</h1>
          <p>People who can open the console, and what each one can do.</p>
        </div>
        <button className="ad-btn" onClick={() => { setAdding(!adding); setInviteLink(null) }}>+ Add team member</button>
      </header>
      {error && <p className="ad-error">{error}</p>}

      {adding && (
        <form className="ad-card ad-invite-form" onSubmit={invite}>
          <h2>New team member</h2>
          <div className="ad-invite-form__row">
            <label className="ad-field"><span>Name</span>
              <input placeholder="Priya" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="ad-field"><span>Email</span>
              <input type="email" placeholder="priya@younoya.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="ad-field"><span>Role</span>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="support">Support — view orders & customers</option>
                <option value="marketing">Marketing — write the Journal</option>
              </select>
            </label>
          </div>
          <div className="ad-actions">
            <button className="ad-btn" type="submit" disabled={inviteBusy || !email.includes("@")}>
              {inviteBusy ? "Creating…" : "Create invite link"}
            </button>
            <button className="ad-btn-plain" type="button" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      {inviteLink && (
        <div className="ad-card ad-invite-done">
          <h2>Invite ready</h2>
          <p>
            Share this link with your new team member — they open it, choose a password, and get access.
            The link works for 7 days.
          </p>
          <div className="ad-invite-done__row">
            <input readOnly value={inviteLink} onFocus={(e) => e.currentTarget.select()} />
            <button className="ad-btn" onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</button>
          </div>
          <button className="ad-btn-plain" onClick={() => setInviteLink(null)}>Done</button>
        </div>
      )}

      <section className="ad-card">
        <table className="ad-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Since</th><th className="ad-right">Actions</th></tr></thead>
          <tbody>
            {busy && members.length === 0 && <tr><td colSpan={5} className="ad-empty">Loading…</td></tr>}
            {members.map((m) => (
              <tr key={m.id}>
                <td>{[m.first_name, m.last_name].filter(Boolean).join(" ") || "—"}</td>
                <td>{m.email}</td>
                <td><span className={`ad-chip ${m.role === "admin" ? "ad-chip--ok" : ""}`}>{ROLE_LABEL[m.role] ?? m.role}</span></td>
                <td>{fmtDate(m.created_at)}</td>
                <td className="ad-right">
                  {m.role === "admin" ? (
                    <span className="ad-note">Owner</span>
                  ) : (
                    <button className="ad-btn-plain ad-danger" disabled={removing === m.id} onClick={() => removeMember(m)}>
                      {removing === m.id ? "Removing…" : "Remove"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
