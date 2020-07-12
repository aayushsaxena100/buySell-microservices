import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { SellItem } from "../../models/sell-item";
import { OrderStatus } from "../../models/orders";
import { natsWrapper } from "../../nats-wrapper";

const buildSellItem = async () => {
  const sellItem = SellItem.build({
    title: "ps4",
    price: 20,
  });
  await sellItem.save();
  return sellItem;
};

it("cancels an order", async () => {
  //create a sell item
  const sellItem = await buildSellItem();

  const user = global.signin();

  //create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ sellItemId: sellItem.id })
    .expect(201);

  //cancel the order
  const { body: cancelledOrder } = await request(app)
    .patch(`/api/orders/cancel/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it("throws a 404 not found error if order not found or order id is invalid", async () => {
  const user = global.signin();

  //make a req to fetch an order
  await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", user)
    .expect(404);

  await request(app)
    .get("/api/orders/d897asd987as9d7")
    .set("Cookie", user)
    .expect(404);
});

it("throws a 401 not authorized error if user tries to cancel another user's order", async () => {
  //Create a sell item
  const sellItem = await buildSellItem();

  const user1 = global.signin();
  const user2 = global.signin();

  //make a req to create an order
  const { body: order } = await request(app)
    .post("/api/orders/")
    .set("Cookie", user1)
    .send({ sellItemId: sellItem.id })
    .expect(201);

  await request(app)
    .patch(`/api/orders/cancel/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});

it("publish a order cancelled event", async () => {
  //create a sell item
  const sellItem = await buildSellItem();

  const user = global.signin();

  //create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ sellItemId: sellItem.id })
    .expect(201);

  //cancel the order
  const { body: cancelledOrder } = await request(app)
    .patch(`/api/orders/cancel/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
