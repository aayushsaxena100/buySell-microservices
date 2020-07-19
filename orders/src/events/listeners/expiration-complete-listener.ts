import { Message } from "node-nats-streaming";
import {
  Subject,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@bechna-khareedna/common";
import { Order } from "../../models/orders";
import { Constants } from "../../constants";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subject.ExpirationComplete;
  queueGroupName = Constants.QueueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('sellItem');

    if(!order){
        throw new Error('Order not found');
    }

    if(order.status === OrderStatus.Complete){
      return msg.ack();
    }
    
    order.set({
        status: OrderStatus.Cancelled
    });
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        sellItem: {
            id: order.sellItem.id
        }
    });

    msg.ack();
  }
}
