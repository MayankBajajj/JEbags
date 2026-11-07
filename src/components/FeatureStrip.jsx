import Icon from "./Icon";

const features = [
  { icon: "shield-check", title: "Premium Materials", description: "Quality you can feel." },
  { icon: "pen-tool", title: "Thoughtful Design", description: "Made for real use." },
  { icon: "truck", title: "Dependable Delivery", description: "Pan-India & export." },
  { icon: "handshake", title: "Dedicated Support", description: "A team that responds." },
];

export default function FeatureStrip() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 border-y border-ink-900/10 py-10">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <Icon name={f.icon} size={22} className="text-gold-600 shrink-0" strokeWidth={1.6} />
            <div>
              <p className="text-sm font-semibold text-ink-950 leading-tight">{f.title}</p>
              <p className="text-xs text-ink-700/70 mt-0.5">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
