import { Request, Response } from "express";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { loginUser, refreshTokens, registerUser } from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  res.json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await refreshTokens(refreshToken);
  res.json(result);
});
