import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import Icon from "./Icon";
import ProductArt from "./ProductArt";

export default function PromoBanner() {
  return (
    <Reveal>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 rounded-2xl overflow-hidden border border-ink-900/10">
          <div className="relative bg-gradient-to-br from-beige-100 via-beige-200 to-gold-300/40 flex items-center justify-center p-10 min-h-[260px]">
            <div className="grid grid-cols-2 gap-5 opacity-80">
              <ProductArt type="gift" className="w-20 h-20 text-ink-900/60" />
              <ProductArt type="backpack" className="w-20 h-20 text-ink-900/60 mt-6" />
            </div>
          </div>
          <div className="bg-ink-950 p-10 sm:p-12 flex flex-col justify-center">
            <span className="text-xs tracking-[0.25em] font-semibold text-gold-400 uppercase mb-3">
              Corporate Gifting Program
            </span>
            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-cream-50 leading-snug mb-4">
              Custom-branded kits for your next onboarding or event.
            </h3>
            <p className="text-sm text-cream-100/65 leading-relaxed mb-7 max-w-sm">
              From employee welcome kits to conference merchandise — manufactured and
              branded end-to-end.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-gold-400 transition-colors w-fit"
            >
              Get a Quote
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
