import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import Icon from "./Icon";
import ProductArt from "./ProductArt";

export default function SplitBanner({
  tone = "dark",
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaTo = "/contact",
  art,
  photo,
  icons,
  reverse = false,
  delay = 0,
}) {
  const dark = tone === "dark";

  return (
    <Reveal delay={delay} className="h-full">
      <div
        className={`grid sm:grid-cols-2 rounded-2xl overflow-hidden border h-full ${
          dark ? "border-ink-900/0" : "border-ink-900/10"
        } ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}
      >
        <div
          className={`relative min-h-[220px] overflow-hidden ${
            photo
              ? ""
              : dark
              ? "flex items-center justify-center p-10 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-950"
              : "flex items-center justify-center p-10 bg-gradient-to-br from-beige-100 via-beige-200 to-gold-300/40"
          }`}
        >
          {photo ? (
            <img
              src={photo}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <ProductArt
              type={art}
              className={`w-2/3 h-2/3 ${dark ? "text-cream-100/40" : "text-ink-900/60"}`}
            />
          )}
        </div>

        <div className={`p-8 sm:p-10 flex flex-col justify-center ${dark ? "bg-ink-950" : "bg-cream-50"}`}>
          {eyebrow && (
            <span
              className={`text-xs tracking-[0.2em] font-semibold uppercase mb-3 ${
                dark ? "text-gold-400" : "text-gold-600"
              }`}
            >
              {eyebrow}
            </span>
          )}
          <h3
            className={`font-display font-semibold text-2xl sm:text-3xl leading-snug mb-4 ${
              dark ? "text-cream-50" : "text-ink-950"
            }`}
          >
            {title}
          </h3>
          {description && (
            <p className={`text-sm leading-relaxed mb-6 max-w-sm ${dark ? "text-cream-100/65" : "text-ink-700"}`}>
              {description}
            </p>
          )}

          {icons && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 mb-7">
              {icons.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <Icon
                    name={item.icon}
                    size={16}
                    className={dark ? "text-gold-400 shrink-0" : "text-gold-600 shrink-0"}
                  />
                  <span className={`text-xs font-medium ${dark ? "text-cream-100/80" : "text-ink-800"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {ctaLabel && (
            <Link
              to={ctaTo}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold w-fit transition-colors ${
                dark
                  ? "bg-gold-500 text-ink-950 hover:bg-gold-400"
                  : "bg-ink-950 text-cream-50 hover:bg-ink-800"
              }`}
            >
              {ctaLabel}
              <Icon name="arrow-right" size={15} />
            </Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}
