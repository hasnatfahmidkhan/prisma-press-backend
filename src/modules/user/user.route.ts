import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.USER, Role.USER, Role.ADMIN, Role.AUTHOR),
  userController.getUserProfile,
);

export const userRouter = router;
