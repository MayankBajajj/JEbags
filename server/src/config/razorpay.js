import Razorpay from "razorpay";
import crypto from "crypto";

let client = null;
function getClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  if (!client) {
    client = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return client;
}

export function isConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(amountRupees, receipt) {
  const rp = getClient();
  if (!rp) throw new Error("Razorpay is not configured — set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET");
  return rp.orders.create({
    amount: Math.round(amountRupees * 100), // Razorpay wants the amount in paise
    currency: "INR",
    receipt,
  });
}

export async function fetchRazorpayPayment(paymentId) {
  const rp = getClient();
  if (!rp) throw new Error("Razorpay is not configured");
  return rp.payments.fetch(paymentId);
}

export async function fetchRazorpayOrderPayments(razorpayOrderId) {
  const rp = getClient();
  if (!rp) throw new Error("Razorpay is not configured");
  return rp.orders.fetchPayments(razorpayOrderId);
}

// amountRupees omitted = full refund of whatever was captured.
export async function createRazorpayRefund(paymentId, amountRupees) {
  const rp = getClient();
  if (!rp) throw new Error("Razorpay is not configured");
  const opts = amountRupees != null ? { amount: Math.round(amountRupees * 100) } : {};
  return rp.payments.refund(paymentId, opts);
}

// Client-side checkout success callback gives us order_id + payment_id +
// signature. This proves the pair is authentic (not a forged callback), but
// — per Razorpay's own guidance — the actual captured amount should still be
// fetched and checked server-side before trusting it; see payment.service.js.
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return timingSafeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET || !signature) return false;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return timingSafeEqualHex(expected, signature);
}

function timingSafeEqualHex(a, b) {
  if (typeof b !== "string" || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}
