import { Router } from "express";
import { shiprocketWebhook } from "../controllers/shipping.controller.js";

const router = Router();
router.post("/shiprocket/webhook", shiprocketWebhook);
export default router;
