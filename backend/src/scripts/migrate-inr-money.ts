import { ExecArgs } from '@medusajs/framework/types'
import { closeDatabase } from '../modules/younoya-commerce/db'
import { migrateMoney, rollbackMoney } from '../modules/younoya-commerce/money-migration'
export default async function run({ container }: ExecArgs) {
  const logger = container.resolve('logger')
  try {
    const result = process.env.MONEY_MIGRATION_MODE === 'rollback' ? await rollbackMoney() : await migrateMoney(process.env.MONEY_MIGRATION_MODE === 'apply')
    logger.info(JSON.stringify(result))
  } finally { await closeDatabase() }
}
