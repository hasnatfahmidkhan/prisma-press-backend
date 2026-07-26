import type { NextFunction } from "express";
import config from "../config";
import type { Req, Res } from "../types";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";

export const optionalAuth = () => {
  return catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (token) {
      // Token thakle verify korbe
      const decoded = jwtUtils.verifyJWTToken(
        token,
        config.jwt_access_secret,
      ) as any;

      // Token valid hole req.user set hobe (req.user?.id pawa jabe)
      if (decoded?.verifiedToken) {
        req.user = decoded.verifiedToken;
      }
    }

    next();
  });
};
