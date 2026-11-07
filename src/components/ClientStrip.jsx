export default function ClientStrip({ items }) {
  const loop = [...items, ...items];
  return (
    <div className="bg-ink-950 py-12 sm:py-14">
      <p className="text-center text-xs tracking-[0.25em] uppercase text-gold-400 font-semibold mb-8">
        Trusted By Leading Brands &amp; Institutions
      </p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-ink-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-ink-950 to-transparent z-10" />
        <div className="flex w-max animate-marquee gap-4">
          {loop.map((item, i) => (
            <span
              key={i}
              className="shrink-0 rounded-full border border-gold-500/25 bg-cream-50/[0.04] px-7 py-3.5 text-base sm:text-lg font-display font-medium text-cream-50 whitespace-nowrap"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
