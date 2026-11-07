import Icon from "./Icon";

const items = [
  { icon: "factory", label: "In-house Manufacturing" },
  { icon: "pen-tool", label: "Custom Design & Development" },
  { icon: "settings-2", label: "OEM & Private Label" },
  { icon: "globe", label: "Pan-India & Global Supply" },
];

export default function TrustStrip() {
  return (
    <div className="bg-cream-100 border-b border-ink-900/8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink-900/8">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 px-4 sm:px-6 py-5">
              <Icon name={item.icon} size={18} className="text-gold-600 shrink-0" strokeWidth={1.6} />
              <span className="text-xs sm:text-[13px] font-medium text-ink-800 leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
