import type { ExecArgs } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'
import { createPromotionsWorkflow } from '@medusajs/medusa/core-flows'
import { closeDatabase } from '../modules/younoya-commerce/db'

export default async function seedFestivePromo({ container }: ExecArgs) {
  try {
    const promotionModule = container.resolve(Modules.PROMOTION)
    const existing = await promotionModule.listPromotions({ code: ['YOUFESTIVE'] })
    if (existing.length > 0) {
      container.resolve('logger').info('YOUFESTIVE promotion already exists.')
      return existing[0]
    }

    const { result } = await createPromotionsWorkflow(container).run({
      input: {
        promotionsData: [{
          code: 'YOUFESTIVE',
          type: 'standard',
          status: 'active',
          application_method: {
            type: 'fixed',
            target_type: 'order',
            currency_code: 'inr',
            value: 200,
          }
        }]
      }
    })
    container.resolve('logger').info('Created YOUFESTIVE promotion: ' + JSON.stringify(result))
    return result[0]
  } catch (err: any) {
    container.resolve('logger').error('Error seeding YOUFESTIVE promo: ' + (err.message || err))
    throw err
  } finally {
    await closeDatabase()
  }
}
