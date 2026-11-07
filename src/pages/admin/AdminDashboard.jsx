import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Icon from "../../components/Icon";

const statCards = [
  { key: "revenue", label: "Revenue (Paid)", icon: "gift", format: (v) => `₹${v.toLocaleString("en-IN")}` },
  { key: "totalOrders", label: "Total Orders", icon: "package", format: (v) => v },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/orders/admin/analytics")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-8 sm:p-10">
      <h1 className="font-display font-semibold text-2xl text-ink-950 mb-1">Dashboard</h1>
      <p className="text-sm text-ink-700 mb-8">An overview of sales and order activity.</p>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {data && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {statCards.map((card) => (
              <div key={card.key} className="bg-white rounded-2xl border border-ink-900/10 p-6">
                <Icon name={card.icon} size={20} className="text-gold-600 mb-4" />
                <p className="text-2xl font-display font-semibold text-ink-950">{card.format(data[card.key])}</p>
                <p className="text-xs text-ink-700/70 mt-1">{card.label}</p>
              </div>
            ))}
            {data.byStatus.map((s) => (
              <div key={s._id} className="bg-white rounded-2xl border border-ink-900/10 p-6">
                <Icon name="chevron-right" size={20} className="text-gold-600 mb-4" />
                <p className="text-2xl font-display font-semibold text-ink-950">{s.count}</p>
                <p className="text-xs text-ink-700/70 mt-1 capitalize">{s._id} Orders</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-ink-900/10 p-6">
            <h2 className="font-display font-semibold text-lg text-ink-950 mb-4">Last 30 Days</h2>
            {data.last30Days.length === 0 ? (
              <p className="text-sm text-ink-700/70">No orders yet in this window.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-ink-700/60 border-b border-ink-900/10">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Orders</th>
                      <th className="py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.last30Days.map((d) => (
                      <tr key={d._id} className="border-b border-ink-900/5">
                        <td className="py-2 pr-4 text-ink-900">{d._id}</td>
                        <td className="py-2 pr-4 text-ink-900">{d.orders}</td>
                        <td className="py-2 text-ink-900">₹{d.revenue.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
