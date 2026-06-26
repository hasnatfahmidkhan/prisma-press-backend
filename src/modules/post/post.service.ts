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
            udpatedAt: true,
          },
        },
      },
    });
    return posts;
  };

  getMyPost = async () => {};

  getSignlePost = async () => {};

  updatePostIntoDB = async () => {};

  deletePostFromDB = async () => {};

  postStatsFromDb = async () => {};
}

export const postService = new PostService();
