import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { Role } from "../../types/roles";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization header"));
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role as Role };
    return next();
  } catch (_error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}
