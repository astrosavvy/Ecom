const API = import.meta.env.VITE_API_URL || "https://api.younoya.com"
const TOKEN_KEY = "yn_admin_token"

export type Role = "admin" | "support" | "marketing"

export type Me = {
  id: string
  email: string
  first_name: string
  last_name?: string | null
  role: Role
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  })
  if (res.status === 401) {
    clearToken()
    if (!location.pathname.startsWith("/admin/login")) {
      location.assign("/admin/login")
    }
    throw new Error("Please sign in again.")
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.message) message = body.message
    } catch {
      /* keep default */
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

export async function fetchMe(): Promise<Me> {
  const data = await api<{ user: any }>("/admin/users/me")
  const u = data.user
  const role = u?.metadata?.role
  return {
    id: u.id,
    email: u.email,
    first_name: u.first_name || "Team",
    last_name: u.last_name,
    role: role === "support" || role === "marketing" ? role : "admin",
  }
}

export async function login(email: string, password: string): Promise<Me> {
  const res = await fetch(`${API}/auth/user/emailpass`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error("Wrong email or password.")
  const { token } = await res.json()
  if (!token) throw new Error("Sign in failed. Try again.")
  setToken(token)
  return fetchMe()
}

export function logout() {
  clearToken()
  location.assign("/admin/login")
}

export function formatINR(paise: number | undefined | null): string {
  if (paise == null) return "—"
  return `₹${(paise / 100).toLocaleString("en-IN")}`
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}
