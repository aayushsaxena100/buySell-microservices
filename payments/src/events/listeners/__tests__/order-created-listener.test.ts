import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent["data"] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      expiresAt: 'asd',
      userId: mongoose.Types.ObjectId().toHexString(),
      sellItem: {
        id: mongoose.Types.ObjectId().toHexString(),
        price: 10
      }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('saves the order info from event data', async () => {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order?.price).toEqual(data.sellItem.price)
});

it('acks the msg', async () => {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(msg.ack).toHaveBeenCalled();
});