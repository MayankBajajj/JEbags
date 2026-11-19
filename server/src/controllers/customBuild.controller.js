import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { z } from "zod";
import CustomBuildPreview from "../models/CustomBuildPreview.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { editProductImage } from "../config/gemini.js";
import { uploadBuffer } from "../config/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_IMAGE_PATH = path.join(__dirname, "../../public/images/hero-bag-3d.png");

// bump this if the prompt below changes meaningfully, so old cached renders
// (made with the previous wording) aren't served for new requests
const PROMPT_VERSION = "v1";

const previewSchema = z.object({
  material: z.string().trim().min(2).max(60),
  colorHex: z
    .string()
    .trim()
    .regex(/^#?[0-9a-fA-F]{6}$/)
    .optional(),
  colorLabel: z.string().trim().max(40).optional(),
});

function buildCacheKey({ material, colorHex, colorLabel }) {
  const colorKey = (colorHex || colorLabel || "").trim().toLowerCase();
  return [PROMPT_VERSION, material.trim().toLowerCase(), colorKey].join("|");
}

function buildPrompt({ material, colorHex, colorLabel }) {
  const colorPhrase = colorLabel || colorHex ? `, dyed ${colorLabel || colorHex}` : "";
  return (
    `Using the attached product photo as the exact reference for the backpack's shape, proportions, ` +
    `panel layout, stitching, zippers, and hardware, re-render the SAME backpack with its main body ` +
    `fabric changed to ${material}${colorPhrase}. Keep the logo badge, zipper pulls, straps, and overall ` +
    `silhouette identical to the reference. Keep the same plain, softly lit studio background and camera ` +
    `angle. Photorealistic product photography, no added text, no watermark.`
  );
}

// Shared by the HTTP handler below and the seed script
// (server/src/utils/seedCustomBuildPreviews.js) that pre-warms the cache for
// the fixed material x color grid in one batch.
export async function getOrGeneratePreviewFor(data) {
  const cacheKey = buildCacheKey(data);

  const cached = await CustomBuildPreview.findOne({ cacheKey });
  if (cached) {
    return { imageUrl: cached.imageUrl, cached: true };
  }

  const baseImageBuffer = fs.readFileSync(BASE_IMAGE_PATH);
  const prompt = buildPrompt(data);

  const generatedBuffer = await editProductImage(prompt, baseImageBuffer, "image/png");
  if (!generatedBuffer) {
    return { failed: true };
  }

  const { url, publicId } = await uploadBuffer(generatedBuffer, "jebags/custom-build-previews");

  await CustomBuildPreview.create({
    cacheKey,
    material: data.material,
    colorHex: data.colorHex,
    colorLabel: data.colorLabel,
    imageUrl: url,
    publicId,
  });

  return { imageUrl: url, cached: false };
}

export const getOrGeneratePreview = asyncHandler(async (req, res) => {
  const data = previewSchema.parse(req.body);
  const result = await getOrGeneratePreviewFor(data);

  if (result.failed) {
    return res.status(422).json({
      message: "Couldn't generate a preview for that material/color — try a more specific, real-world description (e.g. \"waxed cotton canvas\", \"forest green\").",
    });
  }

  res.json({ imageUrl: result.imageUrl, cached: result.cached });
});
