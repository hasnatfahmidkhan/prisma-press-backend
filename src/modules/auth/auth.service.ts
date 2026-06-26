import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginPayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

const loginUser = async (payload: ILoginPayload) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Please Provide Email & password");
  }

  //   is the user exists
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email,
    },
    omit: {
      createdAt: true,
      udpatedAt: true,
    },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("Your account has been blocked. please contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Incorrect Password");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwtUtils.createJWTToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createJWTToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

// refreshToken
const refreshToken = async (token: string) => {
  // verifyrefresh token
  const verifyRefreshToken = jwtUtils.verifyJWTToken(
    token,
    config.jwt_refresh_secret,
  );

  if (!verifyRefreshToken.success) {
    throw new Error(verifyRefreshToken.error);
  }

  const { id } = verifyRefreshToken.verifiedToken as JwtPayload;

  // check user exists
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });

  if (user.activeStatus === "BLOCKED") {
    throw new Error("user is blocked");
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  // generate access & refresh token
  const accessToken = jwtUtils.createJWTToken(
    payload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createJWTToken(
    payload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};
export const authService = {
  loginUser,
  refreshToken,
};
