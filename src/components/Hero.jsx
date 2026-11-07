import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "./Icon";
import heroVideo from "../assets/videos/hero-video.mp4";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-50 pt-40 pb-14 sm:pt-48 sm:pb-16">
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-[0.45]"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-cream-50/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,154,63,0.14),_transparent_55%)]" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="text-xs tracking-[0.25em] font-semibold uppercase text-gold-600">
            Custom Bags. Global Possibilities.
          </span>

          <h1 className="mt-5 font-display font-black uppercase text-[11vw] sm:text-6xl md:text-7xl leading-[0.98] tracking-tight text-ink-950">
            Built to Carry
            <br />
            <span className="text-gold-600">the World</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base tracking-[0.15em] uppercase font-medium text-ink-800">
            OEM &nbsp;|&nbsp; ODM &nbsp;|&nbsp; Private Label &nbsp;|&nbsp; Corporate Gifting
          </p>

          <p className="mt-5 text-base leading-relaxed max-w-lg text-ink-700">
            From concept to bulk production, we deliver high-quality, customised bag solutions
            for brands, institutions, and global businesses.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-ink-950 hover:bg-gold-400 transition-colors"
            >
              Explore Our Products
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors border-ink-900/25 text-ink-900 hover:border-gold-600 hover:text-gold-700"
            >
              Request a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
