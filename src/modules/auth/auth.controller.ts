import httpStatus from "http-status";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import type { ILoginPayload } from "./auth.interface";

const loginUser = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
  const payload = req.body as ILoginPayload;

  const loginResult = await authService.loginUser(payload);

  sendResponse(res, {
    succces: true,
    statusCode: httpStatus.OK,
    message: "login successfull",
    data: loginResult,
  });
});

export const authController = {
  loginUser,
};
