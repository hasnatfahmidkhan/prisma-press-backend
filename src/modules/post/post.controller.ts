import httpStatus from "http-status";
import { postService } from "./post.service";
import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

class PostController {
  // create post
  createPost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const id = req.user?.id as string;
    const payload = req.body;
    const post = await postService.insertPostIntoDB(payload, id);

    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.CREATED,
      message: "post created successfully",
      data: post,
    });
  });

  // get all posts
  getAllPosts = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const page = Number(req.query?.page || 1);
    const limit = Number(req.query?.limit || 4);
    const posts = await postService.getPostsFromDB(page, limit);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "get posts successfully",
      data: posts.posts,
      pagination: { total: posts.total },
    });
  });

  // my posts
  myPosts = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const id = req.user?.id as string;
    console.log(id, "ID");
    const posts = await postService.getMyPosts(id);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "Get all my posts successfully",
      data: posts,
    });
  });

  // single post
  singlePost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const postId = req.params.postId as string;
    const post = await postService.getSignlePost(postId);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "get signle post successfully",
      data: post,
    });
  });

  // update post
  updatePost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const postId = req.params.postId as string;
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";
    const payload = req.body;
    const updatedPost = await postService.updatePostIntoDB(
      postId,
      payload,
      authorId,
      isAdmin,
    );
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "post updated successfully",
      data: updatedPost,
    });
  });

  // delete post
  deletePost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {
    const postId = req.params.postId as string;
    const authorId = req.user?.id as string;
    const isAdmin = req.user?.role === "ADMIN";

    await postService.deletePostFromDB(postId, authorId, isAdmin);
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "post deleted successfully",
      data: null,
    });
  });

  // post stats
  postStats = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});
}

export const postController = new PostController();
