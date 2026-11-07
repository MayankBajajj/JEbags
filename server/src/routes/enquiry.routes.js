import { Router } from "express";
import { createEnquiry, adminListEnquiries, updateEnquiryStatus } from "../controllers/enquiry.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createEnquiry); // public — bulk/brand enquiry form

router.get("/admin/all", authenticate, requireAdmin, adminListEnquiries);
router.patch("/admin/:id/status", authenticate, requireAdmin, updateEnquiryStatus);

export default router;
