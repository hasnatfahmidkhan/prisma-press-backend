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
    const posts = await postService.getPostsFromDB();
    sendResponse(res, {
      succces: true,
      statusCode: httpStatus.OK,
      message: "get posts successfully",
      data: posts,
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
  singlePost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});

  // update post
  updatePost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});

  // delete post
  deletePost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});

  // post stats
  postStats = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});
}

export const postController = new PostController();
