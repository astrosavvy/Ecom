import { Link, useLocation } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteConfigContext'
import { POLICY_ROUTES, policySections } from '../data/policies'
import PolicyLinks from '../components/PolicyLinks'
import '../styles/Policies.css'
export default function PolicyPage() {
  const { pathname } = useLocation()
  const { business, policiesPublished, policyRevision } = useSiteConfig()
  return <section className="policy-page"><header><Link to="/shop" className="policy-back">← The collection</Link>
    <span className="policy-eyebrow">YOUNOYA · HERE TO HELP</span><h1>{POLICY_ROUTES[pathname]}</h1>
    <p>Considered care, from your first question to the moment your piece arrives.</p>
    <small>{policiesPublished ? `Published policy · Revision ${policyRevision}` : 'Draft information · Online ordering is being prepared'}</small>
  </header><div className="policy-page__body"><aside><PolicyLinks /></aside><article>
    {!policiesPublished && <p className="policy-status" role="status">Business and policy details are being finalized before ordering opens. Confirmed information is available below. Write to <a href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a> for assistance.</p>}
    {policySections(pathname,business).map(([title,text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}
    {pathname === '/contact' && <a className="policy-action" href={`mailto:${business.supportEmail}`}>Contact the atelier ↗</a>}
  </article></div></section>
}
