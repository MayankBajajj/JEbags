import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { fetchRazorpayOrderPayments, createRazorpayRefund } from "../config/razorpay.js";
import { sendMail } from "../utils/mailer.js";
import { syncOrderToShiprocket } from "./shiprocket.service.js";

// All three entry points into "a payment happened" — the client-side verify
// call, the Razorpay webhook, and the manual/swept reconcile check — funnel
// through this one function. The `paymentStatus: { $ne: "paid" }` filter
// makes the transition atomic at the database level, so no matter which of
// the three fires first (or if several fire within milliseconds of each
// other, which is normal — the webhook and the client callback usually race
// each other), the order is only ever marked paid, stock decremented, and
// the confirmation email sent exactly once.
export async function markOrderPaid(orderId, { paymentId, signature, amountPaise, source, event }) {
  const expectedPaise = Math.round((await Order.findById(orderId))?.totalAmount * 100);

  if (typeof amountPaise === "number" && amountPaise !== expectedPaise) {
    await Order.updateOne(
      { _id: orderId },
      { $push: { paymentEvents: { source, event: `amount_mismatch:${amountPaise}`, paymentId, at: new Date() } } }
    );
    return { updated: false, reason: "amount_mismatch" };
  }

  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus: "paid",
        status: "confirmed",
        "razorpay.paymentId": paymentId,
        ...(signature ? { "razorpay.signature": signature } : {}),
        paymentExpiresAt: null,
      },
      $push: { paymentEvents: { source, event, paymentId, at: new Date() } },
    },
    { new: true }
  ).populate("user", "name email");

  if (!order) {
    // The filter excluded this doc, meaning either another path (usually
    // the webhook) already won the race and paid it first, or the order
    // doesn't exist. Either way, callers need the CURRENT state here, not
    // the pre-update snapshot they already have — otherwise a caller like
    // verifyPayment would report "not paid" for an order that is, in fact,
    // already paid.
    const existing = await Order.findById(orderId).populate("user", "name email");
    if (existing?.paymentStatus === "paid") {
      return { updated: false, reason: "already_paid", order: existing };
    }
    return { updated: false, reason: "missing" };
  }

  sendOrderConfirmation(order).catch((err) => console.error("Order confirmation email failed:", err.message));
  syncOrderToShiprocket(order._id).catch((err) => console.error("Shiprocket sync failed:", err.message));
  return { updated: true, order };
}

export async function markOrderFailed(orderId, { reason, source }) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: "pending" },
    {
      $set: { paymentStatus: "failed", paymentExpiresAt: null },
      $push: { paymentEvents: { source, event: `failed:${reason}`, at: new Date() } },
    },
    { new: true }
  );

  if (!order) return { updated: false };

  // Payment definitively failed — release the stock that was reserved at
  // order creation so it isn't locked up by an abandoned/failed checkout.
  await Promise.all(
    order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }))
  );

  return { updated: true, order };
}

// Used by the manual "Check Payment Status" button and the expiry sweep —
// asks Razorpay directly what actually happened to this order, for the
// exact case the webhook is meant to prevent but, rarely, might miss (e.g.
// the webhook URL was briefly unreachable).
export async function reconcileOrder(orderId) {
  const order = await Order.findById(orderId);
  if (!order) return { updated: false, reason: "not_found" };
  if (order.paymentStatus !== "pending" || !order.razorpay?.orderId) {
    return { updated: false, reason: "not_pending", order };
  }

  const payments = await fetchRazorpayOrderPayments(order.razorpay.orderId);
  const captured = payments.items?.find((p) => p.status === "captured");
  if (captured) {
    const result = await markOrderPaid(orderId, {
      paymentId: captured.id,
      amountPaise: captured.amount,
      source: "reconcile",
      event: "payment.captured",
    });
    return result.order ? result : { updated: false, order };
  }

  const failedOnly = payments.items?.length > 0 && payments.items.every((p) => p.status === "failed");
  if (failedOnly) {
    const result = await markOrderFailed(orderId, { reason: "razorpay_reports_failed", source: "reconcile" });
    return { ...result, order: result.order || order };
  }

  return { updated: false, reason: "still_pending", order };
}

// Triggered by an explicit admin action, never automatically on cancel —
// calls Razorpay's refund API and records the attempt as "created" right
// away; the webhook's refund.processed/refund.failed event is what actually
// confirms the outcome (refund.created here is optimistic bookkeeping only).
export async function initiateRefund(orderId, { amountRupees, source } = {}) {
  const order = await Order.findById(orderId);
  if (!order) return { updated: false, reason: "not_found" };
  if (order.paymentStatus !== "paid") return { updated: false, reason: "not_paid", order };
  if (!order.razorpay?.paymentId) return { updated: false, reason: "no_payment", order };

  const refund = await createRazorpayRefund(order.razorpay.paymentId, amountRupees);

  const updated = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      $set: {
        "refund.id": refund.id,
        "refund.amount": refund.amount / 100,
        "refund.status": refund.status === "processed" ? "processed" : "created",
      },
      $push: { paymentEvents: { source, event: `refund.${refund.status || "created"}`, paymentId: refund.id, at: new Date() } },
    },
    { new: true }
  );

  return { updated: true, order: updated, refund };
}

// Authoritative confirmation that the money actually went back — fired from
// the refund.processed webhook (or reconciled manually). Restores the stock
// that was held for this order, same as a failed payment would.
export async function markOrderRefunded(orderId, { refundId, amountPaise, source, event }) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: "paid" },
    {
      $set: {
        paymentStatus: "refunded",
        status: "cancelled",
        "refund.id": refundId,
        ...(typeof amountPaise === "number" ? { "refund.amount": amountPaise / 100 } : {}),
        "refund.status": "processed",
      },
      $push: { paymentEvents: { source, event, paymentId: refundId, at: new Date() } },
    },
    { new: true }
  ).populate("user", "name email");

  if (!order) return { updated: false, reason: "already_refunded_or_not_paid" };

  await Promise.all(
    order.items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }))
  );

  sendRefundNotification(order).catch((err) => console.error("Refund notification email failed:", err.message));
  return { updated: true, order };
}

export async function markRefundFailed(orderId, { refundId, reason, source }) {
  const order = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      $set: { "refund.status": "failed" },
      $push: { paymentEvents: { source, event: `refund.failed:${reason || ""}`, paymentId: refundId, at: new Date() } },
    },
    { new: true }
  );
  return { updated: Boolean(order), order };
}

async function sendRefundNotification(order) {
  if (!order.user?.email) return;
  await sendMail({
    to: order.user.email,
    subject: `Refund processed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#0f1e36">JE BAGS</h2>
        <p>Hi ${order.user.name?.split(" ")[0] || ""}, your refund for order #${order._id.toString().slice(-8).toUpperCase()} has been processed.</p>
        <p style="font-weight:700">Refund amount: ₹${(order.refund.amount || 0).toLocaleString("en-IN")}</p>
        <p style="color:#6b6151;font-size:13px">It should reflect in your original payment method within a few business days, depending on your bank.</p>
      </div>
    `,
  });
}

async function sendOrderConfirmation(order) {
  const lines = order.items.map((i) => `${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString("en-IN")}`);

  if (order.user?.email) {
    await sendMail({
      to: order.user.email,
      subject: `Order confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#0f1e36">JE BAGS</h2>
          <p>Thanks ${order.user.name?.split(" ")[0] || ""}, your payment was received and your order is confirmed.</p>
          <p style="color:#6b6151;font-size:13px">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
          <div style="font-size:14px;color:#1a1a1a;margin:16px 0">${lines.join("<br/>")}</div>
          <p style="font-weight:700">Total paid: ₹${order.totalAmount.toLocaleString("en-IN")}</p>
        </div>
      `,
    });
  }

  if (process.env.ADMIN_EMAIL) {
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `New paid order — #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#0f1e36">New Paid Order</h2>
          <p>${order.user?.name || "Customer"} (${order.user?.email || ""})</p>
          <div style="font-size:14px;color:#1a1a1a;margin:16px 0">${lines.join("<br/>")}</div>
          <p style="font-weight:700">Total: ₹${order.totalAmount.toLocaleString("en-IN")}</p>
        </div>
      `,
    });
  }
}
