import type { ExecArgs } from '@medusajs/framework/types'
import { releaseKalash } from '../modules/younoya-commerce/kalash-release'
import { closeDatabase } from '../modules/younoya-commerce/db'
export default async function release({container}: ExecArgs) {
  try { container.resolve('logger').info(JSON.stringify(await releaseKalash(container))) }
  finally { await closeDatabase() }
}
