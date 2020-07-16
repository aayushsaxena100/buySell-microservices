import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { SellItemCreatedListener } from "./events/listeners/sell-item-created-listner";
import { SellItemUpdatedListener } from "./events/listeners/sell-item-updated-listner";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL not defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID not defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID not defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    const sellItemCreatedListener = new SellItemCreatedListener(
      natsWrapper.client
    ).listen();
    const sellItemUpdatedListener = new SellItemUpdatedListener(
      natsWrapper.client
    ).listen();

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