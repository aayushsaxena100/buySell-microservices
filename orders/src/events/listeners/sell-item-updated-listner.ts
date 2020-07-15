import {
  Listener,
  SellItemUpdatedEvent,
  Subject,
} from "@bechna-khareedna/common";
import { Message } from "node-nats-streaming";
import { Constants } from "../../constants";
import { SellItem } from "../../models/sell-item";

export class SellItemUpdatedListener extends Listener<SellItemUpdatedEvent> {
  readonly subject = Subject.SellItemUpdated;
  readonly queueGroupName = Constants.QueueGroupName;

  async onMessage(data: SellItemUpdatedEvent["data"], msg: Message) {
    const sellItem = await SellItem.findById(data.id);

    if (!sellItem) {
      throw new Error("Ticket not found");
    }

    const { title, price } = data;
    sellItem.set({ title, price });
    await sellItem.save();

    msg.ack();
  }
}
