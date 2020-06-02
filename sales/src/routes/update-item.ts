import express, { Request, Response } from "express";
import { body } from "express-validator";
import { SalesItem } from "../models/sales-item";
import {
  NotFoundError,
  authenticateUser,
  validateRequest,
} from "@bechna-khareedna/common";

const router = express.Router();

router.put(
  "/api/sales/items/:saleItemId",
  authenticateUser,
  [
    body("title").notEmpty().withMessage("title cannot be empty"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("price must is be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const salesItem = await SalesItem.findById(req.params.saleItemId);

    if (!salesItem) {
      throw new NotFoundError();
    }

    if (salesItem.userId !== req.currentUser?.id) {
      return res.status(401).send();
    }

    const { title, price } = req.body;
    salesItem.set({
      title,
      price,
    });
    await salesItem.save();
    return res.status(200).send(salesItem);
  }
);

export { router as updateSalesItemRouter };
