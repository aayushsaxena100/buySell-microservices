import { Subject, Publisher, ExpirationCompleteEvent } from "@bechna-khareedna/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subject.ExpirationComplete;
}