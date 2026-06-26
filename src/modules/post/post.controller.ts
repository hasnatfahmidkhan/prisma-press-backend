import type { NextFunction } from "express";
import type { Req, Res } from "../../types";
import { catchAsync } from "../../utils/catchAsync";

class PostController {
  // create post
  createPost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});

  // get all posts
  getAllPosts = catchAsync(
    async (req: Req, res: Res, next: NextFunction) => {},
  );

  // my posts
  myPost = catchAsync(async (req: Req, res: Res, next: NextFunction) => {});

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
