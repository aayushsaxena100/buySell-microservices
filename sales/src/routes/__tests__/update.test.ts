import request from "supertest";
import { app } from "../../app";
import { createDocumentId } from "../../utility/mongoose-utility";
import { SellItem } from "../../models/sell-item";
import mongoose from "mongoose";

it("returns a status of 401 if user not authenticated", async () => {
  const sellItemId = createDocumentId();

  await request(app)
    .put(`/api/sales/items/${sellItemId}`)
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(401);
});

it("returns a status of 404 if no item on sale with provided id", async () => {
  const sellItemId = createDocumentId();

  await request(app)
    .put(`/api/sales/items/${sellItemId}`)
    .set("Cookie", global.signin())
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(404);
});

it("returns a status of 401 if user does not own the item", async () => {
  const response = await request(app)
    .post("/api/sales/items")
    .set("Cookie", global.signin())
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/sales/items/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Blah Blah",
      price: 100,
    })
    .expect(401);
});

it("returns a status of 400 if invalid title or price is provided", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/sales/items")
    .set("Cookie", cookie)
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Blah Blah",
      price: -10,
    })
    .expect(400);

  await request(app)
    .put(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -10,
    })
    .expect(400);
});

it("updates sale item if valid title and price is provided", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/sales/items")
    .set("Cookie", cookie)
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "New title",
      price: 15,
    })
    .expect(200);

  const sellItemResponse = await request(app)
    .get(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(sellItemResponse.body.title).toEqual("New title");
  expect(sellItemResponse.body.price).toEqual(15);
});

it('throws an error if user updates sell item and it is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post("/api/sales/items")
    .set("Cookie", cookie)
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(201);

  const sellItem = await SellItem.findById(response.body.id);
  sellItem?.set({orderId: new mongoose.Types.ObjectId().toHexString()});
  sellItem?.save();
  
  await request(app)
    .put(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "New title",
      price: 15,
    })
    .expect(400);
});
