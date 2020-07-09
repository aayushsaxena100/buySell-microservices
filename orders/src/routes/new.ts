import express, { Request, Response } from "express";
import {
  authenticateUser,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@bechna-khareedna/common";
import { body } from "express-validator";
import { SellItem } from "../models/sell-item";
import { Order } from "../models/orders";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  authenticateUser,
  [
    body("sellItemId")
      .not()
      .isEmpty()
      .withMessage("Sell item id must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { sellItemId } = req.body;

    //Find the item the user is ordering
    const sellItem = await SellItem.findById(sellItemId);
    if (!sellItem) {
      throw new NotFoundError();
    }

    //Make sure that the item is not already reserved
    const isReserved = await sellItem.isReserved();
    if (isReserved) {
      throw new BadRequestError("Sell Item is not available");
    }

    //Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      sellItem,
    });
    await order.save();

    //Publish an event that the order has been created

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
