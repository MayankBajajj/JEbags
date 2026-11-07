import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateOtp() {
  return String(crypto.randomInt(100000, 999999)); // 6 digits
}

export async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(code, hash) {
  return bcrypt.compare(code, hash);
}

/**
 * Sends an OTP by SMS. No SMS provider is wired up yet — see
 * server/.env.example (SMS_PROVIDER, MSG91_* / TWILIO_*).
 * Until one is configured, the OTP is logged to the server console so the
 * signup/login flow can be tested end-to-end in development.
 */
export async function sendOtpSms(phone, code) {
  const provider = process.env.SMS_PROVIDER;

  if (!provider) {
    console.log(`[OTP DEV MODE] ${phone} -> ${code}`);
    return;
  }

  if (provider === "msg91") {
    throw new Error("MSG91 integration not implemented yet");
  }

  if (provider === "twilio") {
    throw new Error("Twilio integration not implemented yet");
  }

  throw new Error(`Unknown SMS_PROVIDER: ${provider}`);
}
