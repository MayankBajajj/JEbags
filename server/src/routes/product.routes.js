import { Router } from "express";
import multer from "multer";
import {
  getCategories,
  listProducts,
  getProductBySlug,
  adminListProducts,
  createProduct,
  updateProduct,
  removeProductImage,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

const router = Router();

// Public
router.get("/categories", getCategories);
router.get("/", listProducts);
router.get("/:slug", getProductBySlug);

// Admin
router.get("/admin/all", authenticate, requireAdmin, adminListProducts);
router.post("/admin", authenticate, requireAdmin, upload.array("images", 6), createProduct);
router.patch("/admin/:id", authenticate, requireAdmin, upload.array("images", 6), updateProduct);
router.delete("/admin/:id/images/:publicId", authenticate, requireAdmin, removeProductImage);
router.delete("/admin/:id", authenticate, requireAdmin, deleteProduct);

export default router;
