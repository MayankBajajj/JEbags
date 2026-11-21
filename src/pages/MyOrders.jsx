import { useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";
import Icon from "../components/Icon";
import Button from "../components/Button";

const STATUS_LABEL = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STEPS = ["confirmed", "processing", "shipped", "delivered"];

function PaymentBadge({ order }) {
  const map = {
    paid: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    refunded: "bg-ink-100 text-ink-700 border-ink-900/15",
  };
  return (
    <span className={`inline-block text-xs font-semibold capitalize px-2.5 py-1 rounded-full border ${map[order.paymentStatus] || map.pending}`}>
      Payment {order.paymentStatus}
    </span>
  );
}

function OrderCard({ order, onRecheck, rechecking, onRefreshShipping, refreshingShipping }) {
  const [expanded, setExpanded] = useState(false);
  const shortId = order._id.slice(-8).toUpperCase();
  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="bg-white rounded-2xl border border-ink-900/10 overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-lg text-ink-950">Order #{shortId}</p>
          <p className="text-xs text-ink-700/60 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PaymentBadge order={order} />
          {order.refund?.status && order.refund.status !== "none" && (
            <span className="inline-block text-xs font-semibold capitalize px-2.5 py-1 rounded-full border bg-ink-100 text-ink-700 border-ink-900/15">
              Refund {order.refund.status}
            </span>
          )}
          <span className="text-sm font-semibold text-ink-950">₹{order.totalAmount.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {order.status !== "cancelled" && order.paymentStatus === "paid" && (
        <div className="px-6 pb-5">
          <div className="flex items-center">
            {STATUS_STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      i <= stepIndex ? "bg-gold-500 text-ink-950" : "bg-ink-100 text-ink-700/40"
                    }`}
                  >
                    {i <= stepIndex ? <Icon name="check" size={12} /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                  </div>
                  <span className={`text-[11px] font-medium whitespace-nowrap ${i <= stepIndex ? "text-ink-900" : "text-ink-700/40"}`}>
                    {STATUS_LABEL[s]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-[2px] flex-1 mx-2 mb-4 ${i < stepIndex ? "bg-gold-500" : "bg-ink-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="px-6 pb-5">
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full border bg-red-50 text-red-700 border-red-200">
            Order Cancelled
          </span>
        </div>
      )}

      {order.paymentStatus === "pending" && order.paymentMethod === "razorpay" && (
        <div className="px-6 pb-5">
          <p className="text-xs text-ink-700/70 mb-2">
            Payment is still processing. If your bank shows a deduction but this doesn't update, check status below.
          </p>
          <button
            onClick={() => onRecheck(order._id)}
            disabled={rechecking === order._id}
            className="text-xs font-semibold text-gold-600 hover:text-gold-700 disabled:opacity-50"
          >
            {rechecking === order._id ? "Checking..." : "Check Payment Status"}
          </button>
        </div>
      )}

      {order.paymentStatus === "failed" && (
        <div className="px-6 pb-5">
          <p className="text-xs text-red-600">
            This order's payment didn't go through, so it was not placed. Please reorder from the products page if you'd still like these items.
          </p>
        </div>
      )}

      {order.paymentStatus === "paid" && (
        <div className="px-6 pb-5">
          {order.shiprocket?.shipmentId ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-700">
              <span className="font-semibold text-ink-900">Shipping status: {order.shiprocket.status || "NEW"}</span>
              {order.shiprocket.awbCode && <span>AWB {order.shiprocket.awbCode}</span>}
              {order.shiprocket.courierName && <span>via {order.shiprocket.courierName}</span>}
              {order.shiprocket.trackingUrl && (
                <a href={order.shiprocket.trackingUrl} target="_blank" rel="noreferrer" className="font-semibold text-gold-600 hover:text-gold-700">
                  Track Shipment
                </a>
              )}
              <button
                onClick={() => onRefreshShipping(order._id)}
                disabled={refreshingShipping === order._id}
                className="font-semibold text-gold-600 hover:text-gold-700 disabled:opacity-50"
              >
                {refreshingShipping === order._id ? "Checking..." : "Refresh"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => onRefreshShipping(order._id)}
              disabled={refreshingShipping === order._id}
              className="text-xs font-semibold text-gold-600 hover:text-gold-700 disabled:opacity-50"
            >
              {refreshingShipping === order._id ? "Checking..." : "Check Shipping Status"}
            </button>
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-3 border-t border-ink-900/10 text-xs font-semibold text-ink-700 hover:bg-cream-50 transition-colors"
      >
        {expanded ? "Hide details" : "View items & address"}
        <Icon name="chevron-down" size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-1 border-t border-ink-900/10 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold text-ink-900 mb-2 uppercase tracking-wide">Items</p>
            <div className="space-y-1.5">
              {order.items.map((item) => (
                <div key={item.product} className="flex justify-between text-sm text-ink-700">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-ink-900 mb-2 uppercase tracking-wide">Shipping Address</p>
            <p className="text-sm text-ink-700 leading-relaxed">
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
              <br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [rechecking, setRechecking] = useState(null);
  const [refreshingShipping, setRefreshingShipping] = useState(null);

  useEffect(() => {
    api
      .get("/orders/mine")
      .then((d) => setOrders(d.orders))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load your orders."));
  }, []);

  const handleRecheck = async (id) => {
    setRechecking(id);
    setError("");
    try {
      const { order } = await api.get(`/orders/${id}/reconcile`);
      setOrders((os) => os.map((o) => (o._id === id ? order : o)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't check payment status, try again.");
    } finally {
      setRechecking(null);
    }
  };

  const handleRefreshShipping = async (id) => {
    setRefreshingShipping(id);
    setError("");
    try {
      const { order } = await api.get(`/orders/${id}/shipping`);
      setOrders((os) => os.map((o) => (o._id === id ? order : o)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't check shipping status, try again.");
    } finally {
      setRefreshingShipping(null);
    }
  };

  return (
    <>
      <section className="bg-beige-100 pt-24 pb-10 sm:pt-36 sm:pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
          <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
            Your Account
          </span>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl text-ink-950 leading-tight">My Orders</h1>
        </div>
      </section>

      <section className="bg-cream-50 py-14 sm:py-16 px-5">
        <div className="max-w-5xl mx-auto">
          {error && <p className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          {!orders ? (
            <p className="text-sm text-ink-700/70">Loading your orders...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-900/10 p-12 text-center">
              <p className="text-ink-700 mb-6">You haven't placed any orders yet.</p>
              <Button to="/products" variant="dark">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onRecheck={handleRecheck}
                  rechecking={rechecking}
                  onRefreshShipping={handleRefreshShipping}
                  refreshingShipping={refreshingShipping}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
