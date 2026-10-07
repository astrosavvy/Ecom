import type { SqlEntityManager } from "@mikro-orm/knex"
import { lockContact } from "./transactions"
import { verifyOtp } from "./utils/otp"
import type { OtpCheck, OtpVerification } from "./types"

export async function consumeChallenge(manager: SqlEntityManager, input: OtpVerification): Promise<OtpCheck> {
  await lockContact(manager, input.identifier, input.identifierType)
  const rows = await manager.execute(`select * from otp_challenge where identifier = ? and identifier_type = ?
    and status = 'pending' and delivery_status = 'accepted' and deleted_at is null
    ${input.challengeId ? "and id = ?" : ""} order by created_at desc limit 1 for update`,
    [input.identifier, input.identifierType, ...(input.challengeId ? [input.challengeId] : [])])
  const challenge = rows[0]
  if (!challenge) return { valid: false, message: "Invalid or expired code. Request a new one." }
  if (new Date(challenge.expires_at) <= input.now) {
    await manager.execute("update otp_challenge set status = 'expired', updated_at = now() where id = ?", [challenge.id])
    return { valid: false, message: "Code expired. Request a new one." }
  }
  if (challenge.attempts >= challenge.max_attempts) return { valid: false, message: "Too many attempts. Request a new code." }
  if (!verifyOtp(input.otp, challenge.salt, challenge.otp_hash)) {
    const remaining = challenge.max_attempts - challenge.attempts - 1
    await manager.execute("update otp_challenge set attempts = attempts + 1, status = ?, updated_at = now() where id = ?",
      [remaining ? "pending" : "rate_limited", challenge.id])
    return { valid: false, message: remaining ? `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` : "Too many attempts. Request a new code." }
  }
  await manager.execute("update otp_challenge set status = 'verified', consumed_at = ?, updated_at = now() where id = ?", [input.now, challenge.id])
  return { valid: true }
}
