import express, { Request, Response } from "express";
import { body } from "express-validator";
import { authenticateUser, validateRequest } from "@bechna-khareedna/common";

const router = express.Router();

//create an item to put on sale

router.post(
  "/api/sale/items",
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
    return res.status(201).send({});
  }
);

export { router as createItemForSale };
