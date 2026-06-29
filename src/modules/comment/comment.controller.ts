import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";

class CommentController {
  getCommentsByAuthor = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {
      const authorId = req.params.authorId as string;
      const comments = await commentService.getCommentsByAuthor(authorId);
      sendResponse(res, {
        succces: true,
        statusCode: httpStatus.OK,
        message: "Comments retrieved successfully!",
        data: comments,
      });
    },
  );

  getCommentById = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {
      const commentId = req.params.commentId as string;
      const comment = await commentService.getCommentById(commentId);
      sendResponse(res, {
        succces: true,
        statusCode: httpStatus.OK,
        message: "Comment retrieved successfully!",
        data: comment,
      });
    },
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

  updateComment = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const commentId = req.params.commentId as string;
    const content = req.body;
    const authorId = req.user?.id as string;
    const updatedComment = await commentService.updateComment(
      commentId,
      content,
      authorId,
    );
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "Comment updated successfully!",
      data: updatedComment,
    });
  });

  deleteComment = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const commentId = req.params.commentId as string;

    const authorId = req.user?.id as string;
    await commentService.deleteComment(commentId, authorId);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "Comment deleted successfully!",
      data: null,
    });
  });

  moderateComment = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {
      const commentId = req.params.commentId as string;
      const status = req.body.status;
      const moderatedComment = await commentService.moderateComment(
        commentId,
        status,
      );
      sendResponse(res, {
        succces: true,
        statusCode: httpStatus.OK,
        message: "comment status changed successfully",
        data: moderatedComment,
      });
    },
  );
}

export const commentController = new CommentController();
