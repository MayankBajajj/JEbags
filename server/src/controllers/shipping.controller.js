import { verifyWebhookToken } from "../config/shiprocket.js";
import { applyShiprocketWebhook } from "../services/shiprocket.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Kept only for the admin debug endpoint below, so the exact payload shape
// can be checked without server console access — not persisted anywhere
// else, and safe to remove once the field names are confirmed working.
let lastWebhookCall = null;

// Public (no auth middleware) — verified via the static secret key Shiprocket
// echoes back in the x-api-key header, configured on their webhook screen.
export const shiprocketWebhook = asyncHandler(async (req, res) => {
  const token = req.headers["x-api-key"] || req.headers["x-api-token"];
  lastWebhookCall = { at: new Date(), tokenOk: verifyWebhookToken(token), body: req.body };

  if (!verifyWebhookToken(token)) {
    console.error("Shiprocket webhook: invalid or missing token");
    return res.status(401).json({ message: "Invalid token" });
  }

  console.log("Shiprocket webhook payload:", JSON.stringify(req.body));

  try {
    const result = await applyShiprocketWebhook(req.body || {});
    lastWebhookCall.applyResult = result;
    if (!result.updated) {
      console.warn(`Shiprocket webhook: ${result.reason}`, req.body);
    }
  } catch (err) {
    lastWebhookCall.error = err.message;
    console.error("Shiprocket webhook processing error:", err.message);
  }

  res.json({ ok: true });
});

// Admin-only — lets us see the exact shape of the most recent webhook call
// without needing server console/log access. Remove once this integration
// has been confirmed working against real traffic for a while.
export const getLastWebhookCall = (req, res) => {
  res.json({ lastWebhookCall });
};
