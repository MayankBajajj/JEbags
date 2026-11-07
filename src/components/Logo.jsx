export default function Logo({ variant = "light", size = "md", showSubtitle = true }) {
  const isDark = variant === "dark";
  const wordmarkColor = isDark ? "#faf5ec" : "#0f1e36";
  const sizes = {
    sm: { box: 34, title: "text-lg", sub: "text-[8px]" },
    md: { box: 42, title: "text-2xl", sub: "text-[9px]" },
    lg: { box: 64, title: "text-4xl", sub: "text-xs" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <svg width={s.box} height={s.box} viewBox="0 0 64 64" fill="none">
        <rect x="1" y="1" width="62" height="62" rx="14" fill="#0a1526" stroke="#c89a3f" strokeWidth="1.5" />
        <path
          d="M26 14h10v24a10 10 0 0 1-10 10 9.5 9.5 0 0 1-9-6.2l5.6-3.3a3.6 3.6 0 0 0 3.4 2.5c2 0 3-1.3 3-4.1V18h-3z"
          fill="#faf5ec"
        />
        <path d="M38 40 48 28h-6l-6.5 8 7 10h6.4z" fill="#c89a3f" />
      </svg>
      <div className="leading-none">
        <div className={`font-display font-semibold tracking-wide ${s.title}`} style={{ color: wordmarkColor }}>
          JÉ BAGS
        </div>
        {showSubtitle && (
          <div className={`${s.sub} tracking-[0.25em] font-medium text-gold-600 mt-1`}>
            CORPORATE GIFTING
          </div>
        )}
      </div>
    </div>
  );
}
