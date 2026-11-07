import { Link } from "react-router-dom";
import Reveal from "./Reveal";
import Icon from "./Icon";
import { categoryGroups } from "../data/content";

import backpackPhoto from "../assets/photos/product-a-backpack.png";
import trolleyPhoto from "../assets/photos/product-b-trolley.png";
import coolerPhoto from "../assets/photos/product-a-cooler-bag.png";
import totePhoto from "../assets/photos/product-a-tote-bag.png";
import giftPhoto from "../assets/photos/gifting-flatlay.png";
import sleevePhoto from "../assets/photos/product-b-laptop-sleeve.png";

const photoFor = {
  "Backpacks & Business Bags": backpackPhoto,
  "Travel & Luggage": trolleyPhoto,
  "Delivery & Insulated Bags": coolerPhoto,
  "Tote, Canvas & Eco Bags": totePhoto,
  "Corporate Gifting & Events": giftPhoto,
  "Organizers & Pouches": sleevePhoto,
};

export default function CategoryShowcase({ count = 6 }) {
  const groups = categoryGroups.slice(0, count);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {groups.map((group, i) => (
        <Reveal key={group.title} delay={i * 0.05}>
          <Link to="/products" className="group block">
            <div className="relative aspect-square rounded-xl bg-beige-100 overflow-hidden">
              <img
                src={photoFor[group.title]}
                alt={group.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-cream-50 border border-ink-900/10 flex items-center justify-center group-hover:bg-ink-950 transition-colors">
                <Icon name="arrow-right" size={14} className="text-ink-900 group-hover:text-cream-50 transition-colors" />
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-ink-950 leading-tight">{group.title}</h3>
            <p className="mt-0.5 text-xs text-ink-700/70 leading-tight">
              {group.items.slice(0, 3).join(" | ")}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
