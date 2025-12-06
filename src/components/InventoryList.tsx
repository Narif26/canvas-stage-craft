import { useState } from "react";
import { InventoryItemCard } from "./InventoryItemCard";
import { inventoryData, categories, InventoryItem } from "@/data/inventory";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { QuantityState } from "@/hooks/useInventoryQuantities";

interface InventoryListProps {
  onAddToCanvas: (item: InventoryItem) => void;
  quantities: QuantityState;
}

export const InventoryList = ({ onAddToCanvas, quantities }: InventoryListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? inventoryData.filter((item) => item.category === selectedCategory)
    : inventoryData;

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          size="sm"
        >
          All Items
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Inventory Grid */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="w-[280px] flex-shrink-0">
              <InventoryItemCard
                item={item}
                availableQuantity={quantities[item.id] ?? item.quantity}
                onAddToCanvas={onAddToCanvas}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
