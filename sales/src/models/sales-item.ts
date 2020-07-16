import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ISalesItem {
  title: string;
  price: number;
  userId: string;
}

interface ISalesItemModel extends mongoose.Model<ISalesItemDoc> {
  build(salesItem: ISalesItem): ISalesItemDoc;
}

interface ISalesItemDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
}

const salesItemSchema = new mongoose.Schema(
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

salesItemSchema.set("versionKey", "version");
salesItemSchema.plugin(updateIfCurrentPlugin);

salesItemSchema.statics.build = (saleItem: ISalesItemModel) => {
  return new SalesItem(saleItem);
};

const SalesItem = mongoose.model<ISalesItemDoc, ISalesItemModel>(
  "SaleItem",
  salesItemSchema
);

export { SalesItem };
