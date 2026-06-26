import { prisma } from "../../lib/prisma";
import type { ICreatePostPayload } from "./post.interface";

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
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        commments: true,
      },
    });
    return post;
  };

  updatePostIntoDB = async () => {};

  deletePostFromDB = async () => {};

  postStatsFromDb = async () => {};
}

export const postService = new PostService();
