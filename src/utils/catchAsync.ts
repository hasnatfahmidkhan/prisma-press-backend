import type { NextFunction, RequestHandler } from "express";
import type { Req, Res } from "../types";
import httpStatus from "http-status";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Req, res: Res, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to register user",
        error: (error as Error).message,
      });
    }
  };
};
