import express, { Request, Response } from "express";
import { body } from "express-validator";
import { authenticateUser, validateRequest } from "@bechna-khareedna/common";
import { SellItem } from "../models/sell-item";
import { SellItemCreatedPublisher } from "../events/publishers/sellItem-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

//create an item to put on sale

router.post(
  "/api/sales/items",
  authenticateUser,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Title is required for the item to be sold"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Item to be sold must have a price greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const sellItem = SellItem.build({
      title,
      price,
      userId: req.currentUser?.id!,
    });

    await sellItem.save();

    await new SellItemCreatedPublisher(natsWrapper.client).publish({
      id: sellItem.id,
      title: sellItem.title,
      price: sellItem.price,
      userId: sellItem.userId,
      version: sellItem.version,
    });

    return res.status(201).send(sellItem);
  }
);

export { router as createSellItem };
