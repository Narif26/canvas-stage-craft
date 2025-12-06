import { supabase } from "@/integrations/supabase/client";

interface GenerateLayoutRequest {
  imageBase64: string; // base64 without data: prefix
  prompt: string;
  variations: number; // will ignore for now, always 1 image
}

interface GenerateLayoutResponse {
  images: string[]; // data URLs the frontend can render
}

export const generateLayout = async (request: GenerateLayoutRequest): Promise<GenerateLayoutResponse> => {
  const { data, error } = await supabase.functions.invoke('generate-layout', {
    body: {
      imageBase64: request.imageBase64,
      prompt: request.prompt,
      variations: request.variations,
    },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Failed to generate layout");
  }

  if (data?.error) {
    console.error("API error:", data.error);
    throw new Error(data.error);
  }

  return { images: data.images || [] };
};
