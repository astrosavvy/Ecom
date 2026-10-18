const createProduct = jest.fn(), updateProduct = jest.fn(), createLevel = jest.fn()
jest.mock('@medusajs/medusa/core-flows',() => ({
  createProductsWorkflow:() => ({run:createProduct}),updateProductsWorkflow:() => ({run:updateProduct}),createInventoryLevelsWorkflow:() => ({run:createLevel}),
}))
jest.mock('../modules/younoya-commerce/settings',() => ({settings:jest.fn()}))
jest.mock('../modules/younoya-commerce/db',() => ({...jest.requireActual('../modules/younoya-commerce/db'),exclusive:jest.fn(async (_key,run) => run())}))
import { Modules } from '@medusajs/framework/utils'
import { prepareKalash,initializeKalashStock } from '../modules/younoya-commerce/kalash-catalog'
import { settings } from '../modules/younoya-commerce/settings'
import { ritualReleased } from '../modules/younoya-commerce/ritual-products'
let product:any,levels:any[]
const products = {listProducts:jest.fn(async () => product ? [product] : []),updateProducts:jest.fn(async (id:string,update:any) => {
  if (id !== product.id || !update) throw new Error('Medusa updateProducts requires an id and update data')
  product={...product,...update}
})}
const inventory = {listInventoryItems:jest.fn(async () => [{id:'i_kalash'}]),listInventoryLevels:jest.fn(async () => levels)}
const scope = {resolve:(key:string) => key === Modules.PRODUCT ? products : inventory}
beforeEach(() => {
  jest.clearAllMocks(); product=null; levels=[]
  ;(settings as jest.Mock).mockResolvedValue({draft:{catalogMoneyVersion:'inr-major-v2',stockLocationId:'sloc_test',salesChannelId:'sc_test'}})
  createProduct.mockImplementation(async ({input}) => {product={...input.products[0],id:'prod_kalash',variants:[{sku:'YN-DIWALI-KALASH-001'}]}; return {result:[product]}})
  updateProduct.mockResolvedValue({})
  createLevel.mockImplementation(async ({input}) => {levels.push(...input.inventory_levels); return {}})
})
test('creates a 5599 INR Standard preview with stock 50 once; later stock adjustments survive reimport',async () => {
  await prepareKalash(scope)
  const input = createProduct.mock.calls[0][0].input.products[0]
  expect(input.variants[0]).toMatchObject({sku:'YN-DIWALI-KALASH-001',manage_inventory:true,allow_backorder:false,prices:[{amount:5599,currency_code:'inr'}]})
  expect(product.metadata).toMatchObject({hsn:'7116',hsn_approved:true,gst_rate:null,gst_rate_approved:false,packaging_approved:false,ritual_release_approved:false,kalash_stock_initialized:true})
  expect(levels[0]).toMatchObject({stocked_quantity:50,location_id:'sloc_test'})
  levels[0].stocked_quantity=27
  levels[0].reserved_quantity=2
  await prepareKalash(scope)
  expect(createProduct).toHaveBeenCalledTimes(1); expect(createLevel).toHaveBeenCalledTimes(1)
  expect(levels[0].stocked_quantity).toBe(27)
  expect(levels[0].reserved_quantity).toBe(2)
})
test('does not reset missing initialized stock or overwrite a foreign product',async () => {
  await expect(initializeKalashStock(scope,{metadata:{kalash_stock_initialized:true}},'sloc_test')).rejects.toThrow('do not reset stock')
  product={id:'foreign',metadata:{},variants:[]}
  await expect(prepareKalash(scope)).rejects.toThrow('unrelated')
  expect(createProduct).not.toHaveBeenCalled(); expect(updateProduct).not.toHaveBeenCalled()
})
test('Kalash cannot inherit Navratri approval or bypass missing tax/packaging; old Navratri remains compatible',() => {
  const kalash={status:'published',handle:'diwali-wealth-kalash',metadata:{product_kind:'ritual-box',navratri_release_approved:true}}
  expect(ritualReleased(kalash)).toBe(false)
  expect(ritualReleased({...kalash,metadata:{ritual_release_approved:true,gst_rate_approved:true,gst_rate:3}})).toBe(false)
  expect(ritualReleased({...kalash,metadata:{ritual_release_approved:true,gst_rate_approved:true,gst_rate:3,packaging_approved:true}})).toBe(true)
  expect(ritualReleased({status:'published',handle:'navratri-shringaar-box',metadata:{navratri_release_approved:true}})).toBe(true)
  expect(ritualReleased({status:'draft',handle:'diwali-wealth-kalash',metadata:{ritual_release_approved:true}})).toBe(false)
})
