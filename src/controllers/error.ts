import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.status = err.status || 500;
  res
    .status(err.status)
    .json({ message: err.message, error: err, stack: err.stack });
};
