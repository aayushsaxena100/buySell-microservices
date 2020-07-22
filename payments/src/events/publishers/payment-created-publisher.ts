import { Subject, Publisher, PaymentCreatedEvent } from "@bechna-khareedna/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subject.PaymentCreated;
}