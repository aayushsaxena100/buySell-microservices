import express, { Request, Response } from "express";
import { authenticateUser } from "@bechna-khareedna/common";
import { Order } from "../models/orders";

const router = express.Router();

// Get all orders created by a user
router.get(
  "/api/orders",
  authenticateUser,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate("sellItem");

    res.send({ orders });
  }
);

export { router as getAllOrdersRouter };
