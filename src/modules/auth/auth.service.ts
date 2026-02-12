import crypto from "crypto";
import { User } from "../users/user.model";
import { ApiError } from "../../common/utils/ApiError";
import { comparePassword, hashPassword } from "../../common/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../common/utils/jwt";
import { env } from "../../config/env";
import { sendPasswordResetEmail } from "../../common/utils/mailer";

export async function registerUser(payload: {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const exists = await User.findOne({ email: payload.email });
  if (exists) {
    throw new ApiError(409, "Email already registered");
  }

  const hashed = await hashPassword(payload.password);
  const user = await User.create({
    ...payload,
    password: hashed
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return { user, accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return { user, accessToken, refreshToken };
}

export async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  return {
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    refreshToken: signRefreshToken({ sub: user.id, role: user.role })
  };
}

export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { message: "If the account exists, a reset link was sent" };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 15);

  user.passwordResetTokenHash = tokenHash;
  user.passwordResetExpires = expires;
  await user.save();

  const resetLink = `${env.APP_BASE_URL}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetLink);

  return { message: "If the account exists, a reset link was sent" };
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return { message: "Password reset successfully" };
}
