import type { Request, Response } from "express";
import type { Role } from "../../generated/prisma/enums";

export type Req = Request;
export type Res = Response;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        name: string;
      };
    }
  }
}
