interface GenerateLayoutRequest {
  imageBase64: string;
  prompt: string;
  variations: number;
}

interface GenerateLayoutResponse {
  images: string[];
}

// Mock placeholder image generator
const generateMockImage = (index: number, prompt: string): string => {
  const colors = ["#1a1f2e", "#2d3748", "#4a5568", "#718096"];
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  
  if (ctx) {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, colors[index % colors.length]);
    gradient.addColorStop(1, colors[(index + 1) % colors.length]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
    
    // Add some decorative elements
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(400, 300, 200, 0, Math.PI * 2);
    ctx.fill();
    
    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`AI Generated Layout ${index + 1}`, 400, 280);
    
    ctx.font = "18px system-ui";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText(prompt || "Event Design Variation", 400, 320);
    
    ctx.font = "14px system-ui";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("(Mock image - Gemini API will replace this)", 400, 360);
  }
  
  return canvas.toDataURL("image/png");
};

export const generateLayout = async (
  request: GenerateLayoutRequest
): Promise<GenerateLayoutResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Generate mock images
  const images: string[] = [];
  for (let i = 0; i < request.variations; i++) {
    images.push(generateMockImage(i, request.prompt));
  }
  
  return { images };
};
