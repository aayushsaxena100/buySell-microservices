import request from "supertest";
import { app } from "../../app";
import { SellItem } from "../../models/sell-item";

const buildSellItem = async () => {
  const sellItem = SellItem.build({
    title: "ps4",
    price: 20,
  });
  await sellItem.save();
  return sellItem;
};

it("fetches orders for a particular user", async () => {
  //Create three sell items
  const sellItem1 = await buildSellItem();
  const sellItem2 = await buildSellItem();
  const sellItem3 = await buildSellItem();

  const user1 = global.signin();
  const user2 = global.signin();

  //Create one order as user1
  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ sellItemId: sellItem1.id })
    .expect(201);

  //create 2 orders as user2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ sellItemId: sellItem2.id })
    .expect(201);
  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ sellItemId: sellItem3.id })
    .expect(201);

  //make req to get orders for user2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  //make sure we get the orders only for user2
  expect(response.body.orders.length).toEqual(2);
  expect(response.body.orders[0].id).toEqual(order1.id);
  expect(response.body.orders[1].id).toEqual(order2.id);
  expect(response.body.orders[0].sellItem.id).toEqual(sellItem2.id);
  expect(response.body.orders[1].sellItem.id).toEqual(sellItem3.id);
});
