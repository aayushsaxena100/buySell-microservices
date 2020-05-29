import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/user/signout", (req: Request, res: Response) => {
  req.session = null;
  return res.status(200).send();
});

export { router as userSignoutRouter };
