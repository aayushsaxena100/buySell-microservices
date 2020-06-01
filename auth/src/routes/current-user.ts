import express, { Request, Response } from "express";
import { setCurrentUser } from "@bechna-khareedna/common";

const router = express.Router();

router.get("/api/user/currentUser", setCurrentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
