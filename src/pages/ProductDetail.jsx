import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import Icon from "../components/Icon";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(null);
    setError("");
    setActiveImage(0);
    api
      .get(`/products/${slug}`)
      .then(({ product }) => {
        setProduct(product);
        setQuantity(product.moq || 1);
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/products/${slug}` } } });
      return;
    }
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (error) {
    return (
      <section className="bg-cream-50 pt-40 pb-24 px-5 text-center">
        <p className="text-ink-700 mb-4">{error}</p>
        <Link to="/products" className="font-semibold text-gold-600 hover:text-gold-700">
          Back to Products
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="bg-cream-50 pt-40 pb-24 px-5 text-center">
        <p className="text-ink-700/70">Loading...</p>
      </section>
    );
  }

  const moq = product.moq || 1;

  return (
    <section className="bg-cream-50 pt-32 pb-24 px-5">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-gold-600 transition-colors mb-8"
        >
          <Icon name="chevron-left" size={16} />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-beige-100 border border-ink-900/10 mb-3">
              <img
                src={product.images?.[activeImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img.publicId}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === activeImage ? "border-gold-500" : "border-transparent hover:border-ink-900/20"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gold-600 font-semibold mb-2">
              {product.category}
            </p>
            <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink-950 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="font-display font-semibold text-2xl text-ink-950">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-ink-700/50 line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="text-ink-700 leading-relaxed mb-6 whitespace-pre-wrap">{product.description}</p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium tracking-wide text-ink-700 border border-ink-900/15 rounded-full px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm mb-7">
              {moq > 1 && <span className="text-ink-700">MOQ: {moq} units</span>}
              <span className={product.stock > 0 ? "text-green-700" : "text-red-600"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setQuantity((q) => Math.max(moq, q - 1))}
                  className="w-10 h-10 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium text-ink-950">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500"
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink-950 px-8 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"}
              {product.stock !== 0 && <Icon name={added ? "check" : "arrow-right"} size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
