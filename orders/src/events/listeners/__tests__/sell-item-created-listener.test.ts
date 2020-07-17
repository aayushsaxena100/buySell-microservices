import { SellItemCreatedListener } from "../sell-item-created-listner";
import { natsWrapper } from "../../../nats-wrapper";
import { SellItemCreatedEvent } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { SellItem } from "../../../models/sell-item";

const setup = async () => {
    //Create an instance of the listener
    const listener = new SellItemCreatedListener(natsWrapper.client);
    
    //Create a fake data event
    const data: SellItemCreatedEvent["data"] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'cycle',
        price: 15,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    //Create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it('creates and saves a sell item', async () => {
    const { listener, data, msg } = await setup();

    //Call the onMessage function with data and message object
    await listener.onMessage(data, msg);

    //Write assertions to make sure sell item was created
    const sellItem = await SellItem.findById(data.id);
    expect(sellItem).toBeDefined();
    expect(sellItem?.title).toEqual(data.title);
    expect(sellItem?.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    //Call the onMessage function with data and message object
    await listener.onMessage(data, msg);

    //Write assertions to make sure the msg.ack gets called
    expect(msg.ack).toHaveBeenCalled();
});