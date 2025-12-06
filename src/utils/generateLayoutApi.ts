interface GenerateLayoutRequest {
  imageBase64: string; // base64 without data: prefix
  prompt: string;
  variations: number; // will ignore for now, always 1 image
}

interface GenerateLayoutResponse {
  images: string[]; // data URLs the frontend can render
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

// Helper to call Gemini and get a single base64 image back
const callGeminiImage = async (imageBase64: string, prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set");
  }

  const textPrompt =
    prompt?.trim() ||
    "Using this layout, generate a clean, professional wedding stage mockup suitable for a South Asian wedding.";

  const body = {
    contents: [
      {
        parts: [
          { text: textPrompt },
          {
            inline_data: {
              mime_type: "image/png",
              data: imageBase64, // base64 WITHOUT "data:image/png;base64,"
            },
          },
        ],
      },
    ],
    // For now, always generate 1 candidate
    generationConfig: {
      candidateCount: 1,
    },
  };

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini error:", errorText);
    throw new Error("Gemini API error");
  }

  const data = await response.json();

  // Try to find the first inline_data image
  const candidates = data.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inline_data?.data) {
        const mime = part.inline_data.mime_type || "image/png";
        // Return as data URL so the frontend can display directly
        return `data:${mime};base64,${part.inline_data.data}`;
      }
    }
  }

  throw new Error("No image returned from Gemini");
};

export const generateLayout = async (request: GenerateLayoutRequest): Promise<GenerateLayoutResponse> => {
  // For now ignore request.variations and just get 1 image
  const image = await callGeminiImage(request.imageBase64, request.prompt);

  return { images: [image] };
};
