import { CommerceError } from './db'
export const COD_FEE = 49
export type CheckoutMethod = 'razorpay' | 'cod'
export function checkoutMethod(value: unknown): CheckoutMethod {
  if (value === undefined || value === 'razorpay') return 'razorpay'
  if (value === 'cod') return 'cod'
  throw new CommerceError('Select Razorpay or Cash on Delivery')
}
const normalize = (value: unknown) => String(value || '').toLowerCase().replace(/[^a-z]/g, '')
export function coreNcr(location: any) {
  const state = normalize(location.state), district = normalize(location.city)
  if (['delhi', 'newdelhi', 'nctofdelhi'].includes(state)) return true
  if (state === 'haryana') return ['gurgaon', 'gurugram', 'faridabad'].includes(district)
  return state === 'uttarpradesh' && ['ghaziabad', 'gautambuddhanagar', 'gautambudhnagar'].includes(district)
}
export function deliveryInfo(location: any, method: CheckoutMethod = 'razorpay', now = new Date(), business: any = {}) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hourCycle: 'h23' }).formatToParts(now)
  const beforeCutoff = Number(parts.find(p => p.type === 'hour')?.value) < 18
  const regional = coreNcr(location)
  const min = business.deliveryMinDays || 3, max = business.deliveryMaxDays || 5
  const sameDay = method === 'razorpay' && regional && beforeCutoff
  return { regional, before_cutoff: beforeCutoff, checked_at: now.toISOString(), same_day_advisory: sameDay,
    message: sameDay ? 'Prepaid orders: same-day delivery in Delhi NCR when ordered by 6 PM, subject to courier confirmation.'
      : `${method === 'cod' ? 'COD: e' : 'E'}stimated delivery ${min}–${max} working days after dispatch.`,
    note: 'Festival, weather and unforeseen delays may affect delivery.' }
}
