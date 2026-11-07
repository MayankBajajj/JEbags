import { z } from "zod";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { phoneSchema, pincodeSchema } from "../utils/validators.js";

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

  // Reserve stock. In a high-concurrency setting this should be a transaction;
  // fine for current scale.
  await Promise.all(
    items.map((item) => Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } }))
  );

  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress: data.shippingAddress,
    totalAmount,
    notes: data.notes,
  });

  res.status(201).json({ order });
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
