import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { randomBytes } from "crypto";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  try {
    await natsWrapper.connect(
      "buyAndSell",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("listening on 3000");
  });
};

start();
