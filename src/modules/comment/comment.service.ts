import { prisma } from "../../lib/prisma";
import type { ICreateCommentPayload } from "./comment.interface";

class CommentService {
  getCommentsByAuthor = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
      where: {
        authorId: authorId,
      },
      include: {
        post: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  };

  getCommentById = async () => {};

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

  updateComment = async () => {};

  deleteComment = async () => {};

  moderateComment = async () => {};
}

export const commentService = new CommentService();
