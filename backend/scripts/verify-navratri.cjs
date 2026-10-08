const assert=require('node:assert/strict'),{createRequire}=require('node:module'),path=require('node:path')
const req=createRequire(path.join(process.cwd(),'package.json'))
exports.default=async({container})=>{
 const {Modules,getLineItemTotals,BigNumber}=req('@medusajs/framework/utils')
 const {database,closeDatabase,toPaise}=req('./src/modules/younoya-commerce/db')
 try{
 const productModule=container.resolve(Modules.PRODUCT),pricing=container.resolve(Modules.PRICING),tax=container.resolve(Modules.TAX)
 const [product]=await productModule.listProducts({handle:'navratri-shringaar-box'},{relations:['variants','images']})
 assert.equal(product.status,'draft');assert.equal(product.variants.length,1);assert.equal(product.variants[0].sku,'YN-NAVRATRI-9D-001');assert.equal(product.images.length,6);assert.equal(product.metadata.navratri_release_approved,false)
 const region=(await container.resolve(Modules.REGION).listRegions({currency_code:'inr'},{relations:['countries']})).find(r=>r.countries.some(c=>c.iso_2==='in'))
 const rows=(await database().query("select pr.id,pr.handle,l.price_set_id from product pr join product_variant v on v.product_id=pr.id and v.deleted_at is null join product_variant_price_set l on l.variant_id=v.id and l.deleted_at is null where pr.deleted_at is null")).rows
 const calculated=await pricing.calculatePrices({id:rows.map(r=>r.price_set_id)},{context:{currency_code:'inr',region_id:region.id}})
 const nav=calculated.find(p=>p.id===rows.find(r=>r.id===product.id).price_set_id)
 assert.equal(nav.calculated_amount,1499);assert.equal(nav.is_calculated_price_tax_inclusive,true)
 assert.equal(calculated.filter(p=>p.id!==nav.id&&p.is_calculated_price_tax_inclusive!==false).length,0)
 const brooch=rows.find(r=>r.handle==='wild-poise')
 const lines=await tax.getTaxLines([{id:'qa_nav',product_id:product.id,unit_price:1499,quantity:1,currency_code:'inr'},{id:'qa_brooch',product_id:brooch.id,unit_price:2499,quantity:1,currency_code:'inr'}],{address:{country_code:'in'}})
 const navLines=lines.filter(l=>l.line_item_id==='qa_nav'),broochLines=lines.filter(l=>l.line_item_id==='qa_brooch')
 assert.equal(navLines.reduce((s,l)=>s+Number(l.rate),0),18);assert.equal(broochLines.some(l=>l.code==='YOUNOYA-NAVRATRI-18'),false)
 const totals=getLineItemTotals({id:'qa_nav',unit_price:new BigNumber(1499),quantity:new BigNumber(1),is_tax_inclusive:true,tax_lines:navLines},{includeTax:true})
 assert.equal(toPaise(totals.total),149900);assert.equal(toPaise(totals.tax_total),22866)
 const discount=getLineItemTotals({id:'qa_discount',unit_price:new BigNumber(1499),quantity:new BigNumber(2),is_tax_inclusive:true,tax_lines:navLines,adjustments:[{amount:299.8,is_tax_inclusive:true}]},{includeTax:true})
 assert.equal(toPaise(discount.total),269820)
 const b=getLineItemTotals({id:'qa_brooch',unit_price:new BigNumber(2499),quantity:new BigNumber(1),is_tax_inclusive:false,tax_lines:broochLines},{includeTax:true})
 assert.equal(toPaise(totals.total)+toPaise(b.total),399800)
 const fiscal=(await database().query('select (select count(*) from payment) as payments,(select count(*) from "order") as orders')).rows[0]
 assert.equal(Number(fiscal.payments),0);assert.equal(Number(fiscal.orders),0)
 console.log('PASS live draft catalogue: one variant, six photos, 1499 inclusive/18% tax, quantity and discounted totals, mixed cart tax isolation, and unchanged zero payment/order counts')
 }finally{await closeDatabase()}
}
