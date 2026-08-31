import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api, fmtDate, type Role } from "../api"

type CustomerRow = { id: string; email: string; first_name?: string; last_name?: string; phone?: string; created_at: string }

const PAGE = 20

export default function Customers({ role }: { role: Role }) {
  const [rows, setRows] = useState<CustomerRow[]>([])
  const [count, setCount] = useState(0)
  const [q, setQ] = useState("")
  const [offset, setOffset] = useState(0)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setBusy(true)
      api(`/admin/customers?limit=${PAGE}&offset=${offset}${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`)
        .then((d: any) => {
          setRows(d.customers ?? [])
          setCount(d.count ?? 0)
          setError(null)
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Could not load customers."))
        .finally(() => setBusy(false))
    }, q ? 250 : 0)
    return () => window.clearTimeout(id)
  }, [q, offset])

  return (
    <div className="ad__page">
      <header className="ad__head">
        <h1>Customers</h1>
        <p>{role === "support" ? "Search a customer to see their details and birth chart." : "Everyone who shops with the stars."}</p>
      </header>
      <input
        className="ad-search"
        placeholder="Search by name, email or phone…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOffset(0) }}
      />
      {error && <p className="ad-error">{error}</p>}
      <section className="ad-card">
        <table className="ad-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
          <tbody>
            {busy && rows.length === 0 && <tr><td colSpan={4} className="ad-empty">Loading…</td></tr>}
            {!busy && rows.length === 0 && <tr><td colSpan={4} className="ad-empty">{q ? "No one matches that search." : "No customers yet."}</td></tr>}
            {rows.map((c) => (
              <tr key={c.id}>
                <td><Link to={`/admin/customers/${c.id}`} className="ad-link">{[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}</Link></td>
                <td>{c.email}</td>
                <td>{c.phone ?? "—"}</td>
                <td>{fmtDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {count > PAGE && (
          <div className="ad-pager">
            <button className="ad-btn-plain" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>← Newer</button>
            <span>{offset + 1}–{Math.min(offset + PAGE, count)} of {count}</span>
            <button className="ad-btn-plain" disabled={offset + PAGE >= count} onClick={() => setOffset(offset + PAGE)}>Older →</button>
          </div>
        )}
      </section>
    </div>
  )
}
