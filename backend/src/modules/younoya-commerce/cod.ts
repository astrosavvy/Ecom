import { CommerceError, exclusive } from './db'
import { completedOrder, readCart } from './orders'
// Compatibility endpoint: old clients may recover an existing order only.
export async function confirmCod(scope: any, cartId: string, owner: string) {
  return exclusive(`complete:${cartId}`,async () => {
    await readCart(scope,cartId,owner)
    const order = await completedOrder(scope,cartId)
    if (order) return { order }
    throw new CommerceError('Cash on Delivery is no longer available. Reopen checkout to use online payment.',409)
  })
}
