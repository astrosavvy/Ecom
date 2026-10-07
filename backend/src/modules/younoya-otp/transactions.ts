import type { SqlEntityManager } from "@mikro-orm/knex"
import crypto from "crypto"
import { resendSeconds } from "./config"
import { OtpError, type OtpReservation } from "./types"

export async function lockContact(manager: SqlEntityManager, identifier: string, type: string) {
  await manager.execute("select pg_advisory_xact_lock(hashtextextended(?, 0))", [`otp:${type}:${identifier}`])
}

export async function reserveChallenge(manager: SqlEntityManager, input: OtpReservation) {
  await lockContact(manager, input.identifier, input.identifierType)
  await lockContact(manager, input.ip, "ip")
  const recent = await manager.execute("select created_at from otp_challenge where identifier = ? and identifier_type = ? and deleted_at is null order by created_at desc limit 1", [input.identifier, input.identifierType])
  const retry = recent[0] ? Math.ceil((new Date(recent[0].created_at).getTime() + resendSeconds * 1000 - input.now.getTime()) / 1000) : 0
  if (retry > 0) throw new OtpError("Please wait before requesting another code.", 429, retry)
  for (const [identifier, type, maximum] of [[input.identifier, input.identifierType, input.hourlyLimit], [input.ip, "ip", input.hourlyLimit * 2]] as const) {
    const rows = await manager.execute("select coalesce(sum(request_count), 0) as total, min(window_start) as first from otp_rate_limit where identifier = ? and identifier_type = ? and window_start > ? and deleted_at is null", [identifier, type, new Date(input.now.getTime() - 3600000)])
    if (Number(rows[0].total) >= maximum) {
      const wait = Math.max(1, Math.ceil((new Date(rows[0].first).getTime() + 3600000 - input.now.getTime()) / 1000))
      throw new OtpError("Too many requests. Please try again later.", 429, wait)
    }
  }
  for (const [identifier, type] of [[input.identifier, input.identifierType], [input.ip, "ip"]]) {
    await manager.execute("insert into otp_rate_limit (id, identifier, identifier_type, request_count, window_start) values (?, ?, ?, 1, ?)", [`otprl_${crypto.randomUUID()}`, identifier, type, input.now])
  }
  await manager.execute("insert into otp_challenge (id, identifier, identifier_type, otp_hash, salt, expires_at, ip_address, channel, delivery_status, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?)", [input.id, input.identifier, input.identifierType, input.hash, input.salt, input.expiresAt, input.ip, input.channel, input.now])
}

export async function finishDelivery(manager: SqlEntityManager, id: string, messageId: string | null, expiresAt: Date) {
  const records = await manager.execute("select identifier, identifier_type from otp_challenge where id = ? and deleted_at is null", [id])
  if (!records[0]) throw new OtpError("Verification is temporarily unavailable.")
  await lockContact(manager, records[0].identifier, records[0].identifier_type)
  if (messageId) {
    await manager.execute("update otp_challenge set status = 'expired', updated_at = now() where identifier = ? and identifier_type = ? and id <> ? and status = 'pending' and delivery_status = 'accepted' and deleted_at is null", [records[0].identifier, records[0].identifier_type, id])
    await manager.execute("update otp_challenge set delivery_status = 'accepted', provider_message_id = ?, expires_at = ?, updated_at = now() where id = ? and delivery_status = 'queued'", [messageId, expiresAt, id])
  } else {
    await manager.execute("update otp_challenge set delivery_status = 'failed', status = 'expired', updated_at = now() where id = ? and delivery_status = 'queued'", [id])
  }
}
