import request from "supertest";
import { app } from "../../app";

it("returns a status of 201 on successfull signup", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a status of 400 with an invalid email", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returns a status of 400 with an invalid password", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "pa",
    })
    .expect(400);
});

it("returns a status of 400 with an missing email and password", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "",
      password: "password",
    })
    .expect(400);

  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);

  await request(app)
    .post("/api/user/signup")
    .send({
      email: "testtest.com",
      password: "pa",
    })
    .expect(400);
});

it("returns a status of 400 with missing email and password", async () => {
  await request(app).post("/api/user/signup").send({}).expect(400);
});

it("disallow duplicate emails", async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});
