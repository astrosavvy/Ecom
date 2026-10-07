import ComingSoon from './ComingSoon'
import Shop from './Shop'
import { useSiteConfig } from '../context/SiteConfigContext'

export default function Home() {
  const { storefrontMode } = useSiteConfig()
  return storefrontMode === 'coming-soon' ? <ComingSoon /> : <Shop />
}
