import { NextFunction, Request, Response } from "express";
import { ENV } from "../utils/env";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: ENV.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
