import { Router, type Request, type Response } from "express";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { userController } from "./user.controller";
const router = Router();

router.post("/register", userController.registerUser);

export const userRouter = router;
