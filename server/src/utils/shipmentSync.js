import Order from "../models/Order.js";
import { isConfigured } from "../config/shiprocket.js";
import { refreshShipmentStatus } from "../services/shiprocket.service.js";

const SWEEP_INTERVAL_MS = 30 * 60 * 1000;

// Statuses after which Shiprocket's own status won't change again — no point
// re-polling these on every sweep.
const TERMINAL_STATUSES = ["DELIVERED", "CANCELED", "CANCELLED", "RTO DELIVERED"];

// Keeps shipment status (AWB, courier, current status) in sync without the
// customer or admin needing to click "Check Shipping Status" themselves —
// this is what makes shipped/delivered show up on its own.
async function sweepOnce() {
  if (!isConfigured()) return;

  const inFlight = await Order.find({
    "shiprocket.shipmentId": { $exists: true, $ne: "" },
    "shiprocket.status": { $nin: TERMINAL_STATUSES },
  }).select("_id");

  for (const { _id } of inFlight) {
    try {
      await refreshShipmentStatus(_id);
    } catch (err) {
      console.error(`Shipment status sweep failed for order ${_id}:`, err.message);
    }
  }
}

export function startShipmentStatusSweep() {
  sweepOnce().catch((err) => console.error("Shipment status sweep failed:", err.message));
  setInterval(() => {
    sweepOnce().catch((err) => console.error("Shipment status sweep failed:", err.message));
  }, SWEEP_INTERVAL_MS);
}
