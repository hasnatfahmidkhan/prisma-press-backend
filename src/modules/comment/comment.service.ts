import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { ICreateCommentPayload } from "./comment.interface";

class CommentService {
  getCommentsByAuthor = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: authorId,
        status: "APPROVED",
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  };

  getCommentById = async (commentId: string) => {
    const comment = await prisma.comment.findUniqueOrThrow({
      where: {
        id: commentId,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            views: true,
          },
        },
      },
    });
    return comment;
  };

  createComment = async (authorId: string, payload: ICreateCommentPayload) => {
    const { content, postId } = payload;

    if (!content || !postId) {
      throw new Error("Content and postId required!");
    }

    await prisma.post.findFirstOrThrow({
      where: {
        id: postId,
      },
    });

    const comment = await prisma.comment.create({
      data: {
        content: content,
        postId: postId,
        authorId: authorId,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return comment;
  };

  updateComment = async (
    commentId: string,
    content: { content: string },
    authorId: string,
  ) => {
    if (!commentId || !content) {
      throw new Error("Comment id & content must be required!");
    }

    const comment = await prisma.comment.findUniqueOrThrow({
      where: {
        id: commentId,
      },
    });

    if (comment.authorId !== authorId) {
      throw new Error("You are not the owner of this post.");
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: content,
    });
    return updatedComment;
  };

  deleteComment = async (commentId: string, authorId: string) => {
    if (!commentId) {
      throw new Error("Comment id must be required!");
    }

    const comment = await prisma.comment.findUniqueOrThrow({
      where: {
        id: commentId,
      },
    });

    if (comment.authorId !== authorId) {
      throw new Error("You are not the owner of this post.");
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    return null;
  };

  moderateComment = async (
    commentId: string,
    status: string,
    isAdmin: boolean,
  ) => {
    if (!isAdmin) {
      throw new Error("You have not permission for this action.");
    }

    if (!commentId || !status) {
      throw new Error("Comment id & status must be required!");
    }

    if (
      !(status === CommentStatus.REJECTED) &&
      !(status === CommentStatus.APPROVED)
    ) {
      throw new Error(
        "Invalid status! Status must be either APPROVED or REJECTED.",
      );
    }

    const moderatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        status: status === "REJECTED" ? "REJECTED" : "APPROVED",
      },
    });
    return moderatedComment;
  };
}

export const commentService = new CommentService();
