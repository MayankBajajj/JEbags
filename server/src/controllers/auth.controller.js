import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { phoneSchema, nameSchema } from "../utils/validators.js";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookie(res, user) {
  res.cookie("token", signToken(user), cookieOptions);
}

function publicUser(user) {
  const { _id, name, email, phone, company, role, isEmailVerified, addresses } = user;
  return { id: _id, name, email, phone, company, role, isEmailVerified, addresses };
}

// OTP is emailed for now — phone (SMS) verification is added later once an
// SMS provider is wired up (see server/.env.example, SMS_PROVIDER).
async function issueAndSendOtp(user, purpose) {
  const code = generateOtp();
  user.otp = {
    codeHash: await hashOtp(code),
    purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
    attempts: 0,
  };
  await user.save();
  await sendOtpEmail(user.email, code);
}

const signupSchema = z.object({
  name: nameSchema,
  email: z.string().trim().email(),
  phone: phoneSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().trim().optional(),
});

export const signup = asyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body);

  const existing = await User.findOne({ $or: [{ email: data.email }, { phone: data.phone }] });
  if (existing) {
    return res.status(409).json({ message: "An account with this email or phone already exists" });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    passwordHash,
  });

  await issueAndSendOtp(user, "signup");

  res.status(201).json({ message: "OTP sent to your email", email: user.email });
});

const requestOtpSchema = z.object({
  email: z.string().trim().email(),
  purpose: z.enum(["signup", "login", "reset"]),
});

export const requestOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = requestOtpSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No account found for this email" });
  }
  if (purpose === "signup" && user.isEmailVerified) {
    return res.status(400).json({ message: "This account is already verified" });
  }

  await issueAndSendOtp(user, purpose);
  res.json({ message: "OTP sent" });
});

const verifyOtpSchema = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().length(6, "Enter the 6-digit code"),
});

export const verifyOtpCode = asyncHandler(async (req, res) => {
  const { email, code } = verifyOtpSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user?.otp?.codeHash) {
    return res.status(400).json({ message: "No OTP requested for this account" });
  }
  if (user.otp.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired, request a new one" });
  }
  if (user.otp.attempts >= MAX_OTP_ATTEMPTS) {
    return res.status(429).json({ message: "Too many attempts, request a new OTP" });
  }

  const match = await verifyOtp(code, user.otp.codeHash);
  if (!match) {
    user.otp.attempts += 1;
    await user.save();
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  const purpose = user.otp.purpose;
  if (purpose === "signup") user.isEmailVerified = true;
  user.otp = undefined;
  await user.save();

  // For 'reset' purpose: OTP is now consumed, so rather than issuing a
  // separate reset token we log the user in directly and let the client
  // call /auth/set-password while authenticated.
  setAuthCookie(res, user);
  res.json({ message: "Verified", user: publicUser(user) });
});

const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Password is required"),
});

export const login = asyncHandler(async (req, res) => {
  const { phone, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(401).json({ message: "Invalid phone number or password" });
  }
  if (!user.isEmailVerified) {
    return res.status(403).json({ message: "Please verify your email first" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid phone number or password" });
  }

  setAuthCookie(res, user);
  res.json({ user: publicUser(user) });
});

const setPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

// Called while authenticated (after an OTP-based login/reset) to set a new password.
export const setPassword = asyncHandler(async (req, res) => {
  const { newPassword } = setPasswordSchema.parse(req.body);
  const user = await User.findById(req.user.id);
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
});

const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1, "Password is required"),
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = adminLoginSchema.parse(req.body);

  const user = await User.findOne({ email, role: "admin" });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  setAuthCookie(res, user);
  res.json({ user: publicUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: publicUser(user) });
});
