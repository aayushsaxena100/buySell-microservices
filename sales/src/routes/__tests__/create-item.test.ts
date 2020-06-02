import request from "supertest";
import { app } from "../../app";

it("returns a status of 401 if user not authenticated", async () => {
  await request(app)
    .post("/api/sales/items/")
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(401);
});

it("returns a status of 400 if invalid title or price is provided", async () => {
  await request(app)
    .post("/api/sales/items")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/sales/items")
    .set("Cookie", global.signin())
    .send({
      title: "Blah Blah",
      price: -10,
    })
    .expect(400);
});

it("returns a status of 201 if item successfully created", async () => {
  await request(app)
    .post("/api/sales/items")
    .set("Cookie", global.signin())
    .send({
      title: "Blah Blah",
      price: 10,
    })
    .expect(201);
});
