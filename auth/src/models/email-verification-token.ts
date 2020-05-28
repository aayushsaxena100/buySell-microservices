import mongoose from "mongoose";

// An interface that describes
// the properties that are required to create new user

interface IEmailVerificationToken {
  userId: string;
  token: string;
}

//An interface that describes
//the properties that a user model has

interface IEmailVerificationTokenModel
  extends mongoose.Model<IEmailVerificationTokenDoc> {
  build(user: IEmailVerificationToken): IEmailVerificationTokenDoc;
}

// An interface that describes the properties
// of a User document

interface IEmailVerificationTokenDoc extends mongoose.Document {
  userId: string;
  token: string;
}

const emailVerificationTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 60 },
});

emailVerificationTokenSchema.statics.build = (
  token: IEmailVerificationToken
) => {
  return new EmailVerificationToken(token);
};

const EmailVerificationToken = mongoose.model<
  IEmailVerificationTokenDoc,
  IEmailVerificationTokenModel
>("EmailVerificationTokenModel", emailVerificationTokenSchema);

export { EmailVerificationToken };
