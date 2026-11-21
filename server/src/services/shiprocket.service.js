import Order from "../models/Order.js";
import { isConfigured, createShiprocketOrder, trackShipmentById } from "../config/shiprocket.js";

// Fired once, right after a payment is confirmed (see payment.service.js's
// markOrderPaid) — pushes the order into Shiprocket so it shows up there for
// the pickup/courier/label workflow. Errors are stored on the order instead
// of thrown, since this runs fire-and-forget and must never block a payment
// confirmation from succeeding.
export async function syncOrderToShiprocket(orderId) {
  const order = await Order.findById(orderId).populate("user", "name email");
  if (!order) return { synced: false, reason: "not_found" };
  if (order.shiprocket?.orderId) return { synced: false, reason: "already_synced" };

  if (!isConfigured()) {
    const message = "Shiprocket is not configured";
    await Order.updateOne({ _id: orderId }, { $set: { "shiprocket.error": message } });
    return { synced: false, reason: "not_configured", error: message };
  }

  try {
    const result = await createShiprocketOrder(order, order.user);
    await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          "shiprocket.orderId": String(result.order_id ?? ""),
          "shiprocket.shipmentId": String(result.shipment_id ?? ""),
          "shiprocket.status": result.status || "NEW",
          "shiprocket.error": "",
          "shiprocket.lastSyncedAt": new Date(),
        },
      }
    );
    return { synced: true, result };
  } catch (err) {
    console.error(`Shiprocket order creation failed for order ${orderId}:`, err.message);
    await Order.updateOne({ _id: orderId }, { $set: { "shiprocket.error": err.message } });
    return { synced: false, reason: "api_error", error: err.message };
  }
}

// Pulls the latest courier/AWB/status from Shiprocket for an order that's
// already been pushed there — used by the manual "Check Shipping Status"
// action and the periodic sweep in utils/shipmentSync.js.
export async function refreshShipmentStatus(orderId) {
  const order = await Order.findById(orderId);
  if (!order) return { updated: false, reason: "not_found" };
  if (!order.shiprocket?.shipmentId) return { updated: false, reason: "not_shipped", order };

  const data = await trackShipmentById(order.shiprocket.shipmentId);
  // Shiprocket's track-by-shipment response has varied shape across API
  // versions — handle both a keyed-by-id wrapper and a flat tracking_data.
  const trackingData = data?.tracking_data || data?.[order.shiprocket.shipmentId]?.tracking_data || {};
  const latestTrack = trackingData.shipment_track?.[0] || {};

  const awbCode = latestTrack.awb_code || order.shiprocket.awbCode || "";
  const update = {
    "shiprocket.status": latestTrack.current_status || trackingData.track_status || order.shiprocket.status,
    "shiprocket.awbCode": awbCode,
    "shiprocket.courierName": latestTrack.courier_name || order.shiprocket.courierName || "",
    "shiprocket.trackingUrl": trackingData.track_url || (awbCode ? `https://shiprocket.co/tracking/${awbCode}` : ""),
    "shiprocket.lastSyncedAt": new Date(),
  };

  const updated = await Order.findOneAndUpdate({ _id: orderId }, { $set: update }, { new: true });
  return { updated: true, order: updated };
}

// Confirmed against a real Shiprocket webhook test call. Note the field
// naming is confusing because "order_id" means different things in
// different Shiprocket API calls: in the webhook, `order_id` is actually
// OUR OWN order_id as given at creation (our Order._id), while
// `sr_order_id` is Shiprocket's own numeric order id (which is what the
// create-order response calls `order_id`, and what's stored as
// shiprocket.orderId). There's no shipment_id in this payload at all.
export async function applyShiprocketWebhook(payload) {
  const ourOrderId = payload.order_id;
  const srOrderId = payload.sr_order_id != null ? String(payload.sr_order_id) : undefined;

  let order = null;
  if (ourOrderId) order = await Order.findById(ourOrderId).catch(() => null);
  if (!order && srOrderId) order = await Order.findOne({ "shiprocket.orderId": srOrderId });

  if (!order) return { updated: false, reason: "no_matching_order" };

  const awbCode = payload.awb || order.shiprocket.awbCode || "";
  const status = payload.current_status || payload.shipment_status || order.shiprocket.status;

  await Order.updateOne(
    { _id: order._id },
    {
      $set: {
        "shiprocket.status": status,
        "shiprocket.awbCode": awbCode,
        "shiprocket.courierName": payload.courier_name || order.shiprocket.courierName || "",
        "shiprocket.trackingUrl": awbCode ? `https://shiprocket.co/tracking/${awbCode}` : order.shiprocket.trackingUrl || "",
        "shiprocket.lastSyncedAt": new Date(),
      },
    }
  );

  return { updated: true, orderId: order._id };
}
