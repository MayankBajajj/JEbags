import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getOrGeneratePreview } from "../controllers/customBuild.controller.js";

const router = Router();

// Cached combos return instantly and skip this limiter's cost concern, but an
// uncached combo calls a paid AI model — cap how often a single visitor can
// trigger fresh generations.
const previewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many preview requests, please try again in a few minutes" },
});

router.post("/preview", previewLimiter, getOrGeneratePreview);

export default router;
