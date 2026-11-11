import { z } from "zod";
import Product from "../models/Product.js";
import { uploadBuffer, deleteImage } from "../config/cloudinary.js";
import { CATEGORIES } from "../constants/categories.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const getCategories = asyncHandler(async (req, res) => {
  res.json({ categories: CATEGORIES });
});

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, featured, page = 1, limit = 24 } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
});

// --- Admin ---

export const adminListProducts = asyncHandler(async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json({ items });
});

export const adminGetProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ product });
});

// z.coerce.boolean() treats any non-empty string (including "false") as true,
// since form-data sends booleans as strings — preprocess to the real value first.
const formBoolean = () => z.preprocess((v) => v === "true" || v === true, z.boolean());

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional(),
  category: z.enum(CATEGORIES),
  tags: z.string().optional(), // comma-separated in form-data
  moq: z.coerce.number().positive().optional(),
  stock: z.coerce.number().min(0).optional(),
  isFeatured: formBoolean().optional(),
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = productSchema.parse(req.body);

  if (!req.files?.length) {
    return res.status(400).json({ message: "At least one product image is required" });
  }
  const images = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer)));

  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let i = 1;
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${i++}`;
  }

  const product = await Product.create({
    ...data,
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
    slug,
    images,
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = productSchema.partial().parse(req.body);

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (req.files?.length) {
    const newImages = await Promise.all(req.files.map((f) => uploadBuffer(f.buffer)));
    product.images.push(...newImages);
  }

  Object.assign(product, {
    ...data,
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : product.tags,
  });
  await product.save();

  res.json({ product });
});

// Remove a single image from a product (admin picks which one in the UI).
export const removeProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const image = product.images.find((img) => img.publicId === req.params.publicId);
  if (!image) return res.status(404).json({ message: "Image not found on this product" });
  if (product.images.length === 1) {
    return res.status(400).json({ message: "A product needs at least one image" });
  }

  await deleteImage(image.publicId);
  product.images = product.images.filter((img) => img.publicId !== req.params.publicId);
  await product.save();

  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await Promise.all(product.images.map((img) => deleteImage(img.publicId)));
  res.json({ message: "Deleted" });
});
