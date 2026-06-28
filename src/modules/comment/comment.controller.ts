import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";

class CommentController {
  getCommentsByAuthor = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

  getCommentById = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

  createComment = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const authorId = req.user?.id as string;
    const payload = req.body;
    const comment = await commentService.createComment(authorId, payload);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.CREATED,
      message: "Comment created successfully!",
      data: comment,
    });
  });

  updateComment = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

  deleteComment = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

  moderateComment = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );
}

export const commentController = new CommentController();
