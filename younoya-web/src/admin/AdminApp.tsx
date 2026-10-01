import React, { useEffect, useState } from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Sparkles,
  BookOpen,
  UserCheck,
  Palette,
  Scale,
  Tags,
  Gift,
  LogOut,
  ChevronRight,
} from "lucide-react"
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
import OfferManager from "./pages/OfferManager"
import "../styles/Admin.css"

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  roles: Role[]
  badge?: string
}

const MAIN_NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, roles: ["admin", "support"] },
  { to: "/admin/customers", label: "Customers", icon: Users, roles: ["admin", "support"] },
  { to: "/admin/products", label: "Heirlooms", icon: Sparkles, roles: ["admin"] },
  { to: "/admin/journal", label: "Journal", icon: BookOpen, roles: ["admin", "marketing"] },
  { to: "/admin/team", label: "Atelier Team", icon: UserCheck, roles: ["admin"] },
]

const PERS_NAV: NavItem[] = [
  { to: "/admin/themes", label: "Themes", icon: Palette, roles: ["admin"] },
  { to: "/admin/rules", label: "Astro Rules", icon: Scale, roles: ["admin"] },
  { to: "/admin/metadata", label: "Metadata", icon: Tags, roles: ["admin"] },
  { to: "/admin/gift-guide", label: "Guide Offers", icon: Gift, roles: ["admin"] },
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
          <div className="ad__brand-emblem-wrap">
            <img src="/brand.webp" alt="YOUNOYA" className="ad__brand-emblem" />
          </div>
          <div className="ad__brand-text">
            <span className="ad__brand-title">YOUNOYA</span>
            <span className="ad__brand-sub">ATELIER CONSOLE</span>
          </div>
        </Link>

        <nav className="ad__nav">
          <div className="ad__nav-section">
            <span className="ad__nav-heading">MAIN SUITE</span>
            {mainNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/admin"}
                icon={n.icon}
                label={n.label}
                badge={n.badge}
              />
            ))}
          </div>

          {persNav.length > 0 && (
            <div className="ad__nav-section">
              <span className="ad__nav-heading">PERSONALISATION</span>
              {persNav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={false}
                  icon={n.icon}
                  label={n.label}
                  badge={n.badge}
                />
              ))}
            </div>
          )}
        </nav>

        <div className="ad__me">
          <div className="ad__me-avatar">
            <span>{me.first_name.slice(0, 1).toUpperCase()}</span>
          </div>
          <div className="ad__me-info">
            <strong className="ad__me-name">{me.first_name} {me.last_name || ""}</strong>
            <span className="ad__me-role">
              {me.role === "admin" ? "Atelier Owner" : me.role === "support" ? "Support Curator" : "Editorial Lead"}
            </span>
          </div>
          <button
            className="ad__out"
            onClick={logout}
            title="Sign out of Console"
            aria-label="Sign out"
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
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
          <Route path="/gift-guide" element={<OfferManager />} />
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
        <p>Pick a section from the navigation suite to begin.</p>
      </header>
    </div>
  )
}

function NavLink({
  to,
  label,
  icon: Icon,
  end,
  badge,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  end?: boolean
  badge?: string
}) {
  const location = useLocation()
  const active = end ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <Link to={to} className={`ad__link${active ? " ad__link--on" : ""}`}>
      <span className="ad__link-icon-wrap">
        <Icon size={17} strokeWidth={1.5} className="ad__link-icon" />
      </span>
      <span className="ad__link-label">{label}</span>
      {badge && <span className="ad__link-badge">{badge}</span>}
      {active && <span className="ad__link-indicator" />}
    </Link>
  )
}
