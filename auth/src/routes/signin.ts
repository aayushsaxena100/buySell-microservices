import express, { Request, Response } from "express";
import { User } from "../models/user";
import { BadRequestError } from "../errors/BadRequestError";
import { Password } from "../utilities/password";

const router = express.Router();

router.get("/api/user/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError("No user registered with given email id");
  }

  const isPasswordCorrect = await Password.compare(
    existingUser.password as string,
    password
  );

  if (!isPasswordCorrect) {
    return res.status(401).send("incorrect password");
  }

  if (!existingUser.isVerified) {
    return res.status(401).send("please verify the email before login");
  }

  return res.status(200).send("voila");
});

export { router as userSigninRouter };
