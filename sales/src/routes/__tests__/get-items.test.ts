import request from "supertest";
import { app } from "../../app";
import { createDocumentId } from "../../utility/mongoose-utility";

const createSellItem = async () => {
  return await request(app)
    .post("/api/sales/items")
    .set("Cookie", global.signin())
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(201);
};

it("returns a status of 404 if item with provided id does not exist", async () => {
  const sellItemId = createDocumentId();
  await request(app).get(`/api/sales/items/${sellItemId}`).send().expect(404);
});

it("checks if all items successfully fetched", async () => {
  await createSellItem();
  await createSellItem();
  await createSellItem();

  const response = await request(app)
    .get("/api/sales/items")
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

it("fetches item if valid id is provided", async () => {
  const response = await createSellItem();
  const { id } = response.body;
  const response1 = await request(app)
    .get(`/api/sales/items/${id}`)
    .send()
    .expect(200);
});
