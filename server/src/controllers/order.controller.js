import { z } from "zod";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { phoneSchema, pincodeSchema } from "../utils/validators.js";
import { createRazorpayOrder, fetchRazorpayPayment, verifyPaymentSignature } from "../config/razorpay.js";
import { markOrderPaid, reconcileOrder, initiateRefund } from "../services/payment.service.js";
import { syncOrderToShiprocket, refreshShipmentStatus } from "../services/shiprocket.service.js";

const PAYMENT_EXPIRY_MINUTES = 20;

const checkoutSchema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive() }))
    .min(1, "Your cart is empty"),
  shippingAddress: z.object({
    label: z.string().trim().optional(),
    line1: z.string().trim().min(3, "Enter a street address"),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(2, "Enter a city"),
    state: z.string().trim().min(2, "Enter a state"),
    pincode: pincodeSchema,
    country: z.string().trim().optional(),
    phone: phoneSchema,
  }),
  notes: z.string().trim().optional(),
});

export const createOrder = asyncHandler(async (req, res) => {
  const data = checkoutSchema.parse(req.body);

  // Shipments must go out under the same phone number the customer logs in
  // with — the client already locks this field, but that's UI only, so it's
  // enforced here too.
  const requester = await User.findById(req.user.id).select("phone");
  if (requester?.phone && data.shippingAddress.phone !== requester.phone) {
    return res.status(400).json({ message: "Orders must be placed with the phone number on your account." });
  }

  const products = await Product.find({
    _id: { $in: data.items.map((i) => i.productId) },
    isActive: true,
  });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const items = [];
  let totalAmount = 0;

  for (const line of data.items) {
    const product = productMap.get(line.productId);
    if (!product) {
      return res.status(400).json({ message: `Product ${line.productId} is not available` });
    }
    if (product.stock < line.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: line.quantity,
    });
    totalAmount += product.price * line.quantity;
  }

  // Reserve stock up front so two checkouts can't both claim the last unit
  // while payment is in flight. If payment ultimately fails or the order
  // expires unpaid, payment.service.js puts this stock back.
  await Promise.all(
    items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } }))
  );

  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress: data.shippingAddress,
    totalAmount,
    paymentMethod: "razorpay",
    paymentExpiresAt: new Date(Date.now() + PAYMENT_EXPIRY_MINUTES * 60 * 1000),
  });

  let razorpayOrder;
  try {
    razorpayOrder = await createRazorpayOrder(totalAmount, order._id.toString());
  } catch (err) {
    // Payment gateway didn't accept the order — don't leave a dead order
    // sitting on reserved stock the customer can never actually pay for.
    await Promise.all(
      items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } }))
    );
    await Order.deleteOne({ _id: order._id });
    console.error("Razorpay order creation failed:", err.message);
    return res.status(502).json({ message: "Payment gateway is unavailable right now. Please try again shortly." });
  }

  order.razorpay.orderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    order,
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    amount: totalAmount,
    currency: "INR",
  });
});

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// Fast path: called from the browser the instant Razorpay's checkout modal
// reports success. Not trusted on its own for the amount — see
// payment.service.js's markOrderPaid — but the signature proves this
// order_id/payment_id pair genuinely came from Razorpay.
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifySchema.parse(req.body);

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not your order" });
  }
  if (order.razorpay?.orderId !== razorpay_order_id) {
    return res.status(400).json({ message: "Order mismatch" });
  }

  const validSignature = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!validSignature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const payment = await fetchRazorpayPayment(razorpay_payment_id).catch(() => null);
  if (!payment || payment.status !== "captured") {
    // Signature was genuine but the payment itself isn't captured yet (rare
    // timing edge case) — don't mark paid. The webhook will catch it the
    // moment it is, and the customer can also hit "Check Payment Status".
    return res.status(202).json({ message: "Payment is still processing", order });
  }

  const result = await markOrderPaid(order._id, {
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    amountPaise: payment.amount,
    source: "verify",
    event: "payment.captured",
  });

  // result.order reflects the CURRENT state even when this call lost a race
  // to the webhook (see markOrderPaid) — never fall back to the stale `order`
  // fetched before the update, or an already-paid order would be reported
  // as unpaid to the browser.
  const finalOrder = result.order || order;
  res.json({ order: finalOrder, paid: finalOrder.paymentStatus === "paid" });
});

// Manual "Check Payment Status" — and also what the expiry sweep calls
// before giving up on a stuck order. Asks Razorpay directly rather than
// trusting anything the client says.
export const reconcilePayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not your order" });
  }

  const result = await reconcileOrder(order._id);
  res.json({ order: result.order || order, updated: result.updated });
});

// Manual "Check Shipping Status" — pulls the latest AWB/courier/status from
// Shiprocket for an order already pushed there. If it was never pushed
// (e.g. Shiprocket was down when the payment first confirmed), this retries
// that instead.
export const refreshShipping = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not your order" });
  }

  if (!order.shiprocket?.shipmentId) {
    if (order.paymentStatus !== "paid") {
      return res.status(400).json({ message: "This order hasn't been paid for yet" });
    }
    const synced = await syncOrderToShiprocket(order._id);
    if (!synced.synced) {
      return res.status(502).json({ message: synced.error || "Couldn't reach Shiprocket yet, try again shortly" });
    }
    return res.json({ order: await Order.findById(order._id) });
  }

  const result = await refreshShipmentStatus(order._id);
  res.json({ order: result.order || order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not your order" });
  }
  res.json({ order });
});

// --- Admin ---

export const adminListOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter).populate("user", "name email phone").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ order });
});

// POST /api/orders/admin/:id/refund — a deliberate, separate admin action.
// Never triggered automatically by cancelling an order, since that would
// move real money without an explicit decision each time.
export const refundOrder = asyncHandler(async (req, res) => {
  const result = await initiateRefund(req.params.id, { source: "admin" });

  if (!result.updated) {
    const messages = {
      not_found: "Order not found",
      not_paid: "Only paid orders can be refunded",
      no_payment: "No payment record found for this order",
    };
    return res.status(400).json({ message: messages[result.reason] || "Refund could not be started" });
  }

  res.json({ order: result.order, refund: result.refund });
});

// GET /api/orders/admin/analytics
export const salesAnalytics = asyncHandler(async (req, res) => {
  const [totals] = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
  ]);

  const byStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const last30Days = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    revenue: totals?.revenue || 0,
    totalOrders: totals?.orders || 0,
    byStatus,
    last30Days,
  });
});
