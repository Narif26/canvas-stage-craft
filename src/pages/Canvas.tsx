import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CanvasEditor } from "@/components/CanvasEditor";
import { Toolbar } from "@/components/Toolbar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
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

        {/* Canvas */}
        <div className="flex justify-center">
          <CanvasEditor
            items={items}
            onItemsChange={handleItemsChange}
            stageRef={stageRef}
          />
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
