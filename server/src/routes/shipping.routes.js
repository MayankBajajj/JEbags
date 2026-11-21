import { Router } from "express";
import { shiprocketWebhook, getLastWebhookCall } from "../controllers/shipping.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.post("/webhook", shiprocketWebhook);
router.get("/debug/last-webhook", authenticate, requireAdmin, getLastWebhookCall);
export default router;
