import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, description, align = "left", light = false }) {
  return (
    <Reveal
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-500 uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display font-semibold text-3xl sm:text-4xl md:text-5xl leading-[1.1] ${
          light ? "text-cream-50" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${light ? "text-cream-100/70" : "text-ink-700/80"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
