import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.USER, Role.USER, Role.ADMIN, Role.AUTHOR),
  userController.getUserProfile,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.updateProfile,
);

export const userRouter = router;
