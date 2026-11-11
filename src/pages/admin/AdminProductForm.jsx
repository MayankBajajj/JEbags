import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import Icon from "../../components/Icon";
import { inputClasses } from "../../lib/formStyles";

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    tags: "",
    moq: "",
    stock: "",
    isFeatured: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [removingImageId, setRemovingImageId] = useState(null);

  useEffect(() => {
    api.get("/products/categories").then((d) => setCategories(d.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/products/admin/${id}`)
      .then(({ product }) => {
        setForm({
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? "",
          category: product.category,
          tags: (product.tags || []).join(", "),
          moq: product.moq ?? "",
          stock: product.stock ?? "",
          isFeatured: product.isFeatured,
        });
        setExistingImages(product.images || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files).slice(0, 6);
    setFiles(selected);
  };

  const selectOnFocus = (e) => e.target.select();

  const handleRemoveExistingImage = async (publicId) => {
    if (existingImages.length === 1) {
      setError("A product needs at least one image — add a new one before removing this.");
      return;
    }
    setRemovingImageId(publicId);
    try {
      await api.delete(`/products/admin/${id}/images/${encodeURIComponent(publicId)}`);
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEdit && files.length === 0) {
      setError("Add at least one product image");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) data.append(key, value);
      });
      files.forEach((file) => data.append("images", file));

      if (isEdit) {
        await api.patch(`/products/admin/${id}`, data, { isForm: true });
      } else {
        await api.post("/products/admin", data, { isForm: true });
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="p-8 sm:p-10 max-w-2xl">
        <p className="text-sm text-ink-700/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-10 max-w-2xl">
      <h1 className="font-display font-semibold text-2xl text-ink-950 mb-1">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>
      <p className="text-sm text-ink-700 mb-8">
        {isEdit ? "Update pricing, stock, or details for this product." : "This will appear live on the storefront once saved."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-2xl border border-ink-900/10 p-7">
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Product Name</label>
          <input required name="name" value={form.name} onChange={handleChange} className={inputClasses} placeholder="e.g. Transit Commuter Backpack" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Description</label>
          <textarea required rows={4} name="description" value={form.description} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Materials, features, use case..." />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Category</label>
          <select required name="category" value={form.category} onChange={handleChange} className={inputClasses}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Price (₹)</label>
            <input required type="number" min="0" name="price" value={form.price} onChange={handleChange} onFocus={selectOnFocus} className={inputClasses} placeholder="1999" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Compare-at Price (₹)</label>
            <input type="number" min="0" name="compareAtPrice" value={form.compareAtPrice} onChange={handleChange} onFocus={selectOnFocus} className={inputClasses} placeholder="Optional" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">MOQ (Minimum Order Qty)</label>
            <input type="number" min="1" name="moq" value={form.moq} onChange={handleChange} onFocus={selectOnFocus} className={inputClasses} placeholder="1" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Stock</label>
            <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} onFocus={selectOnFocus} className={inputClasses} placeholder="0" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">Tags (comma-separated)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className={inputClasses} placeholder="OEM Ready, Custom Branding" />
        </div>

        {isEdit && existingImages.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-ink-900 mb-2">Current Images</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div key={img.publicId} className="relative group">
                  <img src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover border border-ink-900/10" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.publicId)}
                    disabled={removingImageId === img.publicId}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700 disabled:opacity-50"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-ink-900 mb-2">
            {isEdit ? "Add More Images (optional)" : "Product Images (up to 6)"}
          </label>
          <input required={!isEdit} type="file" accept="image/*" multiple onChange={handleFiles} className={`${inputClasses} py-2.5`} />
          {files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 rounded-lg object-cover border border-ink-900/10" />
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-2.5 text-sm text-ink-900">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-gold-600" />
          Feature this product on the homepage
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Save Product"}
          {!loading && <Icon name="arrow-right" size={16} />}
        </button>
      </form>
    </div>
  );
}
