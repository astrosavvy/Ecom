import { InjectTransactionManager, MedusaContext, MedusaService } from "@medusajs/framework/utils"
import type { Context } from "@medusajs/framework/types"
import type { SqlEntityManager } from "@mikro-orm/knex"
import OtpChallenge from "./models/otp-challenge"
import OtpRateLimit from "./models/otp-rate-limit"
import { reserveChallenge, finishDelivery } from "./transactions"
import { consumeChallenge } from "./verification"
import type { OtpReservation, OtpVerification } from "./types"

class YounoyaOtpModuleService extends MedusaService({
  OtpChallenge,
  OtpRateLimit,
}) {
  @InjectTransactionManager()
  async reserve(input: OtpReservation, @MedusaContext() context: Context = {}) {
    return reserveChallenge(context.transactionManager as SqlEntityManager, input)
  }

  @InjectTransactionManager()
  async finish(id: string, messageId: string | null, expiresAt: Date, @MedusaContext() context: Context = {}) {
    return finishDelivery(context.transactionManager as SqlEntityManager, id, messageId, expiresAt)
  }

  @InjectTransactionManager()
  async consume(input: OtpVerification, @MedusaContext() context: Context = {}) {
    return consumeChallenge(context.transactionManager as SqlEntityManager, input)
  }
}

export default YounoyaOtpModuleService
