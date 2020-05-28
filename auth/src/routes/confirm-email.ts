import express, { Request, Response } from "express";
import { EmailVerificationToken } from "../models/email-verification-token";
import { User } from "../models/user";

const router = express.Router();

router.get(
  "/api/user/email/confirmation/:suppliedToken",
  async (req: Request, res: Response) => {
    const { suppliedToken } = req.params;
    const emailVerificationToken = await EmailVerificationToken.findOne({
      token: suppliedToken,
    });

    const userId = emailVerificationToken?.userId;
    var isEmailVerificationSuccessful = false;

    if (userId) {
      await User.updateOne(
        { _id: userId },
        { isVerified: true },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            isEmailVerificationSuccessful = true;
          }
        }
      );
    }

    if (isEmailVerificationSuccessful) {
      return res.status(200).send("Email verification successful.");
    } else {
      return res.status(401).send("Email verification failed.");
    }
  }
);

export { router as emailVerificationRouter };
