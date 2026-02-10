import { User } from "../users/user.model";
import { ApiError } from "../../common/utils/ApiError";
import { comparePassword, hashPassword } from "../../common/utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../common/utils/jwt";

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
