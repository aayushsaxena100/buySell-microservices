import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/signin";

it("unsets the cookie session on successfull signout", async () => {
  const cookie = await signin();
  expect(cookie).toBeDefined();

  const response = await request(app).get("/api/user/signout").expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
