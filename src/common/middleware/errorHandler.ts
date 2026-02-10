import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { logger } from "../../config/logger";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err instanceof ApiError ? err.statusCode : err instanceof ZodError ? 400 : 500;
  const payload = {
    message: err.message || "Internal Server Error",
    details: err instanceof ApiError ? err.details : err instanceof ZodError ? err.flatten() : undefined
  };

  logger.error("Request failed", { error: err.message, stack: err.stack });
  res.status(statusCode).json(payload);
}
