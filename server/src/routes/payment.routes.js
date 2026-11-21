import { Router } from "express";
import { razorpayWebhook } from "../controllers/payment.controller.js";

const router = Router();

// Public — called by Razorpay's servers, not the browser. Authenticity is
// verified via the webhook signature inside the controller, not auth
// middleware.
router.post("/razorpay/webhook", razorpayWebhook);

export default router;
