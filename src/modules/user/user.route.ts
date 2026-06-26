import { Router, type Request, type Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { userController } from "./user.controller";
const router = Router();

router.post("/register", userController.registerUser);
router.get('/me', userController.getUserProfile)

export const userRouter = router;
