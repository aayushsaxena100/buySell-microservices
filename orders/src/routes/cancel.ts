import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  authenticateUser,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  OrderCancelledEvent,
} from "@bechna-khareedna/common";
import { Order } from "../models/orders";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.patch(
  "/api/orders/cancel/:orderId",
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

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish a order cancelled event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      sellItem: {
        id: order.sellItem.id,
      },
    });

    res.status(200).send(order);
  }
);

export { router as deleteOrderRouter };
