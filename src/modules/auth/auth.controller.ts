import httpStatus from "http-status";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import type { ILoginPayload } from "./auth.interface";

const loginUser = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
  const payload = req.body as ILoginPayload;

  const { accessToken, refreshToken } = await authService.loginUser(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
  });

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
