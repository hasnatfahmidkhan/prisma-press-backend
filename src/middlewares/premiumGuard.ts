import type { NextFunction } from "express";
import { subscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import type { Req, Res } from "../types";
import { catchAsync } from "../utils/catchAsync";

export const premiumGuard = () => {
  return catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const userId = req.user?.id as string;

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new Error("please subscribe to access premium content");
    }

    if (subscription.status !== subscriptionStatus.ACTIVE) {
      throw new Error("please subscribe again to access premium content");
    }
    next();
  });
};
