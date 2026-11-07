import { z } from "zod";
import Enquiry from "../models/Enquiry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { phoneSchema, nameSchema } from "../utils/validators.js";
import { sendMail } from "../utils/mailer.js";

const enquirySchema = z.object({
  name: nameSchema,
  company: z.string().trim().optional(),
  email: z.string().trim().email(),
  phone: phoneSchema,
  type: z.enum(["bulk", "brand", "oem", "general"]).default("general"),
  estimatedQuantity: z.coerce.number().positive().optional(),
  message: z.string().trim().min(5, "Tell us a bit more about what you need"),
});

export const createEnquiry = asyncHandler(async (req, res) => {
  const data = enquirySchema.parse(req.body);
  const enquiry = await Enquiry.create(data);

  sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `New ${data.type} enquiry from ${data.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#0f1e36">New Enquiry — JE BAGS</h2>
        <table style="width:100%;font-size:14px;color:#1a1a1a">
          <tr><td style="padding:4px 0;color:#6b6151">Name</td><td style="padding:4px 0">${data.name}</td></tr>
          <tr><td style="padding:4px 0;color:#6b6151">Email</td><td style="padding:4px 0">${data.email}</td></tr>
          <tr><td style="padding:4px 0;color:#6b6151">Phone</td><td style="padding:4px 0">${data.phone}</td></tr>
          ${data.company ? `<tr><td style="padding:4px 0;color:#6b6151">Company</td><td style="padding:4px 0">${data.company}</td></tr>` : ""}
          <tr><td style="padding:4px 0;color:#6b6151">Type</td><td style="padding:4px 0">${data.type}</td></tr>
          ${data.estimatedQuantity ? `<tr><td style="padding:4px 0;color:#6b6151">Est. Quantity</td><td style="padding:4px 0">${data.estimatedQuantity}</td></tr>` : ""}
        </table>
        <p style="margin-top:16px;color:#6b6151">Message:</p>
        <p style="white-space:pre-wrap">${data.message}</p>
      </div>
    `,
  }).catch((err) => console.error("Failed to send enquiry notification email:", err));

  res.status(201).json({ message: "Enquiry received, our team will reach out shortly", enquiry });
});

// --- Admin ---

export const adminListEnquiries = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Enquiry.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "quoted", "closed"]),
});

export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
  res.json({ enquiry });
});
