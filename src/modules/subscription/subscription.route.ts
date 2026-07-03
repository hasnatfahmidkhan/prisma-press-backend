import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { subcriptionController } from "./subscription.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subcriptionController.createCheckoutSession,
);

router.post("/webhook", subcriptionController.handleWebhook);

export const subscriptionRoutes = router;
