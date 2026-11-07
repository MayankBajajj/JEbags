import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

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
                <th className="py-3 px-5">Placed</th>
                <th className="py-3 px-5">Status</th>
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
                  <td className="py-3 px-5 text-ink-700 capitalize">{o.paymentStatus}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
