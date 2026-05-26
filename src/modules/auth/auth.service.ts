import crypto from "crypto";

import { sendEmailVerificationEmail, sendPasswordResetEmail } from "../../common/utils/mailer";
import { User } from "../users/user.model";
import { ApiError } from "../../common/utils/ApiError";
import { comparePassword, hashPassword } from "../../common/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../common/utils/jwt";
import { env } from "../../config/env";
import { logger } from "../../config/logger";

export async function registerUser(payload: {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}) {
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) {
    throw new ApiError(409, "Email already registered");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
  const verificationExpires = new Date(
    Date.now() + env.EMAIL_VERIFICATION_TOKEN_TTL_MINUTES * 60 * 1000
  );

  const hashed = await hashPassword(payload.password);
  const user = await User.create({
    ...payload,
    password: hashed,
    emailVerificationTokenHash: verificationTokenHash,
    emailVerificationExpires: verificationExpires,
    emailVerified: false
  });

  const verifyLink = `${env.APP_BASE_URL}/verify-email?token=${verificationToken}`;
  let verificationEmailSent = true;

  try {
    await sendEmailVerificationEmail(user.email, verifyLink);
  } catch (error) {
    verificationEmailSent = false;
    logger.warn("Email verification could not be sent", {
      email: user.email,
      error: (error as Error).message
    });

    if (env.NODE_ENV === "production") {
      throw new ApiError(500, "Unable to send verification email");
    }
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  return {
    user,
    accessToken,
    refreshToken,
    emailVerificationRequired: true,
    ...(verificationEmailSent ? {} : { devVerificationToken: verificationToken })
  };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    throw new ApiError(423, "Account temporarily locked due to failed login attempts");
  }

  if (!user.emailVerified) {
    throw new ApiError(403, "Email is not verified");
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    user.failedLoginAttempts += 1;

    if (user.failedLoginAttempts >= env.LOGIN_LOCK_MAX_ATTEMPTS) {
      user.failedLoginAttempts = 0;
      user.lockUntil = new Date(Date.now() + env.LOGIN_LOCK_MINUTES * 60 * 1000);
      await user.save();
      throw new ApiError(423, "Account temporarily locked due to failed login attempts");
    }

    await user.save();
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.failedLoginAttempts > 0 || user.lockUntil) {
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
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

export async function verifyUserEmail(token: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpires: { $gt: new Date() }
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  user.emailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { message: "Email verified successfully" };
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
