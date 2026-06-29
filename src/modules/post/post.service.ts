import { CommentStatus } from "../../../generated/prisma/enums";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type {
  ICreatePostPayload,
  IGetPostsQuery,
  IPostUpdate,
} from "./post.interface";

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

  // getPostsFromDB = async (query: Record<string, any>) => {
  //   const {
  //     page = "1",
  //     limit = "4",
  //     searchTerm,
  //     status,
  //     isFeatured,
  //     tag,
  //     minViews,
  //     maxViews,
  //     fromDate,
  //     toDate,
  //     sortBy = "createdAt",
  //     sortOrder = "desc",
  //   } = query;

  //   const pageNumber = Number(page);
  //   const take = Number(limit);

  //   const where: PostWhereInput = {};

  //   /**
  //    * Search
  //    */
  //   if (searchTerm) {
  //     where.OR = [
  //       {
  //         title: {
  //           contains: searchTerm,
  //           mode: "insensitive",
  //         },
  //       },
  //       {
  //         content: {
  //           contains: searchTerm,
  //           mode: "insensitive",
  //         },
  //       },
  //     ];
  //   }

  //   /**
  //    * Status
  //    */
  //   if (status) {
  //     where.status = status as PostStatus;
  //   }

  //   /**
  //    * Featured
  //    */
  //   if (isFeatured !== undefined) {
  //     where.isFeatured = isFeatured === "true";
  //   }

  //   /**
  //    * Tags
  //    */
  //   if (tag) {
  //     where.tags = {
  //       has: tag,
  //     };
  //   }

  //   /**
  //    * Views Range
  //    */
  //   if (minViews || maxViews) {
  //     where.views = {
  //       // if miniView exist then gte active and spread the obj
  //       ...(minViews && {
  //         gte: Number(minViews),
  //       }),
  //       // if miniView exist then gte active and spread the obj
  //       ...(maxViews && {
  //         lte: Number(maxViews),
  //       }),
  //     };
  //   }

  //   /**
  //    * Date Range
  //    */
  //   if (fromDate || toDate) {
  //     where.createdAt = {
  //       ...(fromDate && {
  //         gte: new Date(fromDate),
  //       }),
  //       ...(toDate && {
  //         lte: new Date(toDate),
  //       }),
  //     };
  //   }

  //   /**
  //    * Count
  //    */
  //   const total = await prisma.post.count({
  //     where,
  //   });

  //   /**
  //    * Data
  //    */
  //   const posts = await prisma.post.findMany({
  //     where,

  //     include: {
  //       author: {
  //         omit: {
  //           password: true,
  //           createdAt: true,
  //           updatedAt: true,
  //         },
  //       },
  //     },

  //     skip: (pageNumber - 1) * take,

  //     take,

  //     orderBy: {
  //       [sortBy]: sortOrder,
  //     },
  //   });

  //   return {
  //     posts,
  //     pagination: {
  //       page: pageNumber,
  //       limit: take,
  //       total,
  //       totalPage: Math.ceil(total / take),
  //     },
  //   };
  // };

  getPostsFromDB = async (query: IGetPostsQuery) => {
    const {
      page = "1",
      limit = "10",
      searchTerm,
      authorId,
      status,
      isFeatured,
      tag,
      maxViews,
      minViews,
      fromDate,
      toDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const take = Math.max(1, Number(limit || 10));
    const skip = (pageNumber - 1) * take;

    const where: PostWhereInput = {};

    // Search
    if (searchTerm) {
      where.OR = [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: searchTerm,
          },
        },
        {
          author: {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    //? Filter

    //authorId
    if (authorId) {
      where.authorId = authorId;
    }

    // status
    if (status) {
      where.status = status;
    }

    // Featured
    if (typeof isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }

    // Tags
    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    //Views Range
    if (minViews || maxViews) {
      where.views = {
        ...(minViews && {
          gte: Number(minViews),
        }),
        ...(maxViews && {
          lte: Number(maxViews),
        }),
      };
    }

    // Date Range
    if (fromDate || toDate) {
      where.createdAt = {
        ...(fromDate && {
          gte: new Date(fromDate),
        }),
        ...(toDate && {
          lte: new Date(toDate),
        }),
      };
    }

    // count total posts
    // const total = await prisma.post.count({
    //   where,
    // });

    // const posts = await prisma.post.findMany({
    //   where,
    //   include: {
    //     author: {
    //       omit: {
    //         password: true,
    //         createdAt: true,
    //         updatedAt: true,
    //       },
    //     },
    //   },
    //   take,
    //   skip,
    //   orderBy: {
    //     [sortBy]: sortOrder,
    //   },
    // });

    const [total, posts] = await Promise.all([
      prisma.post.count({
        where,
      }),
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  profilePhoto: true,
                },
              },
            },
          },
        },
        take,
        skip,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        page: pageNumber,
        limit: take,
        total,
        totalPage: Math.ceil(total / take),
      },
    };
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
