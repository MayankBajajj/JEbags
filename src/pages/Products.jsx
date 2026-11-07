import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import { categoryGroups } from "../data/content";
import { api } from "../lib/api";

export default function Products() {
  const [active, setActive] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const tabs = ["All", ...categoryGroups.map((g) => g.title)];

  // Debounce search input so we're not firing a request on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setError("");
    setProducts(null);
    const params = new URLSearchParams();
    if (active !== "All") params.set("category", active);
    if (search) params.set("search", search);
    const query = params.toString();
    api
      .get(`/products${query ? `?${query}` : ""}`)
      .then((d) => setProducts(d.items))
      .catch((err) => setError(err.message));
  }, [active, search]);

  return (
    <>
      <section className="bg-beige-100 pt-40 pb-14 sm:pt-48 sm:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              Product Range
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-6xl text-ink-950 leading-[1.05] max-w-2xl">
              Bags engineered for every category.
            </h1>
            <p className="mt-5 text-ink-700 text-base sm:text-lg max-w-xl leading-relaxed">
              Every piece below is available as OEM, ODM, private-label, or fully custom-built.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-700/40" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search backpacks, totes, OEM bags..."
              className="w-full rounded-full border border-ink-900/15 bg-white pl-11 pr-4 py-3 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                  active === tab
                    ? "bg-ink-950 text-cream-50 border-ink-950"
                    : "border-ink-900/15 text-ink-700 hover:border-gold-500 hover:text-gold-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-6">{error}</p>
          )}

          {!products ? (
            <p className="text-sm text-ink-700/70">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-ink-900/10 p-12 text-center">
              <p className="text-ink-700">
                {search ? (
                  <>No products match &ldquo;{search}&rdquo;.</>
                ) : (
                  <>No products in this category yet.</>
                )}{" "}
                <Link to="/contact" className="font-semibold text-gold-600 hover:text-gold-700">
                  Send us an enquiry
                </Link>{" "}
                for a custom quote.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <Reveal key={product._id} delay={i * 0.04}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OEM/ODM strip */}
      <section className="bg-beige-100 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
          <Reveal className="flex items-start gap-4 rounded-2xl border border-gold-500/30 bg-cream-50 p-7">
            <Icon name="settings-2" size={22} className="text-gold-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-semibold text-lg text-ink-950 mb-1.5">
                OEM Manufacturing
              </h3>
              <p className="text-sm text-ink-700 leading-relaxed">
                Send your specs — we manufacture to your exact requirements, at scale.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex items-start gap-4 rounded-2xl border border-gold-500/30 bg-cream-50 p-7">
            <Icon name="pen-tool" size={22} className="text-gold-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-semibold text-lg text-ink-950 mb-1.5">
                ODM Solutions
              </h3>
              <p className="text-sm text-ink-700 leading-relaxed">
                Have a concept? Our team helps design and develop it from scratch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-28 bg-ink-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <h3 className="font-display font-semibold text-2xl sm:text-3xl text-cream-50">
            Don't see your exact requirement?
          </h3>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-ink-950 hover:bg-gold-400 transition-colors whitespace-nowrap"
          >
            Talk to Our Team
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
