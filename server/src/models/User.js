import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Required for customers (their login is phone + password); optional for
    // admins, who log in with email + password instead. `sparse` lets more
    // than one admin omit phone without tripping the unique index.
    phone: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    company: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    // Verification is via emailed OTP for now; phone OTP (SMS) is added later.
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    addresses: [addressSchema],

    // Single-slot OTP, reused for signup verification and OTP login/reset.
    otp: {
      codeHash: String,
      purpose: { type: String, enum: ["signup", "login", "reset"] },
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
