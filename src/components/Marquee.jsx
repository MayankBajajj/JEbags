export default function Marquee({ items }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-cream-100 border-y border-ink-900/10 py-4">
      <div className="flex w-max animate-marquee">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-8 shrink-0">
            <span className="text-sm sm:text-base tracking-wide font-medium text-ink-800 whitespace-nowrap">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
