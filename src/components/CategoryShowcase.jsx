import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import Icon from "./Icon";
import { categoryGroups } from "../data/content";
import { api } from "../lib/api";

import backpackPhoto from "../assets/photos/product-a-backpack.png";
import trolleyPhoto from "../assets/photos/product-b-trolley.png";
import coolerPhoto from "../assets/photos/product-a-cooler-bag.png";
import totePhoto from "../assets/photos/product-a-tote-bag.png";
import giftPhoto from "../assets/photos/gifting-flatlay.png";
import sleevePhoto from "../assets/photos/product-b-laptop-sleeve.png";

// placeholder mockups — used only until a real product exists in that category
const fallbackPhotoFor = {
  "Backpacks & Business Bags": backpackPhoto,
  "Travel & Luggage": trolleyPhoto,
  "Delivery & Insulated Bags": coolerPhoto,
  "Tote, Canvas & Eco Bags": totePhoto,
  "Corporate Gifting & Events": giftPhoto,
  "Organizers & Pouches": sleevePhoto,
};

export default function CategoryShowcase({ count = 6 }) {
  const groups = categoryGroups.slice(0, count);
  const [productPhotos, setProductPhotos] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      groups.map((g) =>
        api
          .get(`/products?category=${encodeURIComponent(g.title)}&limit=1`)
          .then((d) => [g.title, d.items?.[0]?.images?.[0]?.url])
          .catch(() => [g.title, undefined])
      )
    ).then((pairs) => {
      if (cancelled) return;
      setProductPhotos(Object.fromEntries(pairs.filter(([, url]) => url)));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {groups.map((group, i) => (
        <Reveal key={group.title} delay={i * 0.05}>
          <Link to={`/products?category=${encodeURIComponent(group.title)}`} className="group block">
            <div className="relative aspect-square rounded-xl bg-beige-100 overflow-hidden">
              <img
                src={productPhotos[group.title] || fallbackPhotoFor[group.title]}
                alt={group.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="pointer-events-none select-none absolute left-2 top-0 font-display font-bold text-5xl sm:text-6xl text-cream-50/30 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-cream-50 border border-ink-900/10 flex items-center justify-center group-hover:bg-ink-950 group-hover:scale-110 transition-all duration-300">
                <Icon name="arrow-right" size={14} className="text-ink-900 group-hover:text-cream-50 group-hover:translate-x-0.5 transition-all duration-300" />
              </span>
            </div>
            <h3 className="mt-2.5 sm:mt-3 text-sm font-semibold text-ink-950 leading-tight line-clamp-1">{group.title}</h3>
            <p className="mt-0.5 text-xs text-ink-700/70 leading-tight line-clamp-1 sm:line-clamp-2">
              {group.items.slice(0, 3).join(" | ")}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
