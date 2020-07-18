import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { SellItem } from "../../../models/sell-item";
import { OrderCreatedEvent, OrderStatus } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    //create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    //create sell item and save
    const sellItem = SellItem.build({
        price: 12,
        title: "cycle",
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await sellItem.save();

    //create fake data object
    //@ts-ignore
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'asdd',
        version: 0,
        sellItem: {
            id: sellItem.id,
            price: sellItem.price
        }
    };

    //mock msg.ack
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, sellItem, data, msg };
};

it('sets the orderId of sell Item', async () => {
    const { listener, sellItem, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedSellItem = await SellItem.findById(sellItem.id);

    expect(updatedSellItem?.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a sell item updated event', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});