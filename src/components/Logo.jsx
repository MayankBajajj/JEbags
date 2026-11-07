import logoIcon from "../assets/logo/logo-icon.png";

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
      <img
        src={logoIcon}
        alt="JÉ BAGS"
        width={s.box}
        height={s.box}
        className="rounded-[22%] shrink-0"
        style={{ width: s.box, height: s.box }}
      />
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
