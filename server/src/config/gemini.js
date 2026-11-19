import { GoogleGenAI } from "@google/genai";

const IMAGE_MODEL = "gemini-nano-banana-2.1";

let client = null;
function getClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  // the Interactions API's image input type is only available on v1beta
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { apiVersion: "v1beta" } });
  return client;
}

// Edits `baseImageBuffer` according to `prompt`, keeping the same subject —
// used to re-skin a real product photo's material/color rather than
// generating an unrelated bag from scratch. Returns a PNG buffer, or null
// if the model didn't return image data.
export async function editProductImage(prompt, baseImageBuffer, mimeType = "image/png") {
  const ai = getClient();
  if (!ai) throw new Error("GEMINI_API_KEY is not configured");

  const interaction = await ai.interactions.create({
    model: IMAGE_MODEL,
    input: [
      { type: "text", text: prompt },
      { type: "image", mime_type: mimeType, data: baseImageBuffer.toString("base64") },
    ],
  });

  const image = interaction.output_image;
  if (!image?.data) return null;
  return Buffer.from(image.data, "base64");
}
