import { z } from "zod";

// Indian mobile numbers: exactly 10 digits, first digit 6-9 (never 0-5).
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number (cannot start with 0-5)");

// Indian PIN codes: exactly 6 digits, first digit 1-9 (never 0).
export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode");

export const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters");
