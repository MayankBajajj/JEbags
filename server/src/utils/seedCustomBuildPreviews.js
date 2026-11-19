// Pre-warms the Custom Build AI preview cache for the full fixed
// material x color grid, so the page never shows a loading spinner for one
// of these combos — only free-text "Other" entries generate on demand.
//
// Run once (and again any time MATERIALS/COLORS below change) after Gemini
// billing is enabled on the account behind GEMINI_API_KEY:
//   cd server && node src/utils/seedCustomBuildPreviews.js
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { getOrGeneratePreviewFor } from "../controllers/customBuild.controller.js";

// keep in sync with src/components/CustomizationPreviewer.jsx
const MATERIALS = ["1680D Ballistic Nylon", "Vegan Leather", "Ripstop Polyester", "Canvas"];
const COLORS = [
  { label: "Charcoal Grey", hex: "#3a3d42" },
  { label: "Chestnut Brown", hex: "#4a3222" },
  { label: "Navy Blue", hex: "#294769" },
  { label: "Sandstone Beige", hex: "#dcc6a0" },
];

async function run() {
  await connectDB();

  let generated = 0;
  let cached = 0;
  let failed = 0;

  for (const material of MATERIALS) {
    for (const color of COLORS) {
      const label = `${material} / ${color.label}`;
      try {
        const result = await getOrGeneratePreviewFor({ material, colorHex: color.hex, colorLabel: color.label });
        if (result.failed) {
          failed++;
          console.error(`✗ ${label} — model returned no image`);
        } else if (result.cached) {
          cached++;
          console.log(`= ${label} — already cached`);
        } else {
          generated++;
          console.log(`✓ ${label} — generated: ${result.imageUrl}`);
        }
      } catch (err) {
        failed++;
        console.error(`✗ ${label} — ${err.message}`);
      }
    }
  }

  console.log(`\nDone. ${generated} generated, ${cached} already cached, ${failed} failed.`);
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
