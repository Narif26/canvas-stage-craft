import { Button } from "@/components/ui/button";
import { InventoryList } from "@/components/InventoryList";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { InventoryItem } from "@/data/inventory";
import { toast } from "sonner";
import { useInventoryQuantities } from "@/hooks/useInventoryQuantities";

const Inventory = () => {
  const navigate = useNavigate();
  const { quantities, decrementQuantity, getAvailableQuantity } = useInventoryQuantities();

  const handleAddToCanvas = (item: InventoryItem) => {
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
    
    // Decrement the quantity
    decrementQuantity(item.id);
    
    toast.success(`${item.name} added to canvas!`);
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
        <InventoryList onAddToCanvas={handleAddToCanvas} quantities={quantities} />
      </div>
    </div>
  );
};

export default Inventory;
