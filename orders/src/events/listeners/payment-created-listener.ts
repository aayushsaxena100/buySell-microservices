import { Message } from "node-nats-streaming";
import {
  Subject,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@bechna-khareedna/common";
import { Constants } from "../../constants";
import { Order } from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subject.PaymentCreated;
  queueGroupName = Constants.QueueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, orderId, stripeId } = data;

    const order = await Order.findOne({orderId});

    if(!order){
        throw new Error('Order not found');
    }

    order.set({status: OrderStatus.Complete});

    await order.save();
    
    msg.ack();
  }
}
