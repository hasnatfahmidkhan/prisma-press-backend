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

export interface IGetPostsQuery {
  page?: string;
  limit?: string;

  // Search
  searchTerm?: string;

  // Filters
  authorId?: string;
  status?: PostStatus;
  isFeatured?: string;
  tag?: string;

  // Range Filters
  minViews?: string;
  maxViews?: string;

  // Date Filters
  fromDate?: string;
  toDate?: string;

  // Sorting
  sortBy?: "title" | "views" | "createdAt";
  sortOrder?: "asc" | "desc";
}
