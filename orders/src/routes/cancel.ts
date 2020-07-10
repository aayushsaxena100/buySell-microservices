import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  authenticateUser,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@bechna-khareedna/common";
import { Order } from "../models/orders";

const router = express.Router();

router.patch(
  "/api/orders/cancel/:orderId",
  authenticateUser,
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      throw new NotFoundError();
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (req.currentUser!.id != order.userId) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish a order cancelled event

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
