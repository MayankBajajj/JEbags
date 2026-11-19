import { useState } from "react";
import Reveal from "./Reveal";
import Icon from "./Icon";
import Button from "./Button";

export const materials = [
  { id: "ballistic-nylon", label: "1680D Ballistic Nylon" },
  { id: "vegan-leather", label: "Vegan Leather" },
  { id: "ripstop-polyester", label: "Ripstop Polyester" },
  { id: "canvas", label: "Canvas" },
  { id: "other", label: "Other (specify)", isCustom: true },
];

export const colors = [
  { id: "charcoal-grey", label: "Charcoal Grey", swatchClass: "bg-[#3a3d42]" },
  { id: "chestnut-brown", label: "Chestnut Brown", swatchClass: "bg-[#4a3222]" },
  { id: "navy-blue", label: "Navy Blue", swatchClass: "bg-ink-700" },
  { id: "sandstone-beige", label: "Sandstone Beige", swatchClass: "bg-beige-300" },
  { id: "other", label: "Other (specify)", isCustom: true },
];

const otherSwatchClass = "bg-white border-2 border-dashed border-ink-900/30";

export default function CustomizationPreviewer({ onRequest }) {
  const [material, setMaterial] = useState(materials[0]);
  const [color, setColor] = useState(colors[0]);
  const [customMaterialText, setCustomMaterialText] = useState("");
  const [customColorText, setCustomColorText] = useState("");

  const materialLabel = material.isCustom ? customMaterialText.trim() : material.label;
  const colorLabel = color.isCustom ? customColorText.trim() : color.label;
  const canSubmit = materialLabel.length > 0 && colorLabel.length > 0;
  const previewImage =
    material.isCustom || color.isCustom
      ? null
      : `/images/custom-build/${material.id}--${color.id}.png`;

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
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMaterial(m)}
                      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all duration-200 ${
                        material.id === m.id
                          ? "border-gold-500 ring-2 ring-ink-950/80 bg-beige-100"
                          : "border-ink-900/10 hover:border-gold-500/40"
                      }`}
                    >
                      {m.isCustom && <Icon name="pen-tool" size={14} className="text-ink-900/50" />}
                      <span className="text-sm font-medium text-ink-900">{m.label}</span>
                    </button>
                  ))}
                </div>
                {material.isCustom && (
                  <input
                    value={customMaterialText}
                    onChange={(e) => setCustomMaterialText(e.target.value)}
                    placeholder="Material (e.g. waxed cotton canvas)"
                    className="mt-3 w-full max-w-md rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                )}
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-ink-700/60 mb-3">Color</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`flex items-center gap-2.5 rounded-full border-2 pl-1.5 pr-4 py-1.5 transition-all duration-200 ${
                        color.id === c.id
                          ? "border-gold-500 ring-2 ring-ink-950/80"
                          : "border-ink-900/10 hover:border-gold-500/40"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${c.isCustom ? otherSwatchClass : c.swatchClass}`}>
                        {c.isCustom && <Icon name="pen-tool" size={12} className="text-ink-900/50" />}
                      </span>
                      <span className="text-sm font-medium text-ink-900">{c.label}</span>
                    </button>
                  ))}
                </div>
                {color.isCustom && (
                  <input
                    value={customColorText}
                    onChange={(e) => setCustomColorText(e.target.value)}
                    placeholder="Color (e.g. forest green)"
                    className="mt-3 w-full max-w-md rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all"
                  />
                )}
              </div>

              <p className="text-xs text-ink-700/50">
                {material.isCustom || color.isCustom
                  ? "We'll mock up your custom material/color and send it over with your quote."
                  : "Preview on the right updates automatically."}
              </p>
            </div>

            <div className="lg:w-80 rounded-2xl bg-ink-950 p-6 shrink-0">
              <p className="text-[11px] tracking-[0.2em] uppercase text-gold-400 font-semibold mb-3">
                Your Selection
              </p>

              <div className="relative mb-4 aspect-square rounded-xl bg-cream-50/5 border border-cream-50/10 overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt={`${materialLabel} / ${colorLabel} preview`} className="absolute inset-0 w-full h-full object-contain p-2" />
                ) : (
                  <p className="text-xs text-cream-100/40 text-center px-4">
                    We'll send a mockup in your custom material/color with the quote.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <span className={`w-8 h-8 rounded-full shrink-0 border border-cream-50/20 flex items-center justify-center ${color.isCustom ? "bg-cream-50/10" : color.swatchClass}`}>
                  {(material.isCustom || color.isCustom) && <Icon name="pen-tool" size={13} className="text-gold-400" />}
                </span>
                <p className="text-sm text-cream-50 font-medium">
                  {materialLabel && colorLabel ? `${materialLabel} — ${colorLabel}` : "Your material & color"}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => onRequest?.(`${materialLabel} (${colorLabel})`)}
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
