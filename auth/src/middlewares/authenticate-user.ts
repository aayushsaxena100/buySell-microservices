import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthenticatedError } from "../errors/not-authenticated-error";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthenticatedError();
  }

  next();
};
