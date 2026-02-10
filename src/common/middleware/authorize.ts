import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { Role } from "../../types/roles";

export function authorize(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }
    if (!roles.includes(req.user.role as Role)) {
      return next(new ApiError(403, "Forbidden"));
    }
    return next();
  };
}
