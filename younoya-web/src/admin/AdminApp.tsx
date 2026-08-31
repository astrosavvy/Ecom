import { useEffect, useState } from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { fetchMe, getToken, logout, type Me, type Role } from "./api"
import Login from "./pages/Login"
import InviteAccept from "./pages/InviteAccept"
import Home from "./pages/Home"
import Orders from "./pages/Orders"
import OrderDetail from "./pages/OrderDetail"
import Customers from "./pages/Customers"
import CustomerDetail from "./pages/CustomerDetail"
import Products from "./pages/Products"
import Journal from "./pages/Journal"
import Team from "./pages/Team"
import JournalEdit from "./pages/JournalEdit"
import ThemeManager from "./pages/ThemeManager"
import RecommendationRules from "./pages/RecommendationRules"
import ProductMetadata from "./pages/ProductMetadata"

const MAIN_NAV: Array<{ to: string; label: string; icon: string; roles: Role[] }> = [
  { to: "/admin", label: "Home", icon: "◈", roles: ["admin"] },
  { to: "/admin/orders", label: "Orders", icon: "❒", roles: ["admin", "support"] },
  { to: "/admin/customers", label: "Customers", icon: "☺", roles: ["admin", "support"] },
  { to: "/admin/products", label: "Products", icon: "❖", roles: ["admin"] },
  { to: "/admin/journal", label: "Journal", icon: "✎", roles: ["admin", "marketing"] },
  { to: "/admin/team", label: "Team", icon: "⚭", roles: ["admin"] },
]

const PERS_NAV: Array<{ to: string; label: string; icon: string; roles: Role[] }> = [
  { to: "/admin/themes", label: "Themes", icon: "✧", roles: ["admin"] },
  { to: "/admin/rules", label: "Rules", icon: "⍟", roles: ["admin"] },
  { to: "/admin/metadata", label: "Metadata", icon: "⎈", roles: ["admin"] },
]

export default function AdminApp() {
  const [me, setMe] = useState<Me | null>(null)
  const [checking, setChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.startsWith("/admin/invite")) {
      setChecking(false)
      return
    }
    if (!getToken()) {
      setChecking(false)
      return
    }
    fetchMe()
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setChecking(false))
  }, [location.pathname])

  if (location.pathname.startsWith("/admin/invite")) {
    return <InviteAccept />
  }

  if (checking) {
    return (
      <div className="ad-boot">
        <span className="ad-boot__ring" />
      </div>
    )
  }

  if (!me) {
    return <Login onDone={setMe} />
  }

  const mainNav = MAIN_NAV.filter((n) => n.roles.includes(me.role))
  const persNav = PERS_NAV.filter((n) => n.roles.includes(me.role))

  return (
    <div className="ad">
      <aside className="ad__side">
        <Link to="/admin" className="ad__brand">
          <img src="/brand.webp" alt="" />
          <span>Younoya <em>Console</em></span>
        </Link>
        <nav className="ad__nav">
          <div className="ad__nav-section">
            <small style={{ padding: "0 1rem", color: "#6B7280", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>Main</small>
            {mainNav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/admin"} icon={n.icon} label={n.label} />
            ))}
          </div>
          {persNav.length > 0 && (
            <div className="ad__nav-section" style={{ marginTop: "1.5rem" }}>
              <small style={{ padding: "0 1rem", color: "#6B7280", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "0.5rem" }}>Personalisation</small>
              {persNav.map((n) => (
                <NavLink key={n.to} to={n.to} end={false} icon={n.icon} label={n.label} />
              ))}
            </div>
          )}
        </nav>
        <div className="ad__me">
          <span className="ad__me-avatar">{me.first_name.slice(0, 1).toUpperCase()}</span>
          <div>
            <strong>{me.first_name}</strong>
            <small>{me.role === "admin" ? "Owner" : me.role === "support" ? "Support" : "Marketing"}</small>
          </div>
          <button className="ad__out" onClick={logout} title="Sign out">⏻</button>
        </div>
      </aside>
      <main className="ad__main">
        <Routes>
          <Route path="/" element={me.role === "admin" ? <Home /> : <HomeFallback me={me} />} />
          <Route path="/orders" element={<Orders role={me.role} />} />
          <Route path="/orders/:id" element={<OrderDetail role={me.role} />} />
          <Route path="/customers" element={<Customers role={me.role} />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<JournalEdit />} />
          <Route path="/journal/:id" element={<JournalEdit />} />
          <Route path="/team" element={<Team />} />
          <Route path="/themes" element={<ThemeManager />} />
          <Route path="/rules" element={<RecommendationRules />} />
          <Route path="/metadata" element={<ProductMetadata />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function HomeFallback({ me }: { me: Me }) {
  return (
    <div className="ad__page">
      <header className="ad__head">
        <h1>Welcome, {me.first_name}</h1>
        <p>Pick a section from the sidebar to get started.</p>
      </header>
    </div>
  )
}

function NavLink({ to, label, icon, end }: { to: string; label: string; icon: string; end?: boolean }) {
  const location = useLocation()
  const active = end ? location.pathname === to : location.pathname.startsWith(to)
  return (
    <Link to={to} className={`ad__link${active ? " ad__link--on" : ""}`}>
      <i>{icon}</i>
      {label}
    </Link>
  )
}
