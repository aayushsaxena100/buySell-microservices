import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@bechna-khareedna/common";

const router = express.Router();

router.post(
  "/api/user/signup",
  [
    body("email").isEmail().withMessage("INVALID EMAIL"),
    body("password")
      .isLength({ min: 4, max: 20 })
      .withMessage("PASSWORD MUST BE BETWEEN 4 AND 20 CHARACTERS"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    var savedUser = await user.save();

    //Generate email verification token

    // var tokenDoc = EmailVerificationToken.build({
    //   userId: savedUser._id,
    //   token: crypto.randomBytes(16).toString("hex"),
    // });

    // tokenDoc.save();
    // var isEmailSent = sendVerificationToken(
    //   user.email as string,
    //   tokenDoc.token
    // );

    return res.status(201).send(JSON.stringify(savedUser));

    // if (isEmailSent) {
    //   return res.status(201).send({
    //     response: "A verification email has been sent to " + user.email + ".",
    //     data: JSON.stringify(savedUser),
    //   });
    // } else {
    //   throw new InternalServerError();
    // }
  }
);

// const sendVerificationToken = (email: string, token: string): boolean => {
//   var transporter = nodemailer.createTransport({
//     host: "debugmail.io",
//     port: 25,
//     secure: false,
//     auth: {
//       user: "er.aayushsaxena@gmail.com",
//       pass: "1b072da0-a029-11ea-9693-2fd8e60137be",
//     },
//   });
//   var mailOptions = {
//     from: "no-reply@rating.dev",
//     to: email,
//     subject: "Account Verification Token",
//     text:
//       "Hello,\n\n" +
//       "Please verify your account by clicking the link: \nhttp://" +
//       "rating.dev" +
//       "/api/user/email/confirmation/" +
//       token +
//       ".\n",
//   };
//   transporter.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//       return false;
//     }
//   });
//   var isEmailSent = true;
//   transporter.sendMail(mailOptions, function (err) {
//     if (err) {
//       isEmailSent = false;
//     }
//   });
//   return isEmailSent;
// };

export { router as userSignupRouter };
