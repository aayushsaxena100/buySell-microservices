import { SellItemUpdatedListener } from "../sell-item-updated-listner";
import { natsWrapper } from "../../../nats-wrapper";
import { SellItemUpdatedEvent } from "@bechna-khareedna/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { SellItem } from "../../../models/sell-item";

const setup = async () => {
    //Create an instance of the listener
    const listener = new SellItemUpdatedListener(natsWrapper.client);
    
    //Create and save a sell item
    const sellItem = SellItem.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'cycle',
        price: 15,
    });
    await sellItem.save();

    //Create a fake data event
    const data: SellItemUpdatedEvent["data"] = {
        version: sellItem.version + 1,
        id: sellItem.id,
        title: 'cycle 2',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        orderId: null
    };

    //Create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, sellItem, data, msg };
};

it('finds, updates and saves a sell item', async () => {
    const { listener, sellItem, data, msg } = await setup();

    //Call the onMessage function with data and message object
    await listener.onMessage(data, msg);

    //fetch the updated sell item
    const updatedSellItem = await SellItem.findById(sellItem.id);
    
    //Write assertions to make sure sell item was created
    expect(updatedSellItem).toBeDefined();
    expect(updatedSellItem?.title).toEqual(data.title);
    expect(updatedSellItem?.price).toEqual(data.price);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    //Call the onMessage function with data and message object
    await listener.onMessage(data, msg);

    //Write assertions to make sure the msg.ack gets called
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if version number is skipped', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try{
        await listener.onMessage(data, msg);
    } catch(err) {}

    expect(msg.ack).not.toHaveBeenCalled();
});