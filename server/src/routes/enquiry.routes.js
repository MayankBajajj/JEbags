import { Router } from "express";
import multer from "multer";
import { createEnquiry, adminListEnquiries, updateEnquiryStatus } from "../controllers/enquiry.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

const router = Router();

// public — bulk/brand enquiry form, with an optional reference photo.
// multer only engages for multipart/form-data requests, so plain-JSON
// callers (e.g. the Contact page) are unaffected.
router.post("/", upload.single("photo"), createEnquiry);

router.get("/admin/all", authenticate, requireAdmin, adminListEnquiries);
router.patch("/admin/:id/status", authenticate, requireAdmin, updateEnquiryStatus);

export default router;
