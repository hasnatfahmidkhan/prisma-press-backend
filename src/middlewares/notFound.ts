import type { NextFunction } from "express";
import httpStatus from "http-status";
import type { Req, Res } from "../types";

const notFound = (req: Req, res: Res, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: {
      path: req.originalUrl,
      method: req.method,
    },
  });
};

export default notFound;
