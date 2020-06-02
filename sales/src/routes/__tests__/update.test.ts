import request from "supertest";
import { app } from "../../app";
import { createDocumentId } from "../../utility/mongoose-utility";

it("returns a status of 401 if user not authenticated", async () => {
  const salesItemId = createDocumentId();

  await request(app)
    .put(`/api/sales/items/${salesItemId}`)
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(401);
});

it("returns a status of 404 if no item on sale with provided id", async () => {
  const salesItemId = createDocumentId();

  await request(app)
    .put(`/api/sales/items/${salesItemId}`)
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

  const saleItemResponse = await request(app)
    .get(`/api/sales/items/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(saleItemResponse.body.title).toEqual("New title");
  expect(saleItemResponse.body.price).toEqual(15);
});
