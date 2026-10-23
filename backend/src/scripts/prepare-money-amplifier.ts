import type { ExecArgs } from '@medusajs/framework/types'
import { prepareMoneyAmplifier } from '../modules/younoya-commerce/money-amplifier-catalog'
import { closeDatabase } from '../modules/younoya-commerce/db'

export default async function prepare({ container }: ExecArgs) {
  try {
    const result = await prepareMoneyAmplifier(container)
    container.resolve('logger').info(JSON.stringify(result))
  } finally {
    await closeDatabase()
  }
}
