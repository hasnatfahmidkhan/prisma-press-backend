import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { commentController } from "./subscription.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  commentController.checkout,
);

export const subscriptionRoutes = router;
