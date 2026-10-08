import crypto from 'crypto'
import * as db from '../modules/younoya-commerce/db'
import {checkoutOwner} from '../modules/younoya-commerce/guest'
import {lookupPincode} from '../modules/younoya-commerce/pincode'
jest.mock('../modules/younoya-commerce/db',()=>({...jest.requireActual('../modules/younoya-commerce/db'),database:jest.fn()}))
afterEach(()=>jest.restoreAllMocks())
test('guest ownership requires the exact secret, matching cart, live expiry and no customer account',async()=>{
 const token='a'.repeat(64),hash=crypto.createHash('sha256').update(token).digest('hex')
 let record:any={hash,expires:Date.now()+60000},customer:string|null=null
 const query=jest.fn(async()=>({rows:[{data:record}]}));(db.database as jest.Mock).mockReturnValue({query})
 const req:any={headers:{'x-younoya-checkout-token':token},scope:{resolve:()=>({graph:async()=>({data:[{id:'cart_qa',customer_id:customer}]})})}}
 await expect(checkoutOwner(req,'cart_qa')).resolves.toBe('guest:cart_qa')
 expect(query).toHaveBeenCalledWith(expect.any(String),['guest:cart_qa'])
 req.headers['x-younoya-checkout-token']='b'.repeat(64);await expect(checkoutOwner(req,'cart_qa')).rejects.toThrow('expired')
 req.headers['x-younoya-checkout-token']=token;record.expires=Date.now()-1;await expect(checkoutOwner(req,'cart_qa')).rejects.toThrow('expired')
 record.expires=Date.now()+60000;customer='cus_other';await expect(checkoutOwner(req,'cart_qa')).rejects.toThrow('not found')
 req.auth_context={actor_id:'cus_other'};await expect(checkoutOwner(req,'cart_qa')).resolves.toBe('cus_other')
 customer=null;query.mockRejectedValueOnce(new Error('storage offline'));await expect(checkoutOwner(req,'cart_qa')).rejects.toThrow('offline')
})
test('PIN lookup accepts validated India delivery data, caches it and rejects invalid, ambiguous or failed responses',async()=>{
 const original=global.fetch
 const office={Country:'India',Pincode:'110001',District:'New Delhi',State:'Delhi',DeliveryStatus:'Delivery'}
 const fetcher:jest.Mock=jest.fn(async()=>({ok:true,json:async()=>[{Status:'Success',PostOffice:[office]}]}));global.fetch=fetcher as any
 try{
  await expect(lookupPincode('110001')).resolves.toEqual({pincode:'110001',city:'New Delhi',state:'Delhi',country:'India'})
  await lookupPincode('110001');expect(fetcher).toHaveBeenCalledTimes(1)
  await expect(lookupPincode('../secret')).rejects.toThrow('six-digit')
  fetcher.mockResolvedValueOnce({ok:true,json:async()=>[{Status:'Success',PostOffice:[{...office,Pincode:'110002'},{...office,Pincode:'110002',District:'Other'}]}]})
  await expect(lookupPincode('110002')).rejects.toThrow('several')
  fetcher.mockResolvedValueOnce({ok:true,json:async()=>[{Status:'Error',PostOffice:null}]})
  await expect(lookupPincode('110003')).rejects.toThrow('No address')
  fetcher.mockResolvedValueOnce({ok:false,json:async()=>[]});await expect(lookupPincode('110004')).rejects.toThrow('unavailable')
  fetcher.mockRejectedValueOnce(new Error('timeout'));await expect(lookupPincode('110005')).rejects.toThrow('timeout')
 }finally{global.fetch=original}
})
