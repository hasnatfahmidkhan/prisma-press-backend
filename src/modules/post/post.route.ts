import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { optionalAuth } from "../../middlewares/optionalAuth";
import { postController } from "./post.controller";

const router = Router();

// Public
router.get("/", optionalAuth(), postController.getAllPosts);

router.get("/stats", auth(Role.ADMIN), postController.postStats);

router.get(
  "/my-posts",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.myPosts,
);
router.get("/:postId", postController.singlePost);

// Authenticated

router.post(
  "/",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.createPost,
);

router.patch(
  "/:postId",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.updatePost,
);

router.delete(
  "/:postId",
  auth(Role.USER, Role.AUTHOR, Role.ADMIN),
  postController.deletePost,
);

export const postRoutes = router;
