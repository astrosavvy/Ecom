import { Outlet, useLocation } from "react-router-dom"
import StoreHeader from "./components/StoreHeader"
import StoreFooter from "./components/StoreFooter"

export default function StoreLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className={`store ${isHome ? 'store--atelier' : ''}`}>
      <StoreHeader />
      <main className="store__main" style={{ paddingTop: isHome ? '0' : '72px' }}>
        <Outlet />
      </main>
      {!isHome && <StoreFooter />}
    </div>
  )
}
