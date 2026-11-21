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

// Shiprocket's field names for its webhook payload aren't 100% confirmed
// without having seen a real call yet — this reads several plausible
// spellings for each value so it degrades gracefully if the exact shape
// differs from what's assumed here. `channel_order_id` is the order_id WE
// sent when creating the order (our own Order._id), so that's the most
// reliable way to find the right doc; Shiprocket's own order/shipment id
// are the fallbacks.
export async function applyShiprocketWebhook(payload) {
  const channelOrderId = payload.channel_order_id || payload.order_id_channel;
  const shiprocketOrderId = payload.order_id ? String(payload.order_id) : undefined;
  const shipmentId = payload.shipment_id ? String(payload.shipment_id) : undefined;

  let order = null;
  if (channelOrderId) order = await Order.findById(channelOrderId).catch(() => null);
  if (!order && shiprocketOrderId) order = await Order.findOne({ "shiprocket.orderId": shiprocketOrderId });
  if (!order && shipmentId) order = await Order.findOne({ "shiprocket.shipmentId": shipmentId });

  if (!order) return { updated: false, reason: "no_matching_order" };

  const awbCode = payload.awb || payload.awb_code || order.shiprocket.awbCode || "";
  const status = payload.current_status || payload.status || payload.shipment_status || order.shiprocket.status;

  await Order.updateOne(
    { _id: order._id },
    {
      $set: {
        "shiprocket.status": status,
        "shiprocket.awbCode": awbCode,
        "shiprocket.courierName": payload.courier_name || payload.courier || order.shiprocket.courierName || "",
        "shiprocket.trackingUrl": awbCode ? `https://shiprocket.co/tracking/${awbCode}` : order.shiprocket.trackingUrl || "",
        "shiprocket.lastSyncedAt": new Date(),
      },
    }
  );

  return { updated: true, orderId: order._id };
}
