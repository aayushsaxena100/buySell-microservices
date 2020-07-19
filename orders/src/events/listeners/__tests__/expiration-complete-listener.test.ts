import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { SellItem } from "../../../models/sell-item";
import { Order } from "../../../models/orders";

const setup = async () => {
    //Create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    
    const sellItem = SellItem.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'cycle',
        price: 12
    });
    await sellItem.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        sellItem,
        expiresAt: new Date(),
    });
    await order.save();
    
    //Create a fake data event
    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    //Create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, sellItem, order, data, msg };
};

it('updates the order status to cancelled', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits order cancelled event', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('acks the msg', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});