import mongoose from "mongoose";

// One row per (material + color) combination the AI has already rendered —
// looked up before ever calling the image model, so the same combo is never
// paid for twice.
const customBuildPreviewSchema = new mongoose.Schema(
  {
    cacheKey: { type: String, required: true, unique: true, index: true },
    material: { type: String, required: true },
    colorHex: { type: String },
    colorLabel: { type: String },
    imageUrl: { type: String, required: true },
    publicId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("CustomBuildPreview", customBuildPreviewSchema);
