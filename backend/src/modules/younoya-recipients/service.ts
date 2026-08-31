import { MedusaService } from "@medusajs/framework/utils"
import GiftRecipient from "./models/gift-recipient"

class YounoyaRecipientsModuleService extends MedusaService({
  GiftRecipient,
}) {}

export default YounoyaRecipientsModuleService
