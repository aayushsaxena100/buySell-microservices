import { Subject } from "./subjects";

export interface SellItemUpdatedEvent {
  subject: Subject.SellItemUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
