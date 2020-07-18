import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/orders";
import { SellItem } from "../../models/sell-item";
import { natsWrapper } from "../../nats-wrapper";

const createSellItem = async () => {
  const sellItem = SellItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "ps4",
    price: 20000,
  });
  await sellItem.save();

  return sellItem;
};

it("returns 404 error if the sell item does not exist", async () => {
  const sellItemId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ sellItemId })
    .expect(404);
});

it("returns 400 error if the sell item is already reserved", async () => {
  //create a sell item
  const sellItem = await createSellItem();

  //create order for the same sell item
  const order = Order.build({
    sellItem,
    userId: "asdasdasd",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  //send a request to order the same sell item and expect an error
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ sellItemId: sellItem.id })
    .expect(400);
});

it("reserves a sell item", async () => {
  //create a sell item
  const sellItem = await createSellItem();

  //create order for the same sell item
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ sellItemId: sellItem.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const sellItem = await createSellItem();

  //create order for the same sell item
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ sellItemId: sellItem.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
