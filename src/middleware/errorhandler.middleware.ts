import { Request, Response } from "express";
import Errorhandler from "../utils/ErrorHandler";

export const ErrorhandlerMiddleware = (
  Error: Errorhandler,
  req: Request,
  res: Response
) => {
  const statusCode = Error.statuscode || 500;
  const message = Error.message || "Internal server error";
  res.status(statusCode).json({
    message,
  });
};
