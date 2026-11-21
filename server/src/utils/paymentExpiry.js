import Order from "../models/Order.js";
import { reconcileOrder, markOrderFailed } from "../services/payment.service.js";

const SWEEP_INTERVAL_MS = 5 * 60 * 1000;

// Safety net for abandoned checkouts: if a Razorpay order has sat unpaid
// past its expiry, double-check with Razorpay directly (in case a payment
// actually went through but our webhook never arrived) before giving up and
// releasing the reserved stock.
async function sweepOnce() {
  const stuck = await Order.find({
    paymentMethod: "razorpay",
    paymentStatus: "pending",
    paymentExpiresAt: { $lt: new Date() },
  }).select("_id");

  for (const { _id } of stuck) {
    try {
      const result = await reconcileOrder(_id);
      if (!result.updated) {
        await markOrderFailed(_id, { reason: "expired", source: "sweep" });
      }
    } catch (err) {
      console.error(`Payment expiry sweep failed for order ${_id}:`, err.message);
    }
  }
}

export function startPaymentExpirySweep() {
  sweepOnce().catch((err) => console.error("Payment expiry sweep failed:", err.message));
  setInterval(() => {
    sweepOnce().catch((err) => console.error("Payment expiry sweep failed:", err.message));
  }, SWEEP_INTERVAL_MS);
}
