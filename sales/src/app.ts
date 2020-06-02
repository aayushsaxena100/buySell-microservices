import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  handleError,
  NotFoundError,
  setCurrentUser,
} from "@bechna-khareedna/common";
import { createItemForSale } from "./routes/create-item";
import { getSalesItemsRouter } from "./routes/get-items";
import { updateSalesItemRouter } from "./routes/update-item";

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

app.use(createItemForSale);
app.use(getSalesItemsRouter);
app.use(updateSalesItemRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(handleError);

export { app };
