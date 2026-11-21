import Order from "../models/Order.js";
import { verifyWebhookSignature } from "../config/razorpay.js";
import { markOrderPaid, markOrderFailed, markOrderRefunded, markRefundFailed } from "../services/payment.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// This is the authoritative confirmation path — it's what still marks an
// order paid even if the customer closed the tab, lost signal, or the
// browser crashed right after paying, which is exactly the "money left my
// account but the site still shows pending" scenario. Razorpay calls this
// directly, so it is NEVER gated behind our own auth middleware; it's
// gated by verifying Razorpay's own signature instead.
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.rawBody;

  if (!rawBody || !verifyWebhookSignature(rawBody.toString(), signature)) {
    console.error("Razorpay webhook: invalid signature");
    return res.status(400).json({ message: "Invalid signature" });
  }

  const { event, payload } = req.body;

  try {
    if (event === "payment.captured" || event === "order.paid") {
      const payment = payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      if (payment && razorpayOrderId) {
        const order = await Order.findOne({ "razorpay.orderId": razorpayOrderId });
        if (order) {
          await markOrderPaid(order._id, {
            paymentId: payment.id,
            amountPaise: payment.amount,
            source: "webhook",
            event,
          });
        } else {
          console.warn(`Razorpay webhook: no local order for razorpay order ${razorpayOrderId}`);
        }
      }
    } else if (event === "payment.failed") {
      const payment = payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      if (razorpayOrderId) {
        const order = await Order.findOne({ "razorpay.orderId": razorpayOrderId });
        if (order) {
          await markOrderFailed(order._id, {
            reason: payment.error_description || payment.error_code || "payment_failed",
            source: "webhook",
          });
        }
      }
    } else if (event === "refund.processed") {
      // Authoritative: the money has actually been returned. This is what
      // we show "refunded" on, not the earlier refund.created event, since
      // refunds can still fail after being created.
      const refund = payload?.refund?.entity;
      if (refund?.payment_id) {
        const order = await Order.findOne({ "razorpay.paymentId": refund.payment_id });
        if (order) {
          await markOrderRefunded(order._id, {
            refundId: refund.id,
            amountPaise: refund.amount,
            source: "webhook",
            event,
          });
        } else {
          console.warn(`Razorpay webhook: no local order for payment ${refund.payment_id}`);
        }
      }
    } else if (event === "refund.failed") {
      const refund = payload?.refund?.entity;
      if (refund?.payment_id) {
        const order = await Order.findOne({ "razorpay.paymentId": refund.payment_id });
        if (order) {
          await markRefundFailed(order._id, { refundId: refund.id, reason: "razorpay_reports_failed", source: "webhook" });
        }
      }
    } else if (event === "refund.created") {
      // Already recorded optimistically when the admin triggered it (see
      // initiateRefund) — nothing further to do until processed/failed fires.
      console.log(`Razorpay webhook: refund.created acknowledged for ${payload?.refund?.entity?.id}`);
    } else {
      console.log(`Razorpay webhook: unhandled event "${event}"`);
    }
  } catch (err) {
    // Still ack with 200 below — we don't want Razorpay hammering retries
    // over an error on our end; it's logged here for us to go fix.
    console.error("Razorpay webhook processing error:", err.message);
  }

  // Always acknowledge quickly once the signature checks out, per Razorpay's
  // own guidance — slow/failed responses trigger repeated retries.
  res.json({ ok: true });
});
