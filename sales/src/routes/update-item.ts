import express, { Request, Response } from "express";
import { body } from "express-validator";
import { SellItem } from "../models/sell-item";
import {
  NotFoundError,
  authenticateUser,
  validateRequest,
  BadRequestError,
} from "@bechna-khareedna/common";
import { natsWrapper } from "../nats-wrapper";
import { SellItemUpdatedPublisher } from "../events/publishers/sellItem-updated-publisher";

const router = express.Router();

router.put(
  "/api/sales/items/:sellItemId",
  authenticateUser,
  [
    body("title").notEmpty().withMessage("title cannot be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must is be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const sellItem = await SellItem.findById(req.params.sellItemId);

    if (!sellItem) {
      throw new NotFoundError();
    }

    if (sellItem.userId !== req.currentUser?.id) {
      return res.status(401).send();
    }

    if(sellItem.orderId){
      throw new BadRequestError('sell-item is reserved and cannot be currently edited')
    }
    
    const { title, price } = req.body;
    sellItem.set({
      title,
      price,
    });
    await sellItem.save();

    await new SellItemUpdatedPublisher(natsWrapper.client).publish({
      id: sellItem.id,
      title: sellItem.title,
      price: sellItem.price,
      userId: sellItem.userId,
      version: sellItem.version,
      orderId: null
    });

    return res.status(200).send(sellItem);
  }
);

export { router as updateSellItemRouter };
