import httpStatus from "http-status";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import type { ILoginPayload } from "./auth.interface";
import { setAuthCookies } from "../../utils/setAuthCookie";

const loginUser = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
  const payload = req.body as ILoginPayload;

  const { accessToken, refreshToken } = await authService.loginUser(payload);

  setAuthCookies(res, "accessToken", accessToken);
  setAuthCookies(res, "refreshToken", refreshToken);

  sendResponse(res, {
    succces: true,
    statusCode: httpStatus.OK,
    message: "login successfull",
    data: { accessToken, refreshToken },
  });
});

// refreshToken
const refreshToken = catchAsync(
  async (req: Req, res: Res, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    const result = await authService.refreshToken(refreshToken);

    setAuthCookies(res, "accessToken", result.accessToken);
    setAuthCookies(res, "refreshToken", result.refreshToken);

    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "Access token created successfully",
      data: result,
    });
  },
);

export const authController = {
  loginUser,
  refreshToken,
};
