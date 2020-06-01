import mongoose from "mongoose";

interface ISaleItem {
  email: string;
  password: string;
}

interface ISaleItemModel extends mongoose.Model<ISaleItemDoc> {
  build(saleItem: ISaleItem): ISaleItemDoc;
}

interface ISaleItemDoc extends mongoose.Document {
  email: String;
  password: String;
  isVerified: boolean;
}

const saleItemSchema = new mongoose.Schema(
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

saleItemSchema.statics.build = (saleItem: ISaleItemModel) => {
  return new SaleItem(saleItem);
};

const SaleItem = mongoose.model<ISaleItemDoc, ISaleItemModel>(
  "SaleItem",
  saleItemSchema
);

export { SaleItem };
