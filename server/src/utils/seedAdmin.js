import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Ensures an admin user exists, provisioned from ADMIN_* env vars.
 * Safe to run on every startup — no-ops if the admin already exists,
 * and re-syncs the password hash if ADMIN_PASSWORD has changed.
 */
export async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed");
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await User.findOne({ email: ADMIN_EMAIL, role: "admin" });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = ADMIN_NAME || existing.name;
    if (ADMIN_PHONE) existing.phone = ADMIN_PHONE;
    await existing.save();
    console.log(`Admin account synced: ${ADMIN_EMAIL}`);
    return;
  }

  await User.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL,
    ...(ADMIN_PHONE && { phone: ADMIN_PHONE }),
    passwordHash,
    role: "admin",
    isEmailVerified: true,
  });
  console.log(`Admin account created: ${ADMIN_EMAIL}`);
}
