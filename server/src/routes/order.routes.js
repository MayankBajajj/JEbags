import { Router } from "express";
import {
  createOrder,
  myOrders,
  getOrder,
  adminListOrders,
  updateOrderStatus,
  salesAnalytics,
} from "../controllers/order.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/mine", authenticate, myOrders);

router.get("/admin/all", authenticate, requireAdmin, adminListOrders);
router.get("/admin/analytics", authenticate, requireAdmin, salesAnalytics);
router.patch("/admin/:id/status", authenticate, requireAdmin, updateOrderStatus);

router.get("/:id", authenticate, getOrder);

export default router;
