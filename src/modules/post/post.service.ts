import { CommentStatus } from "../../../generated/prisma/enums";
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

  getPostsFromDB = async (page: number = 1, take: number = 4) => {
    const total = await prisma.post.count();
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
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        createdAt: "desc",
      },
    });
    return { posts, total };
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
    // await prisma.post.update({
    //   where: {
    //     id: postId,
    //   },
    //   data: {
    //     views: {
    //       increment: 1,
    //     },
    //   },
    // });
    // const post = await prisma.post.findUniqueOrThrow({
    //   where: {
    //     id: postId,
    //   },
    //   include: {
    //     commments: {
    //       where: {
    //         // status: "APPROVED",
    //         status: CommentStatus.APPROVED,
    //       },
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //     },
    //     _count: {
    //       select: {
    //         commments: true,
    //       },
    //     },
    //   },
    // });
    // const { _count, ...postData } = post;
    // return { ...postData, totalComments: _count.commments };

    const transactionResult = await prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      const post = await tx.post.findFirstOrThrow({
        where: {
          id: postId,
        },
        include: {
          commments: {
            where: {
              // status: "APPROVED",
              status: CommentStatus.APPROVED,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          _count: {
            select: {
              commments: true,
            },
          },
        },
      });
      return post;
    });
    return transactionResult;
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

  postStatsFromDb = async () => {
    const statsTransaction = await prisma.$transaction(async (tx) => {
      const [
        totalPosts,
        publishedPosts,
        draftPosts,
        archivedposts,
        totalComments,
        approveComments,
        totalUsers,
        adminUsers,
        regularUsers,
        viewStats,
      ] = await Promise.all([
        await tx.post.count(),
        await tx.post.count({
          where: {
            status: "PUBLISHED",
          },
        }),
        await tx.post.count({
          where: {
            status: "DRAFT",
          },
        }),
        await tx.post.count({
          where: {
            status: "ARCHIVED",
          },
        }),
        await tx.comment.count(),
        await tx.comment.count({
          where: {
            status: "APPROVED",
          },
        }),
        await tx.user.count(),
        await tx.user.count({
          where: {
            role: "ADMIN",
          },
        }),
        await tx.user.count({
          where: {
            role: {
              in: ["USER", "AUTHOR"],
            },
          },
        }),
        await tx.post.aggregate({
          _sum: {
            views: true,
          },
          _max: {
            views: true,
          },
          _min: {
            views: true,
          },
          _avg: {
            views: true,
          },
        }),
      ]);
      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        archivedposts,
        totalComments,
        approveComments,
        totalUsers,
        adminUsers,
        regularUsers,
        viewStats,
      };
    });
    return statsTransaction;
  };
}

export const postService = new PostService();
