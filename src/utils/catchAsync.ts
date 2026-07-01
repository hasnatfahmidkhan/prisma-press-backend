import type { NextFunction, RequestHandler } from "express";
import type { Req, Res } from "../types";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Req, res: Res, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
