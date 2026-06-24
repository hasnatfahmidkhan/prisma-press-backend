import type { Req, Res } from "../../types";
import httpStatus from "http-status";
import { userService } from "./user.service";
import type { IUser } from "./user.interface";
const registerUser = async (req: Req, res: Res) => {
  try {
    const payload = req.body as IUser;

    const user = await userService.createUser(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfull!",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to register user",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
