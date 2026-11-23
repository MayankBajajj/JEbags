import { motion } from "framer-motion";
import heroVideo from "../assets/videos/hero-video.mp4";

export default function PageHero({ eyebrow, title, highlight, description, children }) {
  return (
    <section className="relative overflow-hidden bg-cream-50 pt-24 pb-10 sm:pt-48 sm:pb-20">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-110 sm:scale-100 opacity-[0.45]"
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
          {eyebrow && (
            <span className="text-xs tracking-[0.25em] font-semibold uppercase text-gold-600">
              {eyebrow}
            </span>
          )}

          <h1 className="mt-4 sm:mt-5 font-display font-black uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.08] sm:leading-[1.02] tracking-tight text-ink-950">
            {title}
            {highlight && (
              <>
                <br />
                <span className="text-gold-600">{highlight}</span>
              </>
            )}
          </h1>

          {description && (
            <p className="mt-5 text-base leading-relaxed max-w-lg text-ink-700">{description}</p>
          )}

          {children}
        </motion.div>
      </div>
    </section>
  );
}
