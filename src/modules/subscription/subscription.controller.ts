import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";

class CommentController {
  checkout = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    
  });
}

export const commentController = new CommentController();
