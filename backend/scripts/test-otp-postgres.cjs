const path = require('path')
const assert = require('assert/strict')
const crypto = require('crypto')
const { createRequire } = require('module')
const root = path.resolve(__dirname, '../.medusa/server')
if (process.env.OTP_QA_ALLOW_ISOLATED_SCHEMA !== 'true') throw new Error('Set OTP_QA_ALLOW_ISOLATED_SCHEMA=true to allow a disposable PostgreSQL QA schema')
const req = createRequire(path.join(root, 'package.json'))
req('@medusajs/framework/utils').loadEnv('production', root)
const knex = req('knex')({ client: 'pg', connection: process.env.DATABASE_URL, pool: { min: 0, max: 5 } })
const Service = require(path.join(root, 'src/modules/younoya-otp/service')).default
const { hashOtp } = require(path.join(root, 'src/modules/younoya-otp/utils/otp'))
const schema = `otp_qa_${crypto.randomBytes(6).toString('hex')}`
const service = new Service({ baseRepository: { transaction: callback => knex.transaction(async trx => {
  await trx.raw(`set local search_path to "${schema}"`)
  return callback({ execute: (sql, values = []) => trx.raw(sql, values).then(result => result.rows) })
}) } })
const input = (identifier, id, now = new Date(), ip = 'qa-ip', limit = 10) => ({ id, identifier,
  identifierType: 'email', channel: 'email', ...hashOtp('123456'), ip, now,
  expiresAt: new Date(now.getTime() + 600000), hourlyLimit: limit })
async function main() {
  await knex.raw(`create schema "${schema}"`)
  try {
    await knex.transaction(async trx => {
      await trx.raw(`set local search_path to "${schema}"`)
      for (const file of ['Migration20260824151140', 'Migration20261007120136']) {
        const exports = require(path.join(root, `src/modules/younoya-otp/migrations/${file}`))
        const migration = new exports[file]({}, {})
        await migration.up()
        for (const sql of migration.getQueries()) await trx.raw(sql)
      }
      await trx.raw("insert into otp_challenge (id,identifier,identifier_type,otp_hash,salt,expires_at) values ('legacy','qa-old@example.invalid','email','old','old',now())")
      const [old] = await trx.select('delivery_status', 'channel').from('otp_challenge').where({ id: 'legacy' })
      assert.equal(old.delivery_status, 'accepted'); assert.equal(old.channel, 'email')
    })
    let results = await Promise.allSettled(Array.from({ length: 4 }, (_, i) => service.reserve(input('qa-concurrent@example.invalid', `concurrent-${i}`))))
    assert.equal(results.filter(item => item.status === 'fulfilled').length, 1)
    assert.equal(results.filter(item => item.status === 'rejected' && item.reason.status === 429).length, 3)
    console.log('PASS concurrent request cooldown and additive legacy migration')
    const phone = { ...input('+919876543210', 'wa-code'), identifierType: 'mobile', channel: 'whatsapp' }
    await service.reserve(phone)
    await assert.rejects(() => service.reserve({ ...phone, id: 'sms-code', channel: 'sms' }), { status: 429 })
    console.log('PASS WhatsApp and SMS share one phone cooldown')
    const valid = input('qa-valid@example.invalid', 'valid')
    await service.reserve(valid)
    assert.equal((await service.consume({ ...valid, otp: '123456', challengeId: valid.id, now: new Date() })).valid, false)
    await service.finish(valid.id, 'provider-id', new Date(Date.now() + 600000))
    const failed = input(valid.identifier, 'failed', new Date(Date.now() + 61000))
    await service.reserve(failed); await service.finish(failed.id, null, new Date())
    results = await Promise.all(Array.from({ length: 3 }, () => service.consume({ ...valid, otp: '123456', challengeId: valid.id, now: new Date() })))
    assert.equal(results.filter(item => item.valid).length, 1)
    console.log('PASS queued code blocked, failed resend preserves old code, verification is single-use under concurrency')
    const replaced = input('qa-replaced@example.invalid', 'old-code')
    await service.reserve(replaced); await service.finish(replaced.id, 'old-message', replaced.expiresAt)
    const newer = input(replaced.identifier, 'new-code', new Date(Date.now() + 61000))
    await service.reserve(newer); await service.finish(newer.id, 'new-message', newer.expiresAt)
    assert.equal((await service.consume({ ...replaced, otp: '123456', challengeId: replaced.id, now: new Date() })).valid, false)
    results = await Promise.all(Array.from({ length: 6 }, () => service.consume({ ...newer, otp: '654321', challengeId: newer.id, now: new Date() })))
    assert.ok(results.every(item => !item.valid))
    assert.equal((await service.consume({ ...newer, otp: '123456', challengeId: newer.id, now: new Date() })).valid, false)
    console.log('PASS accepted resend invalidates old code and five-attempt limit is atomic')
    const expired = input('qa-expired@example.invalid', 'expired-code')
    await service.reserve(expired); await service.finish(expired.id, 'expired-message', new Date(Date.now() - 1000))
    assert.equal((await service.consume({ ...expired, otp: '123456', now: new Date() })).valid, false)
    const limited = input('qa-limited@example.invalid', 'limit-1', new Date(), 'qa-limit-ip', 1)
    await service.reserve(limited)
    await assert.rejects(() => service.reserve(input(limited.identifier, 'limit-2', new Date(Date.now() + 61000), 'qa-limit-ip', 1)), { status: 429 })
    results = await Promise.allSettled(Array.from({ length: 4 }, (_, i) => service.reserve(input(`qa-ip-${i}@example.invalid`, `ip-${i}`, new Date(), 'qa-shared-ip', 1))))
    assert.equal(results.filter(item => item.status === 'fulfilled').length, 2)
    console.log('PASS expiry, identifier cap and shared IP cap')
  } finally {
    // Only the uniquely created disposable QA schema is removed; production tables are untouched.
    if (!/^otp_qa_[a-f0-9]{12}$/.test(schema)) throw new Error('Unsafe cleanup target')
    await knex.raw(`drop schema "${schema}" cascade`)
    await knex.destroy()
    console.log('QA schema removed; zero production rows created')
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
