import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { SellItem } from "../../models/sell-item";

const buildSellItem = async () => {
  const sellItem = SellItem.build({
    title: "ps4",
    price: 20,
  });
  await sellItem.save();
  return sellItem;
};

it("fetches the order", async () => {
  //Create a sell item
  const sellItem = await buildSellItem();

  const user = global.signin();

  //make req to create an order with the created sell item
  const { body: order } = await request(app)
    .post("/api/orders/")
    .set("Cookie", user)
    .send({ sellItemId: sellItem.id })
    .expect(201);

  //make a req to fetch this order
  const { body: orderReceived } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(order.id).toEqual(orderReceived.id);
});

it("throws a 404 not found error if order not found or orderId is invalid", async () => {
  const user = global.signin();

  //make a req to fetch this order
  await request(app)
    .get(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", user)
    .expect(404);

  await request(app)
    .get("/api/orders/d897asd987as9d7")
    .set("Cookie", user)
    .expect(404);
});

it("throws a 401 not authorized error if user tries to fetch another user's order", async () => {
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});
