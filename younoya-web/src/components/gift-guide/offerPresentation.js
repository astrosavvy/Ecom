import { getProductByHandle } from '../../data/products'

export const money = value => `₹${((value || 0)).toLocaleString('en-IN')}`
export const destination = offer => `${offer.privateOffer ? '/offer/' : '/product/'}${offer.handle}`
export const image = offer => !offer.privateOffer && getProductByHandle(offer.handle)?.shopCardImage || offer.image
export const title = value => value === value.toUpperCase() ? value.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()) : value
