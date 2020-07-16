import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ISellItem {
  title: string;
  price: number;
  userId: string;
}

interface ISellItemModel extends mongoose.Model<ISellItemDoc> {
  build(sellItem: ISellItem): ISellItemDoc;
}

interface ISellItemDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

const sellItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(roc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

sellItemSchema.set("versionKey", "version");
sellItemSchema.plugin(updateIfCurrentPlugin);

sellItemSchema.statics.build = (sellItem: ISellItemModel) => {
  return new SellItem(sellItem);
};

const SellItem = mongoose.model<ISellItemDoc, ISellItemModel>(
  "SellItem",
  sellItemSchema
);

export { SellItem };
