import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
      id: order.id,
      version: 1,
      sellItem: {
        id: mongoose.Types.ObjectId().toHexString(),
      }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('updates order status to cancelled', async () => {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('acks the msg', async () => {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});