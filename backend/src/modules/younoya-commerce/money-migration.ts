import brooches from '../younoya-astro/data/brooches.json'
import { CommerceError, transaction } from './db'
const version = 'inr-major-v2'
export function classifyPrice(row: any) {
  if (row.metadata?.money_unit === version) return { id:row.id, action:'keep', amount:Number(row.amount) }
  const known = brooches.find(p => p.handle === row.handle)
  if (row.metadata?.catalog_source !== 'younoya-brooch-2026' || !known || row.price_list_id || row.min_quantity || row.max_quantity)
    throw new CommerceError(`Unclassified catalogue price ${row.id}; review required`,409)
  if (Number(row.amount) === known.price * 100) return { id:row.id, action:'convert', amount:known.price }
  if (Number(row.amount) === known.price) return { id:row.id, action:'keep', amount:known.price }
  throw new CommerceError(`Edited price ${row.id} requires explicit owner classification`,409)
}
export async function migrateMoney(apply = false) {
  return transaction('commerce:money-migration',async client => {
    if (process.env.COMMERCE_LIVE_ENABLED === 'true') throw new CommerceError('Disable checkout before migrating')
    await client.query('lock table price,product,payment_session,payment,"order",cart,commerce_operation in share row exclusive mode')
    const journal = (await client.query("select data from commerce_setting where id='money:inr-major-v2'")).rows[0]?.data
    if (journal?.status === 'applied') return { alreadyApplied:true, converted:journal.converted }
    // No assumptions about existing paid records. Reviewed historical unit markers are required.
    const unknown = (await client.query(`select 'order' as kind,id from "order" where deleted_at is null and
      coalesce(metadata->>'money_unit',metadata->'commerce_approval'->>'money_unit','') not in ('inr-major-v2','inr-paise-v1')
      union all select 'payment_session',id from payment_session where deleted_at is null and coalesce(data->>'money_unit','') not in ('inr-major-v2','inr-paise-v1')
      union all select 'payment',id from payment where deleted_at is null and coalesce(data->>'money_unit','') not in ('inr-major-v2','inr-paise-v1')`)).rows
    if (unknown.length) throw new CommerceError('Historical financial records require a reviewed unit manifest before migration',409)
    const rows = (await client.query(`select p.*,pr.handle,pr.metadata,pr.id as product_id from price p
      join product_variant_price_set l on l.price_set_id=p.price_set_id and l.deleted_at is null
      join product_variant v on v.id=l.variant_id and v.deleted_at is null
      join product pr on pr.id=v.product_id and pr.deleted_at is null
      where p.deleted_at is null and p.currency_code='inr' order by p.id`)).rows
    const changes = rows.map(classifyPrice)
    const report = { prices:changes, converted:changes.filter(p=>p.action==='convert').length, financialRecordsRescaled:0 }
    if (!apply) return report
    const products = (await client.query("select id,metadata from product where id=any($1)",[[...new Set(rows.map(r=>r.product_id))]])).rows
    const carts = (await client.query('select id,metadata from cart where completed_at is null and deleted_at is null')).rows
    const launch = (await client.query("select data from commerce_setting where id='launch'")).rows[0]?.data || null
    await client.query(`insert into commerce_setting(id,data) values ('money:inr-major-v2',$1)
      on conflict(id) do update set data=$1,updated_at=now()`,[JSON.stringify({status:'applied',converted:report.converted,prices:rows,products,carts,launch,at:new Date().toISOString()})])
    for (const change of changes) if (change.action==='convert') await client.query(`update price set amount=$2::numeric,
      raw_amount=jsonb_set(raw_amount,'{value}',to_jsonb(($2::numeric)::text)),updated_at=now() where id=$1`,[change.id,change.amount])
    for (const product of products) await client.query("update product set metadata=coalesce(metadata,'{}') || $2::jsonb,updated_at=now() where id=$1",[product.id,JSON.stringify({money_unit:version})])
    for (const cart of carts) await client.query("update cart set metadata=coalesce(metadata,'{}') || '{\"commerce_requote_required\":true}',updated_at=now() where id=$1",[cart.id])
    await client.query(`insert into commerce_setting(id,data) values ('launch',$1)
      on conflict(id) do update set data=commerce_setting.data || $1::jsonb,updated_at=now()`,[JSON.stringify({catalogMoneyVersion:version,storefrontMode:'coming-soon'})])
    return report
  })
}
export async function rollbackMoney() {
  return transaction('commerce:money-migration',async client => {
    if (process.env.COMMERCE_LIVE_ENABLED === 'true') throw new CommerceError('Disable checkout before rollback')
    await client.query('lock table price,product,payment_session,payment,"order",cart,commerce_operation in share row exclusive mode')
    const data = (await client.query("select data from commerce_setting where id='money:inr-major-v2'")).rows[0]?.data
    if (!data || data.status !== 'applied') return {rolledBack:false}
    if((await client.query("select id from commerce_setting where id='navratri:tax-basis-v1'")).rowCount)
      throw new CommerceError('Restore reviewed tax preferences and regional prices before rolling back money units',409)
    if ((await client.query('select id from payment_session where created_at > $1 union all select id from "order" where created_at > $1',[data.at])).rowCount)
      throw new CommerceError('New financial activity exists; rollback requires manual reconciliation',409)
    for (const row of data.prices) {
      const current=(await client.query('select amount from price where id=$1',[row.id])).rows[0]
      const expected=classifyPrice(row).amount
      if (!current || Number(current.amount)!==expected) throw new CommerceError('A price changed after migration; rollback blocked',409)
      await client.query('update price set amount=$2,raw_amount=$3,updated_at=now() where id=$1',[row.id,row.amount,JSON.stringify(row.raw_amount)])
    }
    for(const product of data.products) await client.query('update product set metadata=$2 where id=$1',[product.id,JSON.stringify(product.metadata)])
    for(const cart of data.carts) await client.query('update cart set metadata=$2 where id=$1',[cart.id,JSON.stringify(cart.metadata)])
    if(data.launch) await client.query("update commerce_setting set data=$1 where id='launch'",[JSON.stringify(data.launch)])
    else await client.query("update commerce_setting set data=data - 'catalogMoneyVersion' where id='launch'")
    await client.query("update commerce_setting set data=jsonb_set(data,'{status}','\"rolled_back\"') where id='money:inr-major-v2'")
    return {rolledBack:true}
  })
}
