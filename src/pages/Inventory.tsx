import { Button } from "@/components/ui/button";
import { InventoryList } from "@/components/InventoryList";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { InventoryItem } from "@/data/inventory";
import { toast } from "sonner";
import { useInventoryQuantities } from "@/hooks/useInventoryQuantities";

const Inventory = () => {
  const navigate = useNavigate();
  const { 
    quantities, 
    decrementQuantity, 
    unselectItem,
    getAvailableQuantity,
    isItemSelected,
    isCategoryLocked,
    getCategoryLockMessage 
  } = useInventoryQuantities();

  const handleAddToCanvas = (item: InventoryItem) => {
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

    // Get existing canvas items from sessionStorage
    const existingItems = sessionStorage.getItem("canvasItems");
    const items = existingItems ? JSON.parse(existingItems) : [];
    
    // Add new item with initial position
    const newItem = {
      ...item,
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
    
    toast.success(`${item.name} added to canvas!`);
  };

  const handleUnselect = (item: InventoryItem) => {
    // Remove all instances of this item from canvas
    const existingItems = sessionStorage.getItem("canvasItems");
    const items = existingItems ? JSON.parse(existingItems) : [];
    const filteredItems = items.filter((i: any) => !i.id.startsWith(item.id.split('-')[0]) || i.id !== item.id);
    
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
          >
            Go to Canvas
            <ArrowRight className="w-4 h-4 ml-2" />
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
