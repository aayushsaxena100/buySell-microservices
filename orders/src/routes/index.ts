import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders", (req: Request, res: Response) => {});

export { router as getAllOrdersRouter };
