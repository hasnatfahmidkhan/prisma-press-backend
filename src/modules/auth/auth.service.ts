import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ILoginPayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import type { SignOptions } from "jsonwebtoken";

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

export const authService = {
  loginUser,
};
