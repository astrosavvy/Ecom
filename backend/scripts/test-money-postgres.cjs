// Disposable-schema verification. No provider calls or production table mutations.
const assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto')
const {createRequire}=require('node:module')
if(process.env.COMMERCE_QA_ISOLATED!=='1') throw Error('Explicit isolated QA is required')
const runtime=path.resolve(process.env.COMMERCE_QA_RUNTIME||path.join(__dirname,'../.medusa/server'))
const req=createRequire(path.join(runtime,'package.json'))
req('@medusajs/framework/utils').loadEnv('production',runtime)
const {Pool}=req('pg'),admin=new Pool({connectionString:process.env.DATABASE_URL,max:1})
const schema='money_qa_'+crypto.randomBytes(6).toString('hex')
const url=new URL(process.env.DATABASE_URL);url.searchParams.set('options',`-c search_path=${schema}`)
process.env.DATABASE_URL=url.toString();process.env.COMMERCE_LIVE_ENABLED='false'
const build=path.resolve(process.env.COMMERCE_QA_BUILD||path.join(runtime,'src/modules/younoya-commerce'))
const db=require(path.join(build,'db')),money=require(path.join(build,'money-migration'))
async function run(){
 await admin.query(`create schema "${schema}"`)
 try{
  await db.database().query(`
   create table commerce_setting(id text primary key,data jsonb,updated_at timestamptz default now());
   create table commerce_operation(id text primary key);
   create table product(id text primary key,handle text,metadata jsonb,deleted_at timestamptz,updated_at timestamptz);
   create table product_variant(id text primary key,product_id text,deleted_at timestamptz);
   create table product_variant_price_set(price_set_id text,variant_id text,deleted_at timestamptz);
   create table price(id text primary key,price_set_id text,currency_code text,amount numeric,raw_amount jsonb,price_list_id text,min_quantity int,max_quantity int,deleted_at timestamptz,updated_at timestamptz);
   create table cart(id text primary key,metadata jsonb,completed_at timestamptz,deleted_at timestamptz,updated_at timestamptz);
   create table "order"(id text primary key,metadata jsonb,deleted_at timestamptz,created_at timestamptz);
   create table payment_session(id text primary key,data jsonb,deleted_at timestamptz,created_at timestamptz);
   create table payment(id text primary key,data jsonb,deleted_at timestamptz,created_at timestamptz);
   insert into product values('p','wild-poise','{"catalog_source":"younoya-brooch-2026"}',null,now());
   insert into product_variant values('v','p',null);
   insert into product_variant_price_set values('ps','v',null);
   insert into price values('price','ps','inr',249900,'{"value":"249900","precision":20}',null,null,null,null,now());
   insert into cart values('cart','{"kept":"address"}',null,null,now());
   insert into commerce_setting(id,data) values('launch','{"storefrontMode":"shop","supportEmail":"support@younoya.com"}');
   insert into "order" values('historical','{"money_unit":"inr-paise-v1","paid":249900}',null,'2020-01-01');
  `)
  assert.equal((await money.migrateMoney()).converted,1)
  assert.equal(Number((await db.database().query('select amount from price')).rows[0].amount),249900)
  const applied=await Promise.all([money.migrateMoney(true),money.migrateMoney(true)])
  assert.equal(applied.filter(r=>r.alreadyApplied).length,1)
  assert.equal(Number((await db.database().query('select amount from price')).rows[0].amount),2499)
  assert.equal((await db.database().query('select metadata from cart')).rows[0].metadata.commerce_requote_required,true)
  assert.equal((await db.database().query('select metadata from "order"')).rows[0].metadata.paid,249900)
  assert.equal((await money.rollbackMoney()).rolledBack,true)
  assert.equal(Number((await db.database().query('select amount from price')).rows[0].amount),249900)
  assert.deepEqual((await db.database().query('select metadata from cart')).rows[0].metadata,{kept:'address'})
  await db.database().query(`update "order" set metadata='{}'`)
  await assert.rejects(()=>money.migrateMoney(true),/Historical financial/)
  const guest=require(path.join(build,'guest'))
  const secret=await guest.createGuestAccess('cart_qa')
  const stored=(await db.database().query("select data from commerce_setting where id='guest:cart_qa'")).rows[0].data
  assert.equal(stored.hash,crypto.createHash('sha256').update(secret).digest('hex'))
  assert.equal(JSON.stringify(stored).includes(secret),false)
  const requests=await Promise.allSettled(Array.from({length:25},()=>guest.guestRate('qa-only')))
  assert.equal(requests.filter(r=>r.status==='fulfilled').length,20)
  assert.equal(requests.filter(r=>r.status==='rejected'&&r.reason.status===429).length,5)
  console.log('PASS private guest-token hashing and atomic concurrent guest rate limits')
  console.log('PASS PostgreSQL dry-run, concurrent repeat, exact rollback, cart preservation and unchanged historical paid records; unclassified records blocked')
 }finally{await db.closeDatabase();await admin.query(`drop schema "${schema}" cascade`);await admin.end()}
}
run().catch(e=>{console.error(e.message);process.exitCode=1})
