import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { userSignupRouter } from "./routes/signup";
import { userSigninRouter } from "./routes/signin";
import { userSignoutRouter } from "./routes/signout";
import { emailVerificationRouter } from "./routes/confirm-email";
import { handleError } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { User } from "./models/user";
import { currentUserRouter } from "./routes/current-user";

const app = express();
app.set("trust proxy", true); // this is because request is being proxied through ingress-nginx

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true, // To ensure https
  })
);

app.get("/api/user/showall", (req, res) => {
  User.find({}, function (err, result) {
    res.send(result);
  });
});

app.use(userSignupRouter);
app.use(userSigninRouter);
app.use(userSignoutRouter);
app.use(emailVerificationRouter);
app.use(currentUserRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(handleError);

export { app };
