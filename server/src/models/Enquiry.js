import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    type: { type: String, enum: ["bulk", "brand", "oem", "general"], default: "general" },
    estimatedQuantity: Number,
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "quoted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
