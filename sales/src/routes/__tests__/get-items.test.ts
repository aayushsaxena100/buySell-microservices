import request from "supertest";
import { app } from "../../app";
import { createDocumentId } from "../../utility/mongoose-utility";

const createSalesItem = async () => {
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
  const salesItemId = createDocumentId();
  await request(app).get(`/api/sales/items/${salesItemId}`).send().expect(404);
});

it("checks if all items successfully fetched", async () => {
  await createSalesItem();
  await createSalesItem();
  await createSalesItem();

  const response = await request(app)
    .get("/api/sales/items")
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});

it("fetches item if valid id is provided", async () => {
  const response = await createSalesItem();
  const { id } = response.body;
  const response1 = await request(app)
    .get(`/api/sales/items/${id}`)
    .send()
    .expect(200);
});
