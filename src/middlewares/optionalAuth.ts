import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { jwtUtils } from "../utils/jwt";

export const optionalAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error) {
      // Token expired ba invalid holeo kono error throw korbe na.
      // Sheta guest user hishebe execute hote thakbe.
      console.error("Optional token validation failed:", error);
    }

    // Obosshoi next() call korte hobe jate request controller-e jay
    next();
  };
};
