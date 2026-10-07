import { Pool, type PoolClient } from "pg"
import crypto from "crypto"
import { AsyncLocalStorage } from "async_hooks"

let pool: Pool
let lockPool: Pool
const lockContext = new AsyncLocalStorage<PoolClient>()
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Commerce database is not configured")
  return pool ||= new Pool({ connectionString: process.env.DATABASE_URL, max: 2,
    connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000 })
}
export async function exclusive<T>(key: string, run: () => Promise<T>): Promise<T> {
  if (!process.env.DATABASE_URL) throw new Error("Commerce database is not configured")
  const nested = lockContext.getStore()
  if (nested) return locked(nested,key,run)
  lockPool ||= new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 15000, idleTimeoutMillis: 10000 })
  const client = await lockPool.connect()
  try { return await lockContext.run(client,() => locked(client,key,run)) }
  finally { client.release() }
}
async function locked<T>(client: PoolClient, key: string, run: () => Promise<T>): Promise<T> {
  await client.query("select pg_advisory_lock(hashtextextended($1,0))",[key])
  try { return await run() }
  finally { await client.query("select pg_advisory_unlock(hashtextextended($1,0))",[key]) }
}
export async function transaction<T>(key: string, run: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await database().connect()
  try {
    await client.query("begin")
    await client.query("select pg_advisory_xact_lock(hashtextextended($1, 0))", [key])
    const result = await run(client)
    await client.query("commit")
    return result
  } catch (error) { await client.query("rollback"); throw error }
  finally { client.release() }
}
export const operationId = (key: string) => `cop_${crypto.createHash("sha256").update(key).digest("hex").slice(0, 40)}`
export async function enqueue(kind: string, key: string, payload: any, orderId = "") {
  const id = operationId(key)
  await database().query(`insert into commerce_operation (id, kind, order_id, payload) values ($1,$2,$3,$4)
    on conflict (id) do nothing`, [id, kind, orderId, JSON.stringify(payload)])
  return id
}
export async function operations(orderId: string) {
  return (await database().query(`select id,kind,status,error,created_at,updated_at,result from commerce_operation
    where order_id=$1 order by created_at desc limit 50`, [orderId])).rows
}
export async function claim(id: string) {
  const row = (await database().query("select * from commerce_operation where id=$1", [id])).rows[0]
  if (!row) return null
  return transaction(`commerce:${row.order_id || id}`, async client => {
    const locked = (await client.query("select * from commerce_operation where id=$1 for update", [id])).rows[0]
    if (!["queued", "reconcile"].includes(locked.status)) return null
    const busy = await client.query(`select id from commerce_operation where order_id=$1 and status='processing' and id<>$2`, [row.order_id || id, id])
    if (busy.rowCount) return null
    await client.query("update commerce_operation set status='processing',updated_at=now() where id=$1", [id])
    return locked
  })
}
export async function finish(id: string, result: any, status = "complete", error: string | null = null) {
  await database().query("update commerce_operation set status=$2,result=$3,error=$4,updated_at=now() where id=$1", [id,status,JSON.stringify(result || {}),error])
}
export class CommerceError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}
export function minor(value: unknown) {
  const amount = Number(value && typeof value === "object" && "value" in value ? (value as any).value : value)
  if (!Number.isSafeInteger(amount) || amount < 0) throw new CommerceError("Invalid INR amount")
  return amount
}
export const rupees = (value: unknown) => minor(value) / 100
export async function closeDatabase() { if (pool) await pool.end(); if (lockPool) await lockPool.end() }
