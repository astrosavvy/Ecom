const API = import.meta.env.VITE_API_BASE || 'https://api.younoya.com'
export const PUBLISHABLE_KEY = import.meta.env.VITE_PUBLISHABLE_KEY || 'pk_d4577228b532cf8c81a5b63e898652da2dbaf9730acd3f8f449ccda1f8482c75'
const TOKEN_KEY = 'younoya_customer_token'

export const getCustomerToken = () => sessionStorage.getItem(TOKEN_KEY)
export const clearCustomerToken = () => sessionStorage.removeItem(TOKEN_KEY)

export async function storeRequest(path, { body, method = body ? 'POST' : 'GET', auth = false } = {}) {
  const token = getCustomerToken()
  if (auth && !token) throw new Error('Sign in to continue')
  const response = await fetch(`${API}${path}`, {
    method,
    headers: { 'content-type': 'application/json', 'x-publishable-api-key': PUBLISHABLE_KEY,
      ...(token ? { authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(12000),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const issue = new Error(data.message || `Request failed (${response.status})`)
    issue.status = response.status
    throw issue
  }
  return data
}

export async function requestEmailCode(email) {
  return storeRequest('/store/otp/request', { body: { email } })
}

export async function verifyEmailCode(email, otp) {
  const { ticket } = await storeRequest('/store/otp/verify', { body: { email, otp } })
  const { token } = await storeRequest('/auth/customer/younoya-mobile-otp', { body: { ticket } })
  if (!token) throw new Error('Could not start your account session')
  sessionStorage.setItem(TOKEN_KEY, token)
  try {
    return (await storeRequest('/store/customers/me', { auth: true })).customer
  } catch (issue) {
    if (issue.status !== 401 && issue.status !== 404) throw issue
    await storeRequest('/store/customers', { body: { email }, auth: true })
    const refreshed = await storeRequest('/auth/token/refresh', { method: 'POST', auth: true })
    if (refreshed.token) sessionStorage.setItem(TOKEN_KEY, refreshed.token)
    return (await storeRequest('/store/customers/me', { auth: true })).customer
  }
}
