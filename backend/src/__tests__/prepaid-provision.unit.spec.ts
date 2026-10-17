import path from 'path'
import { Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'
jest.mock('../modules/younoya-commerce/settings',() => ({settings:jest.fn(),saveSettings:jest.fn()}))
jest.mock('@medusajs/medusa/core-flows',() => ({
  createShippingOptionsWorkflow:jest.fn(),linkSalesChannelsToStockLocationWorkflow:jest.fn(),updateRegionsWorkflow:jest.fn(),
}))
import { settings,saveSettings } from '../modules/younoya-commerce/settings'
import { linkSalesChannelsToStockLocationWorkflow,updateRegionsWorkflow } from '@medusajs/medusa/core-flows'
import { provision } from '../modules/younoya-commerce/provision'
const {validateRule} = require(path.join(path.dirname(require.resolve('@medusajs/fulfillment')),'utils/utils.js'))

test.each([true,false])('COD cutover supplies valid complete Medusa rules (existing visibility: %s)',async existing => {
  jest.clearAllMocks()
  ;(settings as jest.Mock).mockResolvedValue({draft:{stockLocationId:'sloc_1',salesChannelId:'sc_1',pickupName:'warehouse',pickupAddress:'Saved address',pickupPincode:'110024'}})
  const rules = existing ? [{id:'rule_cod',attribute:'enabled_in_store',operator:'eq',value:'true'}] : []
  const fulfillment = {
    listShippingProfiles:jest.fn().mockResolvedValue([{id:'sp_1'}]),
    listFulfillmentSets:jest.fn().mockResolvedValue([{id:'set_1',service_zones:[{id:'zone_1'}]}]),
    listShippingOptions:jest.fn(async ({name}) => name === 'Younoya COD handling' ? [{id:'cod_1'}] : [{id:'prepaid_1'}]),
    listShippingOptionRules:jest.fn().mockResolvedValue(rules),
    updateShippingOptionRules:jest.fn(async rule => {validateRule(rule);return rule}),
    createShippingOptionRules:jest.fn(async rule => {validateRule(rule);return rule}),
  }
  const updateRegion=jest.fn().mockResolvedValue({}),linkStock=jest.fn().mockResolvedValue({})
  ;(updateRegionsWorkflow as unknown as jest.Mock).mockReturnValue({run:updateRegion})
  ;(linkSalesChannelsToStockLocationWorkflow as unknown as jest.Mock).mockReturnValue({run:linkStock})
  const scope={resolve:(key:string) => ({
    [Modules.FULFILLMENT]:fulfillment,[Modules.REGION]:{listRegions:async()=>[{id:'reg_1',countries:[{iso_2:'in'}]}]},
    [Modules.PAYMENT]:{listPaymentProviders:async()=>[{id:'pp_razorpay_razorpay'},{id:'pp_system_default'}]},
    [ContainerRegistrationKeys.LINK]:{create:async()=>{}},[ContainerRegistrationKeys.QUERY]:{},
  })[key]}
  expect(await provision(scope)).toEqual({shippingOptionId:'prepaid_1',codShippingOptionId:''})
  const mutation=existing ? fulfillment.updateShippingOptionRules : fulfillment.createShippingOptionRules
  expect(mutation).toHaveBeenCalledWith(expect.objectContaining({attribute:'enabled_in_store',operator:'eq',value:'false'}))
  expect(updateRegion).toHaveBeenCalledWith({input:{selector:{id:'reg_1'},update:{payment_providers:['pp_razorpay_razorpay']}}})
  expect(saveSettings).toHaveBeenCalledWith(expect.objectContaining({shippingOptionId:'prepaid_1',codShippingOptionId:''}))
})
