import { Message } from "node-nats-streaming";
import {
  Subject,
  Listener,
  SellItemCreatedEvent,
} from "@bechna-khareedna/common";
import { SellItem } from "../../models/sell-item";
import { Constants } from "../../constants";

export class SellItemCreatedListener extends Listener<SellItemCreatedEvent> {
  readonly subject = Subject.SellItemCreated;
  queueGroupName = Constants.QueueGroupName;

  async onMessage(data: SellItemCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const sellItem = SellItem.build({
      id,
      title,
      price,
    });
    await sellItem.save();

    // todo publish order updated event and listen
    // in sales service to update the sell item to sold
    
    msg.ack();
  }
}
