import { deliveryMessage } from '../lib/delivery'
import '../styles/Delivery.css'
export default function DeliveryNotice({ delivery, method = 'razorpay' }) {
  return <div className="delivery-notice" role="status"><p>{deliveryMessage(delivery,method)}</p><small>Festival, weather and unforeseen delays may affect delivery.</small></div>
}
