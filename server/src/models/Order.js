import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot at time of order
    price: { type: Number, required: true }, // snapshot at time of order
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: {
      label: String,
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
      phone: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "razorpay" },
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    refund: {
      id: String,
      amount: Number, // rupees
      status: { type: String, enum: ["none", "created", "processed", "failed"], default: "none" },
    },
    // Reserved stock is released and the order is marked failed if payment
    // hasn't completed by this time — see utils/paymentExpiry.js.
    paymentExpiresAt: Date,
    // Audit trail for every verify/webhook/reconcile touch — this is what
    // makes "payment deducted but order not showing" cases debuggable rather
    // than a mystery, since every signal we ever received is kept here.
    paymentEvents: [
      {
        source: { type: String, enum: ["verify", "webhook", "reconcile", "sweep", "admin"], required: true },
        event: { type: String, required: true },
        paymentId: String,
        at: { type: Date, default: Date.now },
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
