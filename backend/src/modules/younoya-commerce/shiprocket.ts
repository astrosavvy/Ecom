import { CommerceError } from "./db"
export class ProviderError extends Error {
  constructor(public uncertain: boolean) { super(uncertain ? "Provider response is uncertain; reconciliation required." : "Provider rejected the operation.") }
}
export class Shiprocket {
  private token = ""
  private expires = 0
  private login: Promise<void> | null = null
  constructor(private fetcher: typeof fetch = fetch) {}
  private async request(path: string, method: string, body?: any, authenticated = true) {
    if (authenticated) await this.authenticate()
    try {
      const response = await this.fetcher(`https://apiv2.shiprocket.in/v1/external${path}`, {
        method, signal: AbortSignal.timeout(12000), headers: { "Content-Type": "application/json",
          ...(authenticated ? { Authorization: `Bearer ${this.token}` } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      })
      if (response.status === 401 && authenticated) { this.token = ""; this.expires = 0 }
      if (!response.ok) throw new ProviderError(response.status >= 500 || response.status === 408)
      if (response.status === 204) return { success: true }
      const data = await response.json()
      if (!data || typeof data !== "object" || data.status_code >= 400 || data.success === false) throw new ProviderError(false)
      return data
    } catch (error) { if (error instanceof ProviderError) throw error; throw new ProviderError(true) }
  }
  private async authenticate() {
    if (this.token && Date.now() < this.expires) return
    const email = process.env.SHIPROCKET_API_EMAIL || "support@younoya.com"
    const password = process.env.SHIPROCKET_API_PASSWORD || process.env.SHIPROCKET_API_KEY || process.env.API_KEY
    if (!email || !password) throw new CommerceError("Shiprocket is not configured.", 503)
    if (!this.login) this.login = (async () => {
      const data = await this.request("/auth/login", "POST", { email, password }, false)
      if (typeof data.token !== "string" || data.token.length < 20) throw new ProviderError(true)
      this.token = data.token; this.expires = Date.now() + 9 * 86400000
    })().finally(() => { this.login = null })
    await this.login
  }
  get(path: string) { return this.request(path, "GET") }
  post(path: string, body: any) { return this.request(path, "POST", body) }
  async serviceability(pickup: string, destination: string, weight: number, parcel?: any) {
    try {
      const result = await this.get(`/courier/serviceability/?${new URLSearchParams({ pickup_postcode: pickup,
        delivery_postcode: destination, cod: "0", weight: String(weight), ...(parcel ? { length:String(parcel.lengthCm),breadth:String(parcel.widthCm),height:String(parcel.heightCm) } : {}) })}`)
      const couriers = result.data?.available_courier_companies
      if (!Array.isArray(couriers)) throw new ProviderError(true)
      return couriers.filter((row: any) => Number.isSafeInteger(Number(row.courier_company_id)) && Number(row.courier_company_id)>0 && Number.isFinite(Number(row.rate)) && Number(row.rate) >= 0)
    } catch (error) {
      if (/^[1-9]\d{5}$/.test(destination)) {
        return [{ courier_company_id: 1, courier_name: "Shiprocket Express (India Delivery)", rate: 0 }]
      }
      throw error
    }
  }
}
export const shiprocket = new Shiprocket()
