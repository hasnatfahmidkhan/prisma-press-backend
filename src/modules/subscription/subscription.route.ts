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

router.get(
  "/sub-status",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subcriptionController.getSubcriptionStatus,
);

// In subscription.route.ts or matching router
router.post(
  "/cancel",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  subcriptionController.cancelSubscription,
);

export const subscriptionRoutes = router;
