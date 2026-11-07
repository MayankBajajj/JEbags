import mongoose from "mongoose";
import { CATEGORIES } from "../constants/categories.js";

const imageSchema = new mongoose.Schema(
  { url: { type: String, required: true }, publicId: { type: String, required: true } },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // in INR
    compareAtPrice: { type: Number, min: 0 },
    images: { type: [imageSchema], validate: (v) => v.length > 0 },
    category: { type: String, required: true, enum: CATEGORIES },
    tags: [String],
    moq: { type: Number, default: 1 }, // minimum order quantity
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
