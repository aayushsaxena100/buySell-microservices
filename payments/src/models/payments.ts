import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PaymentAttributes {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string;
    stripeId: string;
    version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc>{
    build(attrs: PaymentAttributes): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttributes) => {
    return new Payment(attrs);
};

paymentSchema.statics.findByIdAndPreviousVersion = (id: string, version: number) => {
    return Payment.findOne({
        _id: id,
        version: version - 1
    });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };