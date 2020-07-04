import {
  Publisher,
  SellItemCreatedEvent,
  Subject,
} from "@bechna-khareedna/common";

export class SellItemCreatedPublisher extends Publisher<SellItemCreatedEvent> {
  readonly subject = Subject.SellItemCreated;
}
