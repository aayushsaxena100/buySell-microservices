import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError } from "../errors/BadRequestError";
import { Password } from "../utilities/password";
import { validateRequest } from "../middlewares/validate-Request";

const router = express.Router();

router.get(
  "/api/user/signin",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
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

    const userJwt = jwt.sign({ id: existingUser._id }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send("voila");
  }
);

export { router as userSigninRouter };
