import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  handleError,
  NotFoundError,
  setCurrentUser,
} from "@bechna-khareedna/common";
import { deleteOrderRouter } from "./routes/cancel";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { getAllOrdersRouter } from "./routes/index";

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

app.use(deleteOrderRouter);
app.use(getAllOrdersRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(handleError);

export { app };
