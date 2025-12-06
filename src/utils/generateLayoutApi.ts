// src/utils/generateLayoutApi.ts

export interface GenerateLayoutRequest {
  imageBase64: string; // base64 WITHOUT "data:image/png;base64,"
  prompt: string;
  variations: number;
}

export interface GenerateLayoutResponse {
  images: string[]; // data URLs you can render directly in <img src=...>
}

// Gemini REST endpoint for image generation / editing.
// Check docs for the latest image model name – this uses a 2.5 Flash Image preview model. :contentReference[oaicite:0]{index=0}
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

export const generateLayout = async (request: GenerateLayoutRequest): Promise<GenerateLayoutResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY env variable");
  }

  const { imageBase64, prompt, variations } = request;

  // Safety clamp: 1–4 images
  const candidateCount = Math.min(Math.max(variations || 1, 1), 4);

  // Build prompt text – you can tune this for your vibe
  const textPrompt =
    prompt?.trim() ||
    "Using this canvas layout, generate a clean, realistic wedding stage mockup suitable for a South Asian wedding decor business.";

  const body = {
    contents: [
      {
        parts: [
          { text: textPrompt },
          {
            inline_data: {
              mime_type: "image/png",
              data: imageBase64, // this is base64 only, no prefix
            },
          },
        ],
      },
    ],
    generationConfig: {
      candidateCount,
      // You can tune more here: temperature, etc.
    },
  };

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Gemini error:", text);
    throw new Error("Gemini API error");
  }

  const json = await res.json();

  const images: string[] = [];

  // Extract inline image data from candidates :contentReference[oaicite:1]{index=1}
  for (const candidate of json.candidates ?? []) {
    for (const part of candidate.content?.parts ?? []) {
      if (part.inline_data?.data) {
        const mime = part.inline_data.mime_type || "image/png";
        const dataUrl = `data:${mime};base64,${part.inline_data.data}`;
        images.push(dataUrl);
      }
    }
  }

  if (images.length === 0) {
    throw new Error("Gemini returned no images");
  }

  return { images };
};
