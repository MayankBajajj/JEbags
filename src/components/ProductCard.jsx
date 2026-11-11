import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block rounded-2xl border border-ink-900/10 bg-white overflow-hidden hover:border-gold-500/50 hover:shadow-xl hover:shadow-ink-900/5 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-beige-100">
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 z-10 bg-ink-950 text-cream-50 text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full">
            Out of Stock
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
        <h3 className="font-display font-semibold text-base text-ink-950 mb-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-ink-950">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-700/50 line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
