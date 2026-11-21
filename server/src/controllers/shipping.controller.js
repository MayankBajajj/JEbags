import { verifyWebhookToken } from "../config/shiprocket.js";
import { applyShiprocketWebhook } from "../services/shiprocket.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Public (no auth middleware) — verified via the static secret key Shiprocket
// echoes back in the x-api-key header, configured on their webhook screen.
// Logs the raw payload on first use since the exact field names Shiprocket
// sends haven't been confirmed against a live call yet; safe to remove once
// this has been seen working.
export const shiprocketWebhook = asyncHandler(async (req, res) => {
  const token = req.headers["x-api-key"] || req.headers["x-api-token"];
  if (!verifyWebhookToken(token)) {
    console.error("Shiprocket webhook: invalid or missing token");
    return res.status(401).json({ message: "Invalid token" });
  }

  console.log("Shiprocket webhook payload:", JSON.stringify(req.body));

  try {
    const result = await applyShiprocketWebhook(req.body || {});
    if (!result.updated) {
      console.warn(`Shiprocket webhook: ${result.reason}`, req.body);
    }
  } catch (err) {
    console.error("Shiprocket webhook processing error:", err.message);
  }

  res.json({ ok: true });
});
