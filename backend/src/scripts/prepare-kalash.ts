import type { ExecArgs } from '@medusajs/framework/types'
import { prepareKalash } from '../modules/younoya-commerce/kalash-catalog'
import { closeDatabase } from '../modules/younoya-commerce/db'
export default async function prepare({container}: ExecArgs) {
  try { container.resolve('logger').info(JSON.stringify(await prepareKalash(container))) }
  finally { await closeDatabase() }
}
