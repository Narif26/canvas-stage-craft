import { useState, useEffect, useRef } from "react";
import { CanvasEditor, CanvasItem } from "@/components/CanvasEditor";
import { Toolbar } from "@/components/Toolbar";
import { AiGenerationPanel } from "@/components/AiGenerationPanel";
import { InventorySidebar } from "@/components/InventorySidebar";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { useAiResults } from "@/contexts/AiResultsContext";
import { generateLayout } from "@/utils/generateLayoutApi";
import { InventoryItem } from "@/data/inventory";
import { useInventoryQuantities } from "@/hooks/useInventoryQuantities";
import Konva from "konva";

const Canvas = () => {
  const navigate = useNavigate();
  const stageRef = useRef<Konva.Stage>(null);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [history, setHistory] = useState<CanvasItem[][]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const { setAiImages, isGenerating, setIsGenerating } = useAiResults();

  const {
    quantities,
    selectedCategories,
    decrementQuantity,
    unselectItem,
    resetQuantities,
    getAvailableQuantity,
    isItemSelected,
    isCategoryLocked,
    getCategoryLockMessage,
  } = useInventoryQuantities();

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

    // Reset inventory quantities
    resetQuantities();

    toast.success("Canvas cleared and inventory reset");
  };

  const handleAddToCanvas = (item: InventoryItem) => {
    const availableQty = getAvailableQuantity(item.id);
    if (availableQty <= 0) {
      toast.error("No more of this item available");
      return;
    }

    // Create new canvas item with category and zIndex
    const newCanvasItem: CanvasItem = {
      canvasId: `${item.id}-${Date.now()}`,
      name: item.name,
      image: item.image,
      category: item.category,
      x: 150 + Math.random() * 200,
      y: 150 + Math.random() * 200,
      scaleX: 0.5,
      scaleY: 0.5,
      rotation: 0,
      zIndex: 0,
    };

    const newItems = [...items, newCanvasItem];
    handleItemsChange(newItems);
    decrementQuantity(item.id, item.category);
    toast.success(`Added ${item.name} to canvas`);
  };

  const handleUnselectItem = (item: InventoryItem) => {
    // Remove all instances of this item from canvas
    const newItems = items.filter(
      (canvasItem) => !canvasItem.canvasId.startsWith(item.id)
    );
    handleItemsChange(newItems);
    unselectItem(item.id, item.category);
    toast.success(`Removed ${item.name} from canvas`);
  };

  const handleLayerChange = (id: string, direction: 'up' | 'down' | 'front' | 'back') => {
    const item = items.find(i => i.canvasId === id);
    if (!item) return;

    // Get all items in the same layer tier
    const sameTierItems = items.filter(i => {
      const thisPriority = getLayerPriorityForCategory(i.category);
      const targetPriority = getLayerPriorityForCategory(item.category);
      return thisPriority === targetPriority;
    });

    let newZIndex = item.zIndex;

    switch (direction) {
      case 'up':
        newZIndex = item.zIndex + 1;
        break;
      case 'down':
        newZIndex = item.zIndex - 1;
        break;
      case 'front': {
        const maxZ = Math.max(...sameTierItems.map(i => i.zIndex));
        newZIndex = maxZ + 1;
        break;
      }
      case 'back': {
        const minZ = Math.min(...sameTierItems.map(i => i.zIndex));
        newZIndex = minZ - 1;
        break;
      }
    }

    const newItems = items.map(i =>
      i.canvasId === id ? { ...i, zIndex: newZIndex } : i
    );
    handleItemsChange(newItems);
  };

  const handleExportSizes = () => {
    if (items.length === 0) {
      toast.error("No items on canvas to export");
      return;
    }

    // Group by category and take first item's scale for each
    const sizesByCategory: Record<string, { scaleX: number; scaleY: number; name: string }> = {};
    
    items.forEach(item => {
      if (!sizesByCategory[item.category]) {
        sizesByCategory[item.category] = {
          scaleX: Math.round(item.scaleX * 1000) / 1000,
          scaleY: Math.round(item.scaleY * 1000) / 1000,
          name: item.name,
        };
      }
    });

    const output = JSON.stringify(sizesByCategory, null, 2);
    console.log("=== EXPORTED SIZES ===");
    console.log(output);
    
    // Copy to clipboard
    navigator.clipboard.writeText(output).then(() => {
      toast.success("Sizes copied to clipboard! Check console for details.");
    });
  };

  const handleAiGenerate = async (vibeText: string) => {
    if (!stageRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
      const base64 = dataUrl.split(",")[1];

      // Generate inventory summary from canvas items
      const itemCounts = items.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const inventoryText =
        Object.entries(itemCounts)
          .map(([name, count]) => (count > 1 ? `${count}x ${name}` : name))
          .join(", ") || "Mixed decor elements";

      // Construct the full prompt with the new wrapper
      const formattedPrompt = `Generate a clean, professional indoor wedding stage mockup.

IMPORTANT: Use the provided layout image as INSPIRATION only. Generate a beautiful, creative design using the elements and items shown in the image. You do NOT need to adhere closely to the exact layout—instead, keep a general idea of what items are present and their approximate positioning, but BE CREATIVE with the final setup. Feel free to reinterpret spacing, arrangement, and styling to create a more polished and visually appealing result.

Camera and framing:
- Wide, front-facing angle
- Eye-level perspective
- Straight-on shot, centered on the stage
- Entire decor setup visible in the frame

Overall positioning:
- Primary seating centered on the stage
- Supporting decor arranged evenly or symmetrically around the center
- Vertical decor elements placed behind the seating
- Floor-level decor placed near the base of seating and backdrop elements

Use only decor represented by the selected inventory and keep the composition balanced and cohesive.
Avoid extreme angles, heavy zooms, or off-center compositions.

Selected inventory:
${inventoryText}

Client vibe / styling preferences:
${vibeText.trim() || "Elegant and balanced"}

Focus on spacing, balance, and a polished event-ready presentation.`;

      const response = await generateLayout({
        imageBase64: base64,
        prompt: formattedPrompt,
        variations: 1,
      });

      if (response.images.length > 0) {
        setAiImages(response.images);
        toast.success("Design generated!");
        navigate("/ai-results");
      } else {
        toast.error("No image was generated. Please try again.");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate design. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Inventory Sidebar */}
      <InventorySidebar
        quantities={quantities}
        selectedCategories={selectedCategories}
        onAddToCanvas={handleAddToCanvas}
        onUnselect={handleUnselectItem}
        getAvailableQuantity={getAvailableQuantity}
        isItemSelected={isItemSelected}
        isCategoryLocked={isCategoryLocked}
        getCategoryLockMessage={getCategoryLockMessage}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold">Design Canvas</h1>
            <p className="text-muted-foreground mt-2">
              Open the inventory sidebar to add items, then drag and arrange
            </p>
          </div>
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mb-6">
          <Toolbar
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            onExportSizes={handleExportSizes}
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
              onLayerChange={handleLayerChange}
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
              No items on canvas yet. Click the menu button on the left to open
              the inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for layer priority (mirrors the one in CanvasEditor)
const getLayerPriorityForCategory = (category: string): number => {
  switch (category) {
    case "Drapes": return 0;
    case "Backdrops": return 100;
    case "Flooring/Rugs": return 150;
    case "Sofas":
    case "Chairs":
    case "Accessories":
    case "Lighting":
    case "Pillows": return 200;
    case "Flowers": return 300;
    default: return 200;
  }
};

export default Canvas;
