import type { Req, Res } from "../../types";
import httpStatus from "http-status";
import { userService } from "./user.service";
import type { IUser } from "./user.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { NextFunction } from "express";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

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

// getUserProfile
const getUserProfile = catchAsync(
  async (req: Req, res: Res, next: NextFunction) => {
    const id = req.user?.id;

    const user = await userService.getUserProfileFromDB(id as string);

    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "fetch user profile successfully!",
      data: user,
    });
  },
);

export const userController = {
  registerUser,
  getUserProfile,
};
