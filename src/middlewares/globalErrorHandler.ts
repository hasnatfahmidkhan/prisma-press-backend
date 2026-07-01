import type { NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client";
import config from "../config";
import type { Req, Res } from "../types";

const globalErrorHandler = (
  err: any,
  req: Req,
  res: Res,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  // Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Your provided field is missing or incorrect!";
  }

  // JWT Errors
  else if (
    err instanceof jwt.JsonWebTokenError ||
    err instanceof jwt.TokenExpiredError
  ) {
    statusCode = httpStatus.UNAUTHORIZED;
    message = err.message;
  }

  // Generic Errors
  else if (err instanceof Error) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
  }
  console.log(err);
  res.status(statusCode).json({
    success: false,
    name: err.name,
    message,
    stack: config.node_env === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;
