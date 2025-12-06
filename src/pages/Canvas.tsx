import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CanvasEditor } from "@/components/CanvasEditor";
import { Toolbar } from "@/components/Toolbar";
import { AiGenerationPanel } from "@/components/AiGenerationPanel";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAiResults } from "@/contexts/AiResultsContext";
import { generateLayout } from "@/utils/generateLayoutApi";
import Konva from "konva";

interface CanvasItem {
  canvasId: string;
  name: string;
  image: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const Canvas = () => {
  const navigate = useNavigate();
  const stageRef = useRef<Konva.Stage>(null);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [history, setHistory] = useState<CanvasItem[][]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const { setAiImages, isGenerating, setIsGenerating } = useAiResults();

  useEffect(() => {
    const savedItems = sessionStorage.getItem("canvasItems");
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems);
      setHistory([parsedItems]);
    }
  }, []);

  const handleItemsChange = (newItems: CanvasItem[]) => {
    setItems(newItems);
    sessionStorage.setItem("canvasItems", JSON.stringify(newItems));
    
    // Add to history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setItems(history[newStep]);
      sessionStorage.setItem("canvasItems", JSON.stringify(history[newStep]));
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setItems(history[newStep]);
      sessionStorage.setItem("canvasItems", JSON.stringify(history[newStep]));
    }
  };

  const handleClear = () => {
    setItems([]);
    sessionStorage.setItem("canvasItems", JSON.stringify([]));
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
    toast.success("Canvas cleared");
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    sessionStorage.setItem("exportedCanvas", uri);
    toast.success("Layout exported!");
    navigate("/export");
  };

  const handleAiGenerate = async (prompt: string, variations: number) => {
    if (!stageRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      const base64 = dataUrl.split(",")[1];

      // Format the prompt for image generation
      const formattedPrompt = prompt.trim()
        ? `Generate an image of a ${prompt} decor set up, adhering to the items shown in the attached image`
        : "Generate an image of a decor set up, adhering to the items shown in the attached image";

      const response = await generateLayout({
        imageBase64: base64,
        prompt: formattedPrompt,
        variations,
      });

      if (response.images.length > 0) {
        setAiImages(response.images);
        toast.success("AI layouts generated!");
        navigate("/ai-results");
      } else {
        toast.error("No images were generated. Please try again.");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate AI layouts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/inventory")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Inventory
            </Button>
            <h1 className="text-4xl font-bold">Design Canvas</h1>
            <p className="text-muted-foreground mt-2">
              Drag, resize, and arrange your items
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <Toolbar
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            onExport={handleExport}
            canUndo={historyStep > 0}
            canRedo={historyStep < history.length - 1}
          />
        </div>

        {/* Canvas + AI Panel Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas */}
          <div className="flex-1 flex justify-center">
            <CanvasEditor
              items={items}
              onItemsChange={handleItemsChange}
              stageRef={stageRef}
            />
          </div>

          {/* AI Generation Panel */}
          <div className="lg:w-80">
            <AiGenerationPanel
              onGenerate={handleAiGenerate}
              isGenerating={isGenerating}
              hasItems={items.length > 0}
            />
          </div>
        </div>

        {items.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              No items on canvas yet. Go back to inventory to add items.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
