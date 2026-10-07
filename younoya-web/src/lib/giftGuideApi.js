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
    issue.retryAfter = Number(data.retry_after || response.headers.get('Retry-After')) || 0
    throw issue
  }
  return data
}

export const requestEmailCode = email => requestLoginCode({ email })
export const requestLoginCode = (contact, resend = false) => storeRequest(`/store/otp/${resend ? 'resend' : 'request'}`, { body: contact })
export const getLoginConfig = () => storeRequest('/store/otp/config')

export const verifyEmailCode = (email, otp) => verifyLoginCode({ email }, otp)

export async function verifyLoginCode(contact, otp, challengeId) {
  const { ticket, identifier, identifier_type: type } = await storeRequest('/store/otp/verify', {
    body: { ...contact, otp, ...(challengeId ? { challenge_id: challengeId } : {}) } })
  const { token } = await storeRequest('/auth/customer/younoya-mobile-otp', { body: { ticket } })
  if (!token) throw new Error('Could not start your account session')
  sessionStorage.setItem(TOKEN_KEY, token)
  try {
    return (await storeRequest('/store/customers/me', { auth: true })).customer
  } catch (issue) {
    if (issue.status !== 401 && issue.status !== 404) throw issue
    const verifiedContact = type === 'mobile' ? { phone: identifier } : { email: identifier || contact.email }
    await storeRequest('/store/customers', { body: verifiedContact, auth: true })
    const refreshed = await storeRequest('/auth/token/refresh', { method: 'POST', auth: true })
    if (refreshed.token) sessionStorage.setItem(TOKEN_KEY, refreshed.token)
    return (await storeRequest('/store/customers/me', { auth: true })).customer
  }
}
