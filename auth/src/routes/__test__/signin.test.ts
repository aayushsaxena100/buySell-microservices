import request from "supertest";
import { app } from "../../app";

it("returns a status of 400 when provided email does not exist during signin", async () => {
  await request(app)
    .post("/api/user/signin")
    .send({
      email: "test@test.com",
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
