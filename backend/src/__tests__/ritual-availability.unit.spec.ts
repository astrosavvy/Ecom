jest.mock('../modules/younoya-commerce/settings',() => ({publicSettings:jest.fn(),settings:jest.fn()}))
jest.mock('../modules/younoya-astro/offers',() => ({storefrontSalesChannel:jest.fn(async () => 'sc_test')}))
jest.mock('@medusajs/framework/utils',() => ({...jest.requireActual('@medusajs/framework/utils'),getVariantAvailability:jest.fn()}))
import { getVariantAvailability } from '@medusajs/framework/utils'
import { publicSettings,settings } from '../modules/younoya-commerce/settings'
import { ritualAvailability,requireReleasedItems } from '../modules/younoya-commerce/ritual-products'
let product:any
const graph=jest.fn()
const scope={resolve:() => ({graph})}
beforeEach(() => {
  jest.clearAllMocks()
  ;(publicSettings as jest.Mock).mockResolvedValue({checkoutEnabled:true})
  ;(settings as jest.Mock).mockResolvedValue({draft:{variants:[{id:'v_test',hsn:'7116'}],parcels:[{variantIds:['v_test']}]}})
  ;(getVariantAvailability as jest.Mock).mockResolvedValue({v_test:{availability:50}})
  product={id:'p_test',handle:'navratri-shringaar-box',status:'published',metadata:{navratri_release_approved:true},
    variants:[{id:'v_test',sku:'YN-NAVRATRI-9D-001',manage_inventory:true,allow_backorder:false,prices:[{currency_code:'inr',amount:1499}]}]}
  graph.mockImplementation(async () => ({data:[product]}))
})
test('Navratri keeps its approved stock and price through the shared endpoint',async () => {
  expect(await ritualAvailability(scope,'navratri-shringaar-box')).toEqual({purchasable:true,availableQuantity:50,price:1499,currency:'INR'})
  product.variants[0].prices[0].amount=149900
  expect((await ritualAvailability(scope,'navratri-shringaar-box')).purchasable).toBe(false)
})
test('Kalash stock does not enable checkout without publication, rate, approval and a configured parcel',async () => {
  product.handle='diwali-wealth-kalash';product.variants[0].sku='YN-DIWALI-KALASH-001';product.variants[0].prices[0].amount=5599
  expect((await ritualAvailability(scope,product.handle)).purchasable).toBe(false)
  product.metadata={ritual_release_approved:true,gst_rate_approved:true,gst_rate:0,packaging_approved:true}
  expect((await ritualAvailability(scope,product.handle)).availableQuantity).toBe(50)
  ;(getVariantAvailability as jest.Mock).mockResolvedValueOnce({v_test:{availability:0}})
  expect(await ritualAvailability(scope,product.handle)).toMatchObject({purchasable:false,availableQuantity:0})
  ;(settings as jest.Mock).mockResolvedValue({draft:{variants:[{id:'v_test',hsn:'7116'}],parcels:[]}})
  expect((await ritualAvailability(scope,product.handle)).purchasable).toBe(false)
  product.status='draft'
  expect((await ritualAvailability(scope,product.handle)).purchasable).toBe(false)
})
test('mixed/customer cart preparation cannot bypass an unreleased line',async () => {
  graph.mockResolvedValue({data:[{id:'v_a',product:{status:'published',handle:'wild-poise',metadata:{}}},
    {id:'v_b',product:{status:'draft',handle:'diwali-wealth-kalash',metadata:{}}}]})
  await expect(requireReleasedItems(scope,[{variant_id:'v_a'},{variant_id:'v_b'}])).rejects.toThrow('not available')
  await expect(requireReleasedItems(scope,[{variant_id:'v_a'}])).resolves.toBeUndefined()
  await expect(ritualAvailability(scope,'unknown')).rejects.toThrow('not found')
})
