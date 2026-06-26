import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { commentService } from "./comment.service";

class CommentController {
  getCommentsByAuthor = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

  getCommentById = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );
  createComment = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

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
