import { Link } from 'react-router-dom'
import { POLICY_ROUTES } from '../data/policies'
export default function PolicyLinks({ paths = Object.keys(POLICY_ROUTES), includeOrders = true, className = '' }) {
  return (
    <nav className={`policy-links ${className}`.trim()} aria-label="Policies and support">
      {paths.map(path => <Link key={path} to={path}>{POLICY_ROUTES[path]}</Link>)}
      {includeOrders && <Link to="/account/orders">Your orders</Link>}
    </nav>
  )
}
