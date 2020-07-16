import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  handleError,
  NotFoundError,
  setCurrentUser,
} from "@bechna-khareedna/common";
import { createSellItem } from "./routes/create-item";
import { getSellItemsRouter } from "./routes/get-items";
import { updateSellItemRouter } from "./routes/update-item";

const app = express();
app.set("trust proxy", true); // this is because request is being proxied through ingress-nginx

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // To ensure https
  })
);

app.use(setCurrentUser);

app.use(createSellItem);
app.use(getSellItemsRouter);
app.use(updateSellItemRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(handleError);

export { app };
