import express, { Request, Response } from "express";
import { SalesItem } from "../models/sales-item";
import { NotFoundError } from "@bechna-khareedna/common";

const router = express.Router();

router.get("/api/sales/items", async (req, res) => {
  const salesItems = await SalesItem.find({});

  if (salesItems.length == 0) {
    throw new NotFoundError();
  }

  return res.status(200).send(salesItems);
});

router.get("/api/sales/items/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const salesItem = await SalesItem.findOne({ _id: itemId });

  if (!salesItem) {
    throw new NotFoundError();
  }

  return res.status(200).send(salesItem);
});

export { router as getSalesItemsRouter };
