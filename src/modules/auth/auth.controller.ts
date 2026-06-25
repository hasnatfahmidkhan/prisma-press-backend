import httpStatus from "http-status";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import type { ILoginPayload } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import type { SignOptions } from "jsonwebtoken";

const loginUser = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
  const payload = req.body as ILoginPayload;

  const loginResult = await authService.loginUser(payload);

  const jwtPayload = {
    id: loginResult.id,
    email: loginResult.email,
    role: loginResult.role,
    name: loginResult.name,
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

  sendResponse(res, {
    succces: true,
    statusCode: httpStatus.OK,
    message: "login successfull",
    data: { accessToken, refreshToken },
  });
});

export const authController = {
  loginUser,
};
