import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AI_ENDPOINT = "https://ai.gateway.lovable.dev/v1/images/generations";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, prompt, variations, touchupChanges } = await req.json();

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI is not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }


    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let textPrompt;

    if (touchupChanges?.trim()) {
      // TOUCHUP MODE: Keep everything the same, apply specific changes
      textPrompt = `This is an AI-generated wedding stage design. Keep the overall design, composition, layout, lighting, and style exactly the same. Only make the following specific modifications: ${touchupChanges.trim()}. The result must still look like a real photograph with natural lighting and realistic textures. Preserve everything that is not explicitly mentioned - only change what is specifically requested.`;
    } else {
      // INITIAL GENERATION MODE
      const vibeDescription = prompt?.trim() ? ` The desired vibe is: ${prompt.trim()}.` : "";
      textPrompt = `Use this layout image as inspiration to generate a realistic, professional wedding stage design suitable for a South Asian wedding. The image must look like a real photograph - with natural lighting, realistic textures, proper shadows, and lifelike materials. You do not need to adhere strictly to the layout - instead, use your creativity to design an elegant setup that incorporates the items and elements shown in the image. Keep the general idea of what items are present and their approximate positions, but feel free to fill in gaps, enhance the composition, and make creative decisions to produce a cohesive, stunning final design that looks like it could be a real photograph of an actual wedding venue.${vibeDescription}`;
    }

    console.log("Calling Lovable AI with prompt:", textPrompt.substring(0, 100) + "...");

    const body = {
      model: "google/gemini-3.1-flash-image",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: textPrompt },
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${imageBase64}` },
            },
          ],
        },
      ],
      modalities: ["image", "text"],
    };

    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      const message =
        response.status === 429
          ? "Rate limit reached. Please try again in a moment."
          : response.status === 402
          ? "AI credits exhausted. Please add credits to continue."
          : "Image generation failed";
      return new Response(
        JSON.stringify({ error: message, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    const images: string[] = (data.data || [])
      .filter((d: { b64_json?: string }) => d?.b64_json)
      .map((d: { b64_json: string }) => `data:image/png;base64,${d.b64_json}`);

    if (images.length === 0) {
      console.error("No image returned from AI:", JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ error: "No image was generated" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }


    console.log(`Successfully generated ${images.length} image(s)`);

    return new Response(
      JSON.stringify({ images }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-layout function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
