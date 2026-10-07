import { MedusaService } from "@medusajs/framework/utils"
import Setting from "./models/setting"
import Operation from "./models/operation"
import Shipment from "./models/shipment"
import Request from "./models/request"
export default class CommerceService extends MedusaService({ Setting, Operation, Shipment, Request }) {}
