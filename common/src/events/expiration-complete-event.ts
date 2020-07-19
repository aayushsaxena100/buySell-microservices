import { Subject } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: Subject.ExpirationComplete;
  data: {
    orderId: string;
  };
}
