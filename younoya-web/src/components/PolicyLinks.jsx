import { Link } from 'react-router-dom'
import { POLICY_ROUTES } from '../data/policies'
export default function PolicyLinks() {
  return <nav className="policy-links" aria-label="Policies and support">{Object.entries(POLICY_ROUTES).map(([path,label]) => <Link key={path} to={path}>{label}</Link>)}<Link to="/account/orders">Your orders</Link></nav>
}
