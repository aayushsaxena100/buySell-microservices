import request from "supertest";
import { app } from "../app";

export const signin = async () => {
  await request(app)
    .post("/api/user/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/user/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  return response.get("Set-Cookie");
};
