import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import Icon from "../../components/Icon";

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    api
      .get("/products/admin/all")
      .then((d) => setProducts(d.items))
      .catch((err) => setError(err.message));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/admin/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 sm:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-semibold text-2xl text-ink-950">Products</h1>
          <p className="text-sm text-ink-700 mt-1">Manage what's live on the storefront.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors"
        >
          <Icon name="arrow-right" size={15} className="rotate-[-90deg]" />
          Add Product
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {!products ? (
        <p className="text-sm text-ink-700/70">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ink-900/10 p-10 text-center">
          <p className="text-ink-700">No products yet. Add your first one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-ink-900/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-700/60 border-b border-ink-900/10">
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Price</th>
                <th className="py-3 px-5">Stock</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-ink-900/5 last:border-0">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover bg-beige-100 shrink-0"
                      />
                      <span className="font-medium text-ink-950">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-ink-700">{p.category}</td>
                  <td className="py-3 px-5 text-ink-900">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-5 text-ink-900">{p.stock}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                        p.isActive ? "bg-green-50 text-green-700" : "bg-ink-900/5 text-ink-700/60"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button
                      onClick={() => handleDelete(p._id, p.name)}
                      disabled={deletingId === p._id}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === p._id ? "Deleting..." : "Delete"}
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
