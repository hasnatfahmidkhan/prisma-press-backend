import type { NextFunction } from "express";
import type { Role } from "../../generated/prisma/enums";
import type { Req, Res } from "../types";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import type { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    // get token from cookie or headers
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    // verify the token
    const verifiedToken = jwtUtils.verifyJWTToken(
      token,
      config.jwt_access_secret,
    );

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, name, role, id } = verifiedToken.verifiedToken as JwtPayload;

    // match the role
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("Forbidden. you don't have permission for this resource");
    }

    // check user exists
    const user = await prisma.user.findUnique({
      where: {
        id,
        email,
        name,
        role,
      },
    });

    if (!user) {
      throw new Error("User not found. please login.");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked. please contact support.");
    }

    // set verifiedToken field to the req
    req.user = {
      email,
      id,
      role,
      name,
    };

    next();
  });
};
