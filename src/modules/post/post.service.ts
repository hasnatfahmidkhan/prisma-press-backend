import { prisma } from "../../lib/prisma";
import type { ICreatePostPayload, IPostUpdate } from "./post.interface";

class PostService {
  insertPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
    const post = await prisma.post.create({
      data: {
        ...payload,
        authorId: userId,
      },
    });

    return post;
  };

  getPostsFromDB = async () => {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  };

  getMyPosts = async (userId: string) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            commments: true,
          },
        },
      },
    });

    return posts.map(({ _count, ...post }) => ({
      ...post,
      totalComments: _count.commments,
    }));
  };

  getSignlePost = async (postId: string) => {
    await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        commments: true,
      },
    });
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return updatedPost;
  };

  updatePostIntoDB = async (
    postId: string,
    payload: IPostUpdate,
    authorId: string,
    isAdmin: boolean,
  ) => {
    const post = await prisma.post.findFirstOrThrow({
      where: {
        id: postId,
      },
    });

    if (!isAdmin && post.authorId !== authorId) {
      throw new Error("You are not the owner of this post.");
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: payload,
      include: {
        commments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return updatedPost;
  };

  deletePostFromDB = async (
    postId: string,
    authorId: string,
    isAdmin: boolean,
  ) => {
    const post = await prisma.post.findFirstOrThrow({
      where: {
        id: postId,
      },
    });

    if (!isAdmin && post.authorId !== authorId) {
      throw new Error("You are not owner this post.");
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return null;
  };

  postStatsFromDb = async () => {};
}

export const postService = new PostService();
