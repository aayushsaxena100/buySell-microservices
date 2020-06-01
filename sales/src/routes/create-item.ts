import express, { Request, Response } from "express";
import { body } from "express-validator";
import { authenticateUser, validateRequest } from "@bechna-khareedna/common";
import { SalesItem } from "../models/sales-item";

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

    const salesItem = SalesItem.build({
      title,
      price,
      userId: req.currentUser?.id!,
    });

    await salesItem.save();
    return res.status(201).send(JSON.stringify(salesItem));
  }
);

export { router as createItemForSale };
