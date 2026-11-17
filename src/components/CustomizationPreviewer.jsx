import { useState } from "react";
import Reveal from "./Reveal";
import Icon from "./Icon";
import Button from "./Button";

const fabrics = [
  { id: "ballistic-nylon", label: "1680D Ballistic Nylon", swatchClass: "bg-[#3a3d42]" },
  { id: "vegan-leather", label: "Vegan Leather", swatchClass: "bg-[#4a3222]" },
  { id: "ripstop-polyester", label: "Ripstop Polyester", swatchClass: "bg-ink-700" },
  { id: "canvas", label: "Canvas", swatchClass: "bg-beige-300" },
  { id: "other", label: "Other (specify)", swatchClass: "bg-white border-2 border-dashed border-ink-900/30", isCustom: true },
];

const finishes = [
  { id: "metal-gold-plate", label: "Metal Gold Plate", icon: "sparkles" },
  { id: "embossed", label: "Embossed", icon: "layers" },
  { id: "woven-patch", label: "Woven Patch", icon: "pen-tool" },
  { id: "screen-print", label: "Screen Print", icon: "printer" },
  { id: "other", label: "Other (specify)", icon: "settings-2", isCustom: true },
];

export default function CustomizationPreviewer({ onRequest }) {
  const [fabric, setFabric] = useState(fabrics[0]);
  const [finish, setFinish] = useState(finishes[0]);
  const [customFabricText, setCustomFabricText] = useState("");
  const [customFinishText, setCustomFinishText] = useState("");

  const fabricLabel = fabric.isCustom ? customFabricText.trim() : fabric.label;
  const finishLabel = finish.isCustom ? customFinishText.trim() : finish.label;
  const canSubmit = fabricLabel.length > 0 && finishLabel.length > 0;

  return (
    <section className="bg-beige-100 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal className="rounded-2xl border border-ink-900/10 bg-white p-7 sm:p-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:items-end">
            <div>
              <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-2">
                OEM / ODM
              </span>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950 mb-6">
                Customize Your Build
              </h2>

              <div className="mb-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-ink-700/60 mb-3">Material</p>
                <div className="flex flex-wrap gap-3">
                  {fabrics.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFabric(f)}
                      className={`flex items-center gap-2.5 rounded-full border-2 pl-1.5 pr-4 py-1.5 transition-all duration-200 ${
                        fabric.id === f.id
                          ? "border-gold-500 ring-2 ring-ink-950/80"
                          : "border-ink-900/10 hover:border-gold-500/40"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${f.swatchClass}`}>
                        {f.isCustom && <Icon name="pen-tool" size={12} className="text-ink-900/50" />}
                      </span>
                      <span className="text-sm font-medium text-ink-900">{f.label}</span>
                    </button>
                  ))}
                </div>
                {fabric.isCustom && (
                  <input
                    value={customFabricText}
                    onChange={(e) => setCustomFabricText(e.target.value)}
                    placeholder="Tell us the material you have in mind..."
                    className="mt-3 w-full max-w-md rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-ink-700/60 mb-3">Logo Finish</p>
                <div className="flex flex-wrap gap-3">
                  {finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinish(f)}
                      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all duration-200 ${
                        finish.id === f.id
                          ? "border-gold-500 ring-2 ring-ink-950/80 bg-beige-100"
                          : "border-ink-900/10 hover:border-gold-500/40"
                      }`}
                    >
                      <Icon name={f.icon} size={15} className="text-gold-600" />
                      <span className="text-sm font-medium text-ink-900">{f.label}</span>
                    </button>
                  ))}
                </div>
                {finish.isCustom && (
                  <input
                    value={customFinishText}
                    onChange={(e) => setCustomFinishText(e.target.value)}
                    placeholder="Tell us the logo finish you have in mind..."
                    className="mt-3 w-full max-w-md rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                )}
              </div>
            </div>

            <div className="lg:w-72 rounded-2xl bg-ink-950 p-6 shrink-0">
              <p className="text-[11px] tracking-[0.2em] uppercase text-gold-400 font-semibold mb-3">
                Your Selection
              </p>
              <div className="flex items-center gap-3 mb-2">
                <span className={`w-8 h-8 rounded-full shrink-0 border border-cream-50/20 flex items-center justify-center ${fabric.isCustom ? "bg-cream-50/10" : fabric.swatchClass}`}>
                  {fabric.isCustom && <Icon name="pen-tool" size={13} className="text-gold-400" />}
                </span>
                <p className="text-sm text-cream-50 font-medium">
                  {fabricLabel || "Your material"}
                </p>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-cream-50/10 flex items-center justify-center shrink-0">
                  <Icon name={finish.icon} size={14} className="text-gold-400" />
                </span>
                <p className="text-sm text-cream-50 font-medium">
                  {finishLabel || "Your finish"}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => onRequest?.(fabricLabel, finishLabel)}
                disabled={!canSubmit}
                variant="primary"
                size="sm"
                className="w-full"
              >
                Discuss This Build
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
