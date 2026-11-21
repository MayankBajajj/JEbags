import { Router } from "express";
import { shiprocketWebhook } from "../controllers/shipping.controller.js";

const router = Router();
router.post("/webhook", shiprocketWebhook);
export default router;
