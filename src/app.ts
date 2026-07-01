import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Request, Response } from "express";
import express from "express";
import config from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import { authRoutes } from "./modules/auth/auth.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { postRoutes } from "./modules/post/post.route";
import { userRouter } from "./modules/user/user.route";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// users api
app.use("/api/users", userRouter);

// auth api
app.use("/api/auth", authRoutes);

// post api
app.use("/api/posts", postRoutes);

// comment api
app.use("/api/comments", commentRoutes);

// not found middleware
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;
