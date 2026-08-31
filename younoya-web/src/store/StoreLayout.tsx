import { Outlet } from "react-router-dom"
import StoreHeader from "./components/StoreHeader"
import StoreFooter from "./components/StoreFooter"

export default function StoreLayout() {
  return (
    <div className="store">
      <StoreHeader />
      <main className="store__main" style={{ paddingTop: '72px' }}>
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  )
}
