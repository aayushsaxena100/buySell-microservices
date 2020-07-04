import {
  Publisher,
  SellItemUpdatedEvent,
  Subject,
} from "@bechna-khareedna/common";

export class SellItemUpdatedPublisher extends Publisher<SellItemUpdatedEvent> {
  readonly subject = Subject.SellItemUpdated;
}
