import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { SellItem } from "../../../models/sell-item";
import { OrderCancelledEvent, OrderStatus } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    //create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    //create sell item and save
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const sellItem = SellItem.build({
        price: 12,
        title: "cycle",
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    sellItem.set({orderId});
    await sellItem.save();

    //create fake data object
    //@ts-ignore
    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        sellItem: {
            id: sellItem.id,
        }
    };

    //mock msg.ack
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, sellItem, data, msg, orderId };
};

it('updates sell-item, publishes event and acks msg', async () => {
    const { listener, sellItem, data, msg, orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedSellItem = await SellItem.findById(sellItem.id);

    expect(updatedSellItem?.orderId).toBeNull();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});