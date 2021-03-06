import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  authenticateUser,
  NotFoundError,
  NotAuthorizedError,
} from "@bechna-khareedna/common";
import { Order } from "../models/orders";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  authenticateUser,
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      throw new NotFoundError();
    }

    const order = await Order.findById(req.params.orderId).populate("sellItem");

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id != order.userId) {
      throw new NotAuthorizedError();
    }

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
