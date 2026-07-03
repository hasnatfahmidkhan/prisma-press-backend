import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { subscriptionService } from "./subscription.service";

class CommentController {
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
}

export const commentController = new CommentController();
