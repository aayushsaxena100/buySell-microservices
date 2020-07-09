import mongoose from "mongoose";
import { Order, OrderStatus } from "./orders";

interface SellItemAttributes {
  title: string;
  price: number;
}

export interface SellItemDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface SellItemModel extends mongoose.Model<SellItemDoc> {
  build(attrs: SellItemAttributes): SellItemDoc;
}

const sellItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

sellItemSchema.statics.build = (attrs: SellItemAttributes) => {
  return new SellItem(attrs);
};

sellItemSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    sellItem: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const SellItem = mongoose.model<SellItemDoc, SellItemModel>(
  "SellItem",
  sellItemSchema
);

export { SellItem };
