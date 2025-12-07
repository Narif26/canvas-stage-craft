import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InventoryList } from "@/components/InventoryList";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { InventoryItem } from "@/data/inventory";
import { toast } from "sonner";
import { useInventoryQuantities } from "@/hooks/useInventoryQuantities";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

const Inventory = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    quantities, 
    decrementQuantity, 
    unselectItem,
    getAvailableQuantity,
    isItemSelected,
    isCategoryLocked,
    getCategoryLockMessage 
  } = useInventoryQuantities();

  const handleAddToCanvas = async (item: InventoryItem) => {
    // Check if category is locked for this item
    if (isCategoryLocked(item.category, item.id)) {
      toast.error(getCategoryLockMessage(item.category));
      return;
    }

    const available = getAvailableQuantity(item.id);
    if (available <= 0) {
      toast.error(`${item.name} is out of stock!`);
      return;
    }

    // Start processing
    setIsProcessing(true);
    const loadingToast = toast.loading(`Removing background from ${item.name}...`);

    try {
      // Load the image
      const imageElement = await loadImage(item.image);
      
      // Remove background
      const transparentImageUrl = await removeBackground(imageElement);

      // Get existing canvas items from sessionStorage
      const existingItems = sessionStorage.getItem("canvasItems");
      const items = existingItems ? JSON.parse(existingItems) : [];
      
      // Add new item with transparent image
      const newItem = {
        ...item,
        image: transparentImageUrl, // Use the processed transparent image
        canvasId: `${item.id}-${Date.now()}`,
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 200,
        scale: 1,
        rotation: 0,
      };
      
      items.push(newItem);
      sessionStorage.setItem("canvasItems", JSON.stringify(items));
      
      // Decrement the quantity and track category selection
      decrementQuantity(item.id, item.category);
      
      toast.dismiss(loadingToast);
      toast.success(`${item.name} added to canvas!`);
    } catch (error) {
      console.error('Failed to process image:', error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to process ${item.name}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnselect = (item: InventoryItem) => {
    // Remove all instances of this item from canvas
    const existingItems = sessionStorage.getItem("canvasItems");
    const items = existingItems ? JSON.parse(existingItems) : [];
    
    // Actually filter by the item's base id
    const updatedItems = items.filter((i: any) => {
      // canvasId is like "sofa-1-1234567890", item.id is "sofa-1"
      return !i.canvasId.startsWith(item.id);
    });
    
    sessionStorage.setItem("canvasItems", JSON.stringify(updatedItems));
    
    // Restore quantity and clear locks
    unselectItem(item.id, item.category);
    
    toast.success(`${item.name} removed from selection`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold">Browse Inventory</h1>
            <p className="text-muted-foreground mt-2">
              Select items to add to your event layout
            </p>
          </div>
          
          <Button
            size="lg"
            onClick={() => navigate("/canvas")}
            className="shadow-lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Go to Canvas
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Inventory List */}
        <InventoryList 
          onAddToCanvas={handleAddToCanvas}
          onUnselect={handleUnselect}
          quantities={quantities}
          isItemSelected={isItemSelected}
          isCategoryLocked={isCategoryLocked}
          getCategoryLockMessage={getCategoryLockMessage}
        />
      </div>
    </div>
  );
};

export default Inventory;
