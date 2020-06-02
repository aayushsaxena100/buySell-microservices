import mongoose from "mongoose";
import { Password } from "../utilities/password";

// An interface that describes
// the properties that are required to create new user

interface IUser {
  email: string;
  password: string;
}

//An interface that describes
//the properties that a user model has

interface UserModel extends mongoose.Model<IUserDoc> {
  build(user: IUser): IUserDoc;
}

// An interface that describes the properties
// of a User document

interface IUserDoc extends mongoose.Document {
  email: String;
  password: String;
  isVerified: boolean;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.getHash(this.get("password"));
    this.set("password", hashedPassword);
  }

  done();
});

userSchema.statics.build = (user: IUser) => {
  return new User(user);
};

const User = mongoose.model<IUserDoc, UserModel>("User", userSchema);

export { User };
