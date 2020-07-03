import { Subject } from "./subjects";

export interface SellItemCreatedEvent {
  subject: Subject.SellItemCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
