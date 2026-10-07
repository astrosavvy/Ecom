// Isolated-schema QA only: no real orders, provider calls, messages or credentials are printed.
const assert = require('node:assert/strict')
const path = require('node:path')
const crypto = require('node:crypto')
const { createRequire } = require('node:module')
if (process.env.COMMERCE_QA_ISOLATED !== '1') throw new Error('Explicit isolated QA mode is required')
const runtime = path.resolve(process.env.COMMERCE_QA_RUNTIME || path.join(__dirname,'../.medusa/server'))
const req = createRequire(path.join(runtime,'package.json'))
req('@medusajs/framework/utils').loadEnv('production',runtime)
const { Pool } = req('pg')
const admin = new Pool({ connectionString:process.env.DATABASE_URL,max:1 })
const schema = `commerce_qa_${crypto.randomBytes(6).toString('hex')}`
const build = path.resolve(process.env.COMMERCE_QA_BUILD || path.join(runtime,'src/modules/younoya-commerce'))
const originalUrl = new URL(process.env.DATABASE_URL)
originalUrl.searchParams.set('options',`-c search_path=${schema}`)
process.env.DATABASE_URL = originalUrl.toString()
process.env.JWT_SECRET = 'qa-process-only-signing'
process.env.RAZORPAY_KEY_ID = 'qa-process-only'
process.env.RAZORPAY_KEY_SECRET = 'qa-process-only'
global.fetch = async () => { throw new Error('Unmocked external request prohibited in QA') }
const db = require(path.join(build,'db'))
const settings = require(path.join(build,'settings'))
const rz = require(path.join(build,'razorpay'))
const { requestAfterSale,decideRequest } = require(path.join(build,'after-sales'))
const { createShipping,bookPickup } = require(path.join(build,'shipping-operations'))
const { shiprocket } = require(path.join(build,'shiprocket'))
const { approvalSignature } = require(path.join(build,'checkout'))
const scope = { resolve: () => ({ graph: async ({ filters }) => ({ data:[{ id:filters.id,customer_id:'cus_qa',items:[],status:'pending' }] }) }) }
async function main() {
  await admin.query(`create schema "${schema}"`)
  try {
    const exports = require(path.join(build,'migrations/Migration20261007160000'))
    const migration = new exports.Migration20261007160000({}, {})
    await migration.up()
    for (const sql of migration.getQueries()) await db.database().query(sql)
    await Promise.all(Array.from({ length:8 },() => db.enqueue('qa','same-webhook',{},'order_qa')))
    const id = db.operationId('same-webhook')
    assert.equal((await db.database().query('select count(*) from commerce_operation')).rows[0].count,'1')
    const claims = await Promise.all(Array.from({ length:4 },() => db.claim(id)))
    assert.equal(claims.filter(Boolean).length,1)
    const second = await db.enqueue('qa','second-op',{},'order_qa')
    assert.equal(await db.claim(second),null)
    await db.finish(id,{ okay:true }); assert.ok(await db.claim(second)); await db.finish(second,{ okay:true })
    console.log('PASS additive migration, duplicate webhook storage, concurrent claims and per-order serialization')
    await db.exclusive('qa-outer',() => db.exclusive('qa-inner',() => db.exclusive('qa-outer',async () => true)))
    await assert.rejects(() => db.exclusive('qa-outer',() => db.exclusive('qa-inner',async () => { throw new Error('QA nested failure') })))
    await db.exclusive('qa-outer',async () => true)
    console.log('PASS nested cart/refund locks reuse the connection and release after failure')
    const s = { ...settings.defaults,address:'QA',supportPhone:'QA',grievanceName:'QA',grievanceEmail:'qa@example.invalid',grievancePhone:'QA',damageReportHours:48,refundInitiationDays:3,consumerReviewComplete:true }
    const published = await settings.saveSettings(s,true)
    assert.equal((await settings.publicSettings()).checkoutEnabled,false)
    assert.ok((await db.database().query('select id from commerce_setting where id=$1',[`policy:${published.revision}`])).rows[0])
    await settings.saveSettings({ ...s,address:'Changed draft' })
    assert.equal((await settings.publicSettings()).business.address,'QA')
    const requests = await Promise.all(Array.from({ length:4 },() => requestAfterSale(scope,'order_qa','cus_qa',{ kind:'cancellation',reason:'QA cancellation description' })))
    assert.equal(new Set(requests.map(r => r.id)).size,1)
    await assert.rejects(() => requestAfterSale(scope,'order_qa','other_customer',{ kind:'cancellation',reason:'QA description' }),{ status:404 })
    const pickup = await db.enqueue('pickup','qa-pickup',{},'order_qa'); await db.claim(pickup)
    await assert.rejects(() => decideRequest(scope,'order_qa',{ action:'cancel',request_id:requests[0].id },'qa-owner'),{ status:409 })
    await db.finish(pickup,{ okay:true })
    console.log('PASS draft/public isolation, revision archive, ownership, concurrent requests and pickup/cancellation exclusion')
    let posts = 0, refunded = 0, lost = true
    const keys = []
    global.fetch = async (_url,options) => {
      if (options.method === 'GET') return { ok:true,json:async () => ({ status:'captured',currency:'INR',amount:10000,amount_refunded:refunded }) }
      posts++; keys.push(options.headers['X-Refund-Idempotency'])
      const amount = JSON.parse(options.body).amount
      if (lost) { lost=false; refunded=amount; throw new Error('QA lost response after provider acceptance') }
      return { ok:true,json:async () => ({ id:'rfnd_qa',payment_id:'pay_qa',amount,status:'processed' }) }
    }
    await assert.rejects(() => rz.refundOnce('pay_qa',1000,'stable-qa'))
    const refund = await rz.refundOnce('pay_qa',1000,'stable-qa')
    assert.equal(refund.id,'rfnd_qa');assert.equal(keys[0],keys[1])
    await rz.refundOnce('pay_qa',1000,'stable-qa');assert.equal(posts,2)
    await assert.rejects(() => rz.refundOnce('pay_qa',1001,'stable-qa'),{ status:409 })
    await assert.rejects(() => rz.refundOnce('pay_qa',9999,'over-qa'))
    const creates = async () => { throw new Error('QA lost order response') }
    await assert.rejects(() => rz.persistedOrder('ps_qa',100,creates,async () => []))
    const reconciled = await rz.persistedOrder('ps_qa',100,creates,async () => [{ id:'order_provider_qa',amount:100,currency:'INR',notes:{ medusa_session_id:'ps_qa' } }])
    assert.equal(reconciled.id,'order_provider_qa')
    console.log('PASS refund response loss, stable idempotency, reuse, remaining limit and payment-order restart reconciliation')
    let mutations = 0
    shiprocket.get = async () => ({ data:[] })
    shiprocket.post = async () => { mutations++; throw new Error('No shipping mutation permitted') }
    await assert.rejects(() => createShipping(scope,{ order_id:'order_uncertain',status:'reconcile' }),{ status:409 })
    assert.equal(mutations,0)
    shiprocket.get = async () => ({ data:[{ channel_order_id:'YN-order_uncertain',id:12,shipments:[{ id:22 }] }] })
    await createShipping(scope,{ order_id:'order_uncertain',status:'reconcile' })
    assert.equal((await db.database().query('select data from commerce_shipment where order_id=$1',['order_uncertain'])).rows[0].data.shipmentId,22)
    console.log('PASS uncertain shipping never duplicates; merchant ID reconciliation restores the original booking')
  } finally {
    await db.closeDatabase()
    assert.match(schema,/^commerce_qa_[a-f0-9]{12}$/)
    await admin.query(`drop schema "${schema}" cascade`)
    await admin.end()
    console.log('QA schema removed; production rows unchanged; no live provider actions')
  }
}
main().catch(error => { console.error(error.name,error.message);process.exitCode=1 })
