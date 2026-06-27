import type { PostStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags: string[];
}

export interface IPostUpdate {
  title?: string;
  content?: string;
  thumbnail?: string;
  tags?: string[];
}
