import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./orders";

interface SellItemAttributes {
  id: string;
  title: string;
  price: number;
}

export interface SellItemDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface SellItemModel extends mongoose.Model<SellItemDoc> {
  build(attrs: SellItemAttributes): SellItemDoc;
  findByIdAndPreviousVersion(data: {id: string, version: number}): Promise<SellItemDoc | null>;
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

sellItemSchema.set('versionKey', 'version');
sellItemSchema.plugin(updateIfCurrentPlugin);

sellItemSchema.statics.build = (attrs: SellItemAttributes) => {
  return new SellItem({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

sellItemSchema.statics.findByIdAndPreviousVersion = (data: {id: string, version: number}) => {
  return SellItem.findOne({
    _id: data.id,
    version: data.version - 1
  });
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
