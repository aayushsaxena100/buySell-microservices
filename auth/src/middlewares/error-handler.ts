import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const handleError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(500).send({ errors: [{ message: "something went wrong" }] });
};
