import type { Req, Res } from "../../types";
import httpStatus from "http-status";
import { userService } from "./user.service";
import type { IUser } from "./user.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { NextFunction } from "express";

// register User
const registerUser = catchAsync(
  async (req: Req, res: Res, next: NextFunction) => {
    const payload = req.body as IUser;

    const user = await userService.createUser(payload);

    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "User registered successfull!",
    //   data: {
    //     user,
    //   },
    // });
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfull",
      data: user,
    });
  },
);

export const userController = {
  registerUser,
};
