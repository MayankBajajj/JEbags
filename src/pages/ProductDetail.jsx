import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";
import { api } from "../lib/api";
import { company } from "../data/content";
import Icon from "../components/Icon";
import Button from "../components/Button";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { addItem: addQuoteItem, openDrawer } = useQuote();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

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

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const pageHeight = document.body.scrollHeight;
      setShowStickyBar(scrolled > pageHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/products/${slug}` } } });
      return;
    }
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleRequestSample = () => {
    addQuoteItem(product);
    openDrawer();
  };

  if (error) {
    return (
      <section className="bg-cream-50 pt-28 pb-16 sm:pt-40 sm:pb-24 px-5 text-center">
        <p className="text-ink-700 mb-4">{error}</p>
        <Link to="/products" className="font-semibold text-gold-600 hover:text-gold-700">
          Back to Products
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="bg-cream-50 pt-28 pb-16 sm:pt-40 sm:pb-24 px-5 text-center">
        <p className="text-ink-700/70">Loading...</p>
      </section>
    );
  }

  const moq = product.moq || 1;

  return (
    <section className="bg-cream-50 pt-24 pb-16 sm:pt-32 sm:pb-24 px-5">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/products"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-gold-600 transition-colors mb-8"
        >
          <Icon name="chevron-left" size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
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
                {product.stock > 0 ? "In Stock" : "Out of stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setQuantity((q) => Math.max(moq, q - 1))}
                  className="w-10 h-10 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500 hover:scale-110 transition-all duration-200"
                >
                  −
                </button>
                <span className="w-12 text-center font-medium text-ink-950">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500 hover:scale-110 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-900/15 disabled:hover:scale-100"
                >
                  +
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                variant="dark"
                icon={product.stock === 0 ? null : added ? "check" : "arrow-right"}
                className="w-full sm:w-auto"
              >
                {product.stock === 0 ? "Out of Stock" : added ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button
                type="button"
                onClick={handleRequestSample}
                variant="outline"
                icon="clipboard-check"
                className="w-full sm:w-auto"
              >
                Request Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* sticky request-a-sample bar */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 bg-ink-950 border-t border-cream-50/10 transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-cream-50 truncate hidden sm:block">{product.name}</p>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/${company.phoneRaw.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="shrink-0 w-10 h-10 rounded-full border border-cream-50/20 flex items-center justify-center text-cream-100/80 hover:border-gold-500 hover:text-gold-400 transition-colors"
            >
              <Icon name="phone" size={17} />
            </a>
            <Button type="button" onClick={handleRequestSample} variant="primary" className="flex-1 sm:flex-none">
              Order a Physical Sample
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
