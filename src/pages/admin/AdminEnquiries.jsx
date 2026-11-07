import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const STATUSES = ["new", "contacted", "quoted", "closed"];

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/enquiries/admin/all")
      .then((d) => setEnquiries(d.items))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    const prev = enquiries;
    setEnquiries((es) => es.map((e) => (e._id === id ? { ...e, status } : e)));
    try {
      await api.patch(`/enquiries/admin/${id}/status`, { status });
    } catch (err) {
      setEnquiries(prev);
      setError(err.message);
    }
  };

  return (
    <div className="p-8 sm:p-10">
      <h1 className="font-display font-semibold text-2xl text-ink-950 mb-1">Enquiries</h1>
      <p className="text-sm text-ink-700 mb-8">Bulk order and brand enquiries from the site.</p>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {!enquiries ? (
        <p className="text-sm text-ink-700/70">Loading...</p>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-900/10 p-10 text-center">
          <p className="text-ink-700">No enquiries yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((e) => (
            <div key={e._id} className="bg-white rounded-2xl border border-ink-900/10 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display font-semibold text-ink-950">{e.name}</p>
                  <p className="text-xs text-ink-700/70">
                    {e.company && `${e.company} · `}
                    {e.email} · {e.phone}
                  </p>
                </div>
                <select
                  value={e.status}
                  onChange={(ev) => handleStatusChange(e._id, ev.target.value)}
                  className="text-xs font-medium rounded-full border border-ink-900/15 px-2.5 py-1.5 bg-cream-50 shrink-0"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-ink-700 leading-relaxed">{e.message}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-ink-700/60">
                <span className="capitalize">{e.type}</span>
                {e.estimatedQuantity && <span>· ~{e.estimatedQuantity} units</span>}
                <span>· {new Date(e.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
