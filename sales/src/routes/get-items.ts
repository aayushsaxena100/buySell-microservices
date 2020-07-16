import express, { Request, Response } from "express";
import { SellItem } from "../models/sell-item";
import { NotFoundError } from "@bechna-khareedna/common";

const router = express.Router();

router.get("/api/sales/items", async (req, res) => {
  const sellItems = await SellItem.find({});

  if (sellItems.length == 0) {
    throw new NotFoundError();
  }

  return res.status(200).send(sellItems);
});

router.get("/api/sales/items/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const sellItem = await SellItem.findOne({ _id: itemId });

  if (!sellItem) {
    throw new NotFoundError();
  }

  return res.status(200).send(sellItem);
});

export { router as getSellItemsRouter };
