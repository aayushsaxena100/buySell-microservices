import { Listener, OrderCancelledEvent, Subject, OrderStatus } from "@bechna-khareedna/common";
import { Message } from "node-nats-streaming";
import { Constants } from "../../constants";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subject.OrderCancelled;
    readonly queueGroupName = Constants.QueueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if(!order){
            throw new Error('order not found');
        }

        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    };
};