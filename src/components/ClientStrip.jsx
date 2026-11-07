import numerouno from "../assets/client-logos/numerouno.png";
import aakash from "../assets/client-logos/aakash.png";
import suzuki from "../assets/client-logos/suzuki.svg";
import shipsy from "../assets/client-logos/shipsy.png";
import physicswallah from "../assets/client-logos/physicswallah.webp";
import yesmadam from "../assets/client-logos/yesmadam.png";
import dmart from "../assets/client-logos/dmart.svg";

const logoMap = { numerouno, aakash, suzuki, shipsy, physicswallah, yesmadam, dmart };

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
          {loop.map((item, i) => {
            const logoSrc = item.logo ? logoMap[item.logo] : null;
            return (
              <div
                key={i}
                className="shrink-0 flex items-center justify-center rounded-xl bg-cream-50 px-7 h-16 sm:h-[4.5rem] min-w-[150px]"
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={item.name}
                    className="max-h-8 sm:max-h-9 max-w-[140px] object-contain"
                  />
                ) : (
                  <span className="text-sm font-display font-medium text-ink-900 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
