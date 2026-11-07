import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Icon from "./Icon";

export default function ProductCard({ product, featured = false }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/products" } } });
      return;
    }
    addItem(product, product.moq || 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group rounded-2xl border border-ink-900/10 bg-white overflow-hidden hover:border-gold-500/50 hover:shadow-xl hover:shadow-ink-900/5 hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-beige-100">
        {featured && (
          <span className="absolute top-3 left-3 z-10 bg-ink-950 text-cream-50 text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
            {product.tags?.[0] || "Featured"}
          </span>
        )}
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <p className="text-[10px] tracking-[0.15em] uppercase text-gold-600 font-semibold mb-1.5">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-base text-ink-950 mb-1.5 leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-ink-700/80 leading-relaxed mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <span className="font-display font-semibold text-ink-950">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-700/50 line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
          {product.moq > 1 && <span className="text-[10px] text-ink-700/60">· MOQ {product.moq}</span>}
        </div>

        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium tracking-wide text-ink-700 border border-ink-900/15 rounded-full px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-xs font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"}
          {product.stock !== 0 && <Icon name={added ? "check" : "arrow-right"} size={13} />}
        </button>
      </div>
    </div>
  );
}
