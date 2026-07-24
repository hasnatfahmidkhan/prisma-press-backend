import type { NextFunction } from "express";
import httpStatus from "http-status";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { subscriptionService } from "./subscription.service";

class SubcriptionContoller {
  createCheckoutSession = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {
      const userId = req.user?.id as string;
      const subscriptionResult =
        await subscriptionService.createCheckoutSession(userId);

      sendResponse(res, {
        succces: true,
        statusCode: 200,
        message: "Subcribe successfully",
        data: subscriptionResult,
      });
    },
  );

  handleWebhook = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const event = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;
    await subscriptionService.handleWebhook(event, signature);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "webhook triger successfully",
      data: null,
    });
  });

  getSubcriptionStatus = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {
      const userId = req.params.userId as string;

      const status = await subscriptionService.getSubcriptionStatus(userId);
      sendResponse(res, {
        succces: true,
        statusCode: httpStatus.OK,
        message: "get status",
        data: status,
      });
    },
  );

  // Inside your SubcriptionContoller class in subscription.controller.ts
  cancelSubscription = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {
      const userId = req.user?.id as string; 

      await subscriptionService.cancelSubscription(userId);

      sendResponse(res, {
        succces: true, 
        statusCode: httpStatus.OK,
        message: "Subscription cancelled successfully",
        data: null,
      });
    },
  );
}

export const subcriptionController = new SubcriptionContoller();
