import { commerceCustomer } from '../api/utils/commerce'
import { getAdminRole, readStaffWriteAdmin } from '../api/utils/roles'
function response() {
  const res: any={ code:200,body:null }
  res.status=(code: number) => { res.code=code;return res }
  res.json=(body: any) => { res.body=body;return res }
  return res
}
test('unregistered customer identity cannot query another customer or all orders',() => {
  expect(() => commerceCustomer({ auth_context:{} } as any)).toThrow('Sign in')
  expect(commerceCustomer({ auth_context:{ actor_id:'cus_qa' } } as any)).toBe('cus_qa')
})
test('support can read commerce operations but cannot submit writes; missing staff fails closed',async () => {
  const req: any={ method:'GET',auth_context:{ actor_id:'user_qa' },scope:{ resolve:() => ({ listUsers:async () => [{ metadata:{role:'support'} }] }) } }
  const next=jest.fn(), res=response()
  await readStaffWriteAdmin(req,res,next)
  expect(next).toHaveBeenCalledTimes(1)
  req.method='POST'; await readStaffWriteAdmin(req,res,next)
  expect(res.code).toBe(403);expect(next).toHaveBeenCalledTimes(1)
  req.scope.resolve=() => ({ listUsers:async () => [] })
  expect(await getAdminRole(req)).toBeNull()
})
