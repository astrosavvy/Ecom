import ComingSoon from './ComingSoon'
import Shop from './Shop'
import { useSiteConfig } from '../context/SiteConfigContext'

export default function Home() {
  const { storefrontMode, loading } = useSiteConfig()
  if (loading) return <div className="home-loading" role="status" aria-label="Loading Younoya"><span>YOUNOYA</span></div>
  return storefrontMode === 'coming-soon' ? <ComingSoon /> : <Shop />
}
