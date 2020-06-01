import express, { Request, Response } from "express";
import { SalesItem } from "../models/sales-item";

const router = express.Router();

router.get("/api/sales/items", async (req, res) => {
  const salesItems = await SalesItem.find({});
  return res.status(200).send(salesItems);
});

router.get("/api/sales/items/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const salesItems = await SalesItem.find({ _id: itemId });
  return res.status(200).send(salesItems);
});

export { router as getSalesItemsRouter };
