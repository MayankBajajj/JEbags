import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  reconcilePayment,
  refreshShipping,
  myOrders,
  getOrder,
  adminListOrders,
  updateOrderStatus,
  refundOrder,
  salesAnalytics,
} from "../controllers/order.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, createOrder);
router.get("/mine", authenticate, myOrders);

router.get("/admin/all", authenticate, requireAdmin, adminListOrders);
router.get("/admin/analytics", authenticate, requireAdmin, salesAnalytics);
router.patch("/admin/:id/status", authenticate, requireAdmin, updateOrderStatus);
router.post("/admin/:id/refund", authenticate, requireAdmin, refundOrder);

router.post("/:id/verify", authenticate, verifyPayment);
router.get("/:id/reconcile", authenticate, reconcilePayment);
router.get("/:id/shipping", authenticate, refreshShipping);
router.get("/:id", authenticate, getOrder);

export default router;
