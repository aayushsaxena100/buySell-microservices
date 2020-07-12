import {
  Publisher,
  OrderCreatedEvent,
  Subject,
} from "@bechna-khareedna/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subject.OrderCreated;
}
