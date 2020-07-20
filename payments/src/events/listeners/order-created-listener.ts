import { Listener, OrderCreatedEvent, Subject } from "@bechna-khareedna/common";
import { Message } from "node-nats-streaming";
import { Constants } from "../../constants";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subject.OrderCreated;
    readonly queueGroupName = Constants.QueueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.sellItem.price,
            status: data.status,
            userId: data.userId
        });
        await order.save();

        msg.ack();
    }    
}