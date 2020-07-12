import {
  Publisher,
  OrderCancelledEvent,
  Subject,
} from "@bechna-khareedna/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subject.OrderCancelled;
}
