// Local-only manual QA fixture. No requests are forwarded to commerce providers.
// Run from repository root: node younoya-web/tests/fixtures/storefront-preview.cjs
const http=require('node:http'), fs=require('node:fs'), path=require('node:path')
const root=path.resolve('younoya-web/dist'), origin='http://127.0.0.1:5187'
const bag=[{id:'navratri-shringaar-box::standard',handle:'navratri-shringaar-box',name:'9 Days Navratri Shringaar Box',subtitle:'Nine daily kits',quantity:1,priceNum:1499,image:'/media/navratri/red-kit-600.webp'}]
const address={firstName:'QA Customer',lastName:'',email:'qa@example.invalid',phone:'9999999999',street:'Test address',street2:'',city:'New Delhi',state:'Delhi',pincode:'110001'}
const business={legalName:'YOUNOYA HOUSE OF ASTRO PRIVATE LIMITED',supportEmail:'support@younoya.com',dispatchHours:24,deliveryMinDays:3,deliveryMaxDays:5,damageReportHours:48,refundInitiationDays:7}
let mode='fresh', cart, requests=[]
function reset(next='fresh') {
  mode=next; requests=[]
  cart={id:'cart_QA',region_id:'reg_QA',email:address.email,currency_code:'inr',total:1499,subtotal:1499,
    metadata:{money_unit:'inr-major-v2'},items:[{id:'item_QA',variant_id:'variant_QA',title:bag[0].name,quantity:1,total:1499,thumbnail:bag[0].image}],
    shipping_address:{first_name:address.firstName,address_1:address.street,city:address.city,province:address.state,postal_code:address.pincode,country_code:'in',phone:address.phone}}
  if(next.startsWith('legacy')) { cart.total=1548; cart.metadata.commerce_payment_method='cod'; cart.metadata.cod_fee=49 }
}
reset()
http.createServer(async(req,res)=>{
  const url=new URL(req.url,origin)
  if(url.searchParams.get('image-failure')==='1') mode='image-failure'
  if(mode==='image-failure' && /^\/media\/kalash\/hero-(600|1200)\.webp$/.test(url.pathname)) {res.writeHead(404);return res.end()}
  const json=(value,status=200)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(value))}
  if(url.pathname==='/qa/requests') return json(requests)
  if(url.pathname==='/qa/razorpay.js') {res.setHeader('content-type','text/javascript');return res.end('window.Razorpay=class {constructor(options){this.options=options} on(){} open(){this.options.modal.ondismiss()}}')}
  if(url.pathname.startsWith('/mock-api/')) {
    const route=url.pathname.slice('/mock-api'.length)
    let body={};if(req.method==='POST'){let raw='';for await(const chunk of req)raw+=chunk;try{body=JSON.parse(raw)}catch{return json({message:'Invalid fixture JSON'},400)}}
    requests.push({method:req.method,path:route,payment_method:body.payment_method})
    if(route==='/store/site-config') return json({business,checkoutEnabled:true,policiesPublished:true,policyRevision:'qa-prepaid',storefrontMode:'coming-soon',codEnabled:false,codFee:0,shippingFee:0,currency:'INR',country:'IN'})
    if(route==='/store/regions') return json({regions:[{id:'reg_QA',currency_code:'inr',countries:[{iso_2:'in'}]}]})
    if(route==='/store/products') return json({products:[{handle:url.searchParams.get('handle'),variants:[{id:'variant_QA'}]}]})
    if(route.endsWith('/availability')) return json({purchasable:false,availableQuantity:0,price:5599,currency:'INR'})
    if(route==='/store/navratri') return json({purchasable:true,availableQuantity:50,price:1499,currency:'INR'})
    if(route==='/store/gift-guide/checkout-config') return json({razorpayKeyId:'rzp_test_fixture_only'})
    if(route==='/store/commerce/pincode') return json({city:'New Delhi',state:'Delhi',delivery:{message:'Prepaid orders: same-day delivery in Delhi NCR when ordered by 6 PM, subject to courier confirmation.'}})
    if(route==='/store/commerce/guest-cart') return json({cart,checkout_token:'a'.repeat(64)})
    if(route==='/store/gift-guide/payment-confirm' && req.method==='GET') {
      if(mode==='legacy-completed') return json({owned:true,completed:true,restart_allowed:false,order:{id:'order_QA',display_id:999,total:1548,metadata:{commerce_approval:{payment_method:'cod'}}}})
      if(mode==='legacy-uncertain') return json({owned:true,completed:false,restart_allowed:false,message:'Your previous order attempt needs review. Your bag and address are saved. Contact support before placing another order.'})
      return json({owned:true,completed:false,restart_allowed:mode==='legacy-safe',cart})
    }
    if(route==='/store/carts/cart_QA') {if(req.method==='POST'){cart={...cart,...body,metadata:{...cart.metadata,...body.metadata}}}return json({cart})}
    if(route==='/store/commerce/prepare') {
      if(body.payment_method!=='razorpay') return json({message:'Online payment only'},409)
      cart={...cart,total:1499,metadata:{money_unit:'inr-major-v2',commerce_payment_method:'razorpay',cod_fee:0}}
      return json({cart,payment_method:'razorpay',cod_fee:0,shipping_fee:0})
    }
    if(route==='/store/payment-providers') return json({payment_providers:[{id:'pp_razorpay_razorpay'}]})
    if(route==='/store/payment-collections'){cart.payment_collection={id:'paycol_QA'};return json({payment_collection:cart.payment_collection})}
    if(route==='/store/payment-collections/paycol_QA/payment-sessions') return json({payment_collection:{payment_sessions:[{id:'ps_QA',provider_id:'pp_razorpay_razorpay',data:{id:'order_fixture',amount:149900,money_unit:'inr-major-v2'}}]}})
    return json({message:'No provider call is allowed in this fixture'},404)
  }
  let relative=url.pathname, setup=''
  if(relative.startsWith('/qa/')) {
    reset(relative.slice('/qa/'.length))
    setup=`<script>localStorage.setItem('younoya_cart',${JSON.stringify(JSON.stringify(bag))});sessionStorage.clear();sessionStorage.setItem('yn_checkout_address',${JSON.stringify(JSON.stringify(address))});${mode.startsWith('legacy') ? "sessionStorage.setItem('yn_pending_cod','cart_QA');sessionStorage.setItem('yn_guest_cart_QA','"+'a'.repeat(64)+"');" : ''}history.replaceState({},'', '/checkout');</script>`
    relative='/checkout'
  }
  let file=path.resolve(root,'.'+relative)
  if(!file.startsWith(root+path.sep) && file!==root){res.writeHead(403);return res.end()}
  try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html')}catch{file=path.join(root,'index.html')}
  try{
    let content=fs.readFileSync(file), ext=path.extname(file)
    if(ext==='.js') content=content.toString().replaceAll('https://api.younoya.com',origin+'/mock-api').replaceAll('https://checkout.razorpay.com/v1/checkout.js',origin+'/qa/razorpay.js')
    if(ext==='.html' && setup) content=content.toString().replace('<head>','<head>'+setup)
    res.setHeader('content-type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'})[ext]||'application/octet-stream')
    res.end(content)
  }catch{res.writeHead(404);res.end()}
}).listen(5187,'127.0.0.1',()=>console.log('Isolated storefront QA: '+origin+' (mock providers only)'))
