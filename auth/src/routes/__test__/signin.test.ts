import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";

it("returns a status of 400 during signin when provided email does not exist or invalid email", async () => {
  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);

  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a status of 401 when signing in with incorrect password", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test@test.com",
      password: "asdasd",
    })
    .expect(401);
});

it("returns a status of 200 and cookie is set on successful signin", async () => {
  const cookie = await signin();
  expect(cookie).toBeDefined();
});
