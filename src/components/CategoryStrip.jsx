import { Link } from "react-router-dom";
import Icon from "./Icon";
import { categoryGroups } from "../data/content";

export default function CategoryStrip() {
  return (
    <div className="bg-cream-50 border-b border-ink-900/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex overflow-x-auto no-scrollbar divide-x divide-ink-900/8">
          {categoryGroups.map((group) => (
            <Link
              key={group.title}
              to="/products"
              className="group flex items-center gap-2.5 px-6 py-5 shrink-0 hover:bg-beige-100/60 transition-colors"
            >
              <Icon
                name={group.icon}
                size={18}
                className="text-ink-800 group-hover:text-gold-600 transition-colors"
                strokeWidth={1.6}
              />
              <span className="text-xs tracking-[0.12em] uppercase font-medium text-ink-800 whitespace-nowrap">
                {group.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
