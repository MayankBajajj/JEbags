import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  signup,
  requestOtp,
  verifyOtpCode,
  login,
  setPassword,
  adminLogin,
  logout,
  me,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests, try again later" },
});

const router = Router();

router.post("/signup", signup);
router.post("/request-otp", otpLimiter, requestOtp);
router.post("/verify-otp", otpLimiter, verifyOtpCode);
router.post("/login", login);
router.post("/set-password", authenticate, setPassword);
router.post("/admin/login", adminLogin);
router.post("/logout", logout);
router.get("/me", authenticate, me);

export default router;
