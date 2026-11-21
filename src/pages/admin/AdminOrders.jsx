import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [rechecking, setRechecking] = useState(null);
  const [refunding, setRefunding] = useState(null);
  const [refreshingShipping, setRefreshingShipping] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    api
      .get("/orders/admin/all")
      .then((d) => setOrders(d.orders))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o._id === id ? { ...o, status } : o)));
    try {
      await api.patch(`/orders/admin/${id}/status`, { status });
    } catch (err) {
      setOrders(prev);
      setError(err.message);
    }
  };

  const handleRecheck = async (id) => {
    setRechecking(id);
    setError("");
    try {
      const { order } = await api.get(`/orders/${id}/reconcile`);
      setOrders((os) => os.map((o) => (o._id === id ? order : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setRechecking(null);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm("Refund this order's full payment? This cannot be undone.")) return;
    setRefunding(id);
    setError("");
    try {
      const { order } = await api.post(`/orders/admin/${id}/refund`, {});
      setOrders((os) => os.map((o) => (o._id === id ? order : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setRefunding(null);
    }
  };

  const handleRefreshShipping = async (id) => {
    setRefreshingShipping(id);
    setError("");
    try {
      const { order } = await api.get(`/orders/${id}/shipping`);
      setOrders((os) => os.map((o) => (o._id === id ? order : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshingShipping(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this order? This is meant for test/mistaken orders, not real customer cancellations — it cannot be undone.")) return;
    setDeleting(id);
    setError("");
    try {
      await api.delete(`/orders/admin/${id}`);
      setOrders((os) => os.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.message);
      setDeleting(null);
    }
  };

  return (
    <div className="p-8 sm:p-10">
      <h1 className="font-display font-semibold text-2xl text-ink-950 mb-1">Orders</h1>
      <p className="text-sm text-ink-700 mb-8">All customer orders placed on the storefront.</p>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {!orders ? (
        <p className="text-sm text-ink-700/70">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-900/10 p-10 text-center">
          <p className="text-ink-700">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-ink-900/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-700/60 border-b border-ink-900/10">
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Items</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Payment</th>
                <th className="py-3 px-5">Shipping</th>
                <th className="py-3 px-5">Placed</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-ink-900/5 last:border-0 align-top">
                  <td className="py-3 px-5">
                    <p className="font-medium text-ink-950">{o.user?.name}</p>
                    <p className="text-xs text-ink-700/70">{o.user?.phone}</p>
                  </td>
                  <td className="py-3 px-5 text-ink-700">
                    {o.items.map((i) => (
                      <div key={i.product}>
                        {i.name} × {i.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-5 text-ink-900">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-5 text-ink-700">
                    <span
                      className={`capitalize ${
                        o.paymentStatus === "paid"
                          ? "text-green-700"
                          : o.paymentStatus === "failed"
                          ? "text-red-600"
                          : o.paymentStatus === "refunded"
                          ? "text-ink-700/70"
                          : "text-ink-700"
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                    {o.refund?.status && o.refund.status !== "none" && (
                      <span className="block text-xs text-ink-700/60 capitalize">
                        Refund: {o.refund.status}
                        {o.refund.amount ? ` (₹${o.refund.amount.toLocaleString("en-IN")})` : ""}
                      </span>
                    )}
                    {o.paymentStatus === "pending" && o.paymentMethod === "razorpay" && (
                      <button
                        onClick={() => handleRecheck(o._id)}
                        disabled={rechecking === o._id}
                        className="block mt-1 text-xs font-semibold text-gold-600 hover:text-gold-700 disabled:opacity-50"
                      >
                        {rechecking === o._id ? "Checking..." : "Recheck Payment"}
                      </button>
                    )}
                    {o.paymentStatus === "paid" && (!o.refund || o.refund.status === "none" || o.refund.status === "failed") && (
                      <button
                        onClick={() => handleRefund(o._id)}
                        disabled={refunding === o._id}
                        className="block mt-1 text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {refunding === o._id ? "Refunding..." : "Refund"}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-5 text-ink-700">
                    {o.paymentStatus === "paid" ? (
                      <>
                        {o.shiprocket?.shipmentId ? (
                          <>
                            <span className="font-medium text-ink-900">{o.shiprocket.status || "NEW"}</span>
                            {o.shiprocket.awbCode && <p className="text-xs text-ink-700/70">AWB {o.shiprocket.awbCode}</p>}
                          </>
                        ) : o.shiprocket?.error ? (
                          <p className="text-xs text-red-600 max-w-[160px]">{o.shiprocket.error}</p>
                        ) : (
                          <span className="text-xs text-ink-700/50">Not pushed yet</span>
                        )}
                        <button
                          onClick={() => handleRefreshShipping(o._id)}
                          disabled={refreshingShipping === o._id}
                          className="block mt-1 text-xs font-semibold text-gold-600 hover:text-gold-700 disabled:opacity-50"
                        >
                          {refreshingShipping === o._id ? "Checking..." : o.shiprocket?.shipmentId ? "Refresh" : "Push to Shiprocket"}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-ink-700/40">—</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-ink-700">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="py-3 px-5">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="text-xs font-medium rounded-full border border-ink-900/15 px-2.5 py-1.5 bg-cream-50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => handleDelete(o._id)}
                      disabled={deleting === o._id}
                      className="text-xs font-semibold text-ink-700/50 hover:text-red-600 disabled:opacity-50"
                    >
                      {deleting === o._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
