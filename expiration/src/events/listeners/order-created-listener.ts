import {OrderCreatedEvent, Listener, Subject} from "@bechna-khareedna/common"
import { Message } from "node-nats-streaming";
import { Constants } from "../../constants";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subject.OrderCreated;
    readonly queueGroupName = Constants.QueueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        
        await expirationQueue.add({
            orderId: data.id
        },{
            delay: delay
        });

        msg.ack();
    }
}