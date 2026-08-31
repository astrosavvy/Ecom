import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { api, fmtDate } from "../api"

type Customer = {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  created_at: string
}

type Profile = {
  id: string
  full_name: string
  relationship: string
  is_self: boolean
  dob: string
  tob: string | null
  pob: string | null
  sun_sign: string
  moon_sign: string
  nakshatra: string | null
  element: string
  ruling_planet: string
}

export default function CustomerDetail() {
  const { id } = useParams()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api(`/admin/customers/${id}`)
      .then((d: any) => setCustomer(d.customer))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load this customer."))
    api(`/admin/astro/profiles?customer_id=${id}`)
      .then((d: any) => setProfiles(d.profiles ?? []))
      .catch(() => setProfiles([]))
  }, [id])

  if (error) return <div className="ad__page"><p className="ad-error">{error}</p></div>
  if (!customer) return <div className="ad__page"><p className="ad-empty">Loading…</p></div>

  return (
    <div className="ad__page">
      <header className="ad__head">
        <Link to="/admin/customers" className="ad-link">← Customers</Link>
        <h1>{[customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email}</h1>
        <p>{customer.email}{customer.phone ? ` · ${customer.phone}` : ""} · with us since {fmtDate(customer.created_at)}</p>
      </header>

      <section className="ad-card">
        <div className="ad-card__head"><h2>Birth charts</h2></div>
        {profiles.length === 0 && <p className="ad-empty">No birth charts saved yet.</p>}
        <div className="ad-profiles">
          {profiles.map((p) => (
            <div className="ad-profile" key={p.id}>
              <div className="ad-profile__head">
                <strong>{p.full_name}</strong>
                <span className="ad-chip">{p.is_self ? "Self" : p.relationship}</span>
              </div>
              <dl>
                <div><dt>Born</dt><dd>{p.dob}{p.tob ? ` · ${p.tob}` : ""}</dd></div>
                <div><dt>Place</dt><dd>{p.pob ?? "—"}</dd></div>
                <div><dt>Sun</dt><dd>{p.sun_sign}</dd></div>
                <div><dt>Moon</dt><dd>{p.moon_sign}</dd></div>
                <div><dt>Nakshatra</dt><dd>{p.nakshatra ?? "—"}</dd></div>
                <div><dt>Element · Planet</dt><dd>{p.element} · {p.ruling_planet}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
