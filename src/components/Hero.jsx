import { motion } from "framer-motion";
import Button from "./Button";
import BagGridReveal from "./BagGridReveal";
import heroVideo from "../assets/videos/hero-video.mp4";

export default function Hero() {
  return (
    <section className="relative bg-cream-50 pt-24 pb-6 sm:pt-44 sm:pb-16 lg:pt-32 lg:pb-10 flex-1 sm:flex-none sm:min-h-[max(560px,78vh)] lg:min-h-[max(620px,82vh)] flex flex-col justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-110 sm:scale-100 opacity-[0.45] will-change-transform"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-cream-50/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,154,63,0.14),_transparent_55%)]" />

      <div className="px-5 sm:px-8 lg:px-10 relative grid lg:grid-cols-[50%_50%] gap-5 sm:gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs tracking-[0.25em] font-semibold uppercase text-gold-600">
            Custom Bags. Global Possibilities.
          </span>

          <h1 className="mt-3 lg:mt-4 font-display font-black uppercase text-4xl sm:text-6xl md:text-7xl lg:text-4xl xl:text-[2.75rem] leading-[1.05] tracking-tight text-ink-950">
            Built to Carry <span className="text-gold-600">the World</span>
          </h1>

          <p className="mt-3 lg:mt-4 text-sm sm:text-base tracking-[0.15em] uppercase font-medium text-ink-800">
            OEM &nbsp;|&nbsp; ODM &nbsp;|&nbsp; Private Label &nbsp;|&nbsp; Corporate Gifting
          </p>

          <p className="mt-3 lg:mt-4 text-sm sm:text-base leading-snug sm:leading-relaxed max-w-lg text-ink-700">
            From concept to bulk production, we deliver high-quality, customised bag solutions
            for brands, institutions, and global businesses.
          </p>

          <div className="mt-5 lg:mt-6 flex flex-wrap items-center gap-4">
            <Button to="/products" variant="primary">
              Explore Our Products
            </Button>
            <Button to="/contact" variant="outline" icon={null}>
              Request a Quote
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="lg:translate-x-14 xl:translate-x-24 lg:-translate-y-6"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <BagGridReveal />
        </motion.div>
      </div>
    </section>
  );
}
