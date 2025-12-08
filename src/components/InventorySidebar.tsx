import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { inventoryData, categories, InventoryItem, InventoryCategory } from "@/data/inventory";
import { InventorySidebarItem } from "./InventorySidebarItem";
import { QuantityState, SelectedCategoriesState } from "@/hooks/useInventoryQuantities";

interface InventorySidebarProps {
  quantities: QuantityState;
  selectedCategories: SelectedCategoriesState;
  onAddToCanvas: (item: InventoryItem) => void;
  onUnselect: (item: InventoryItem) => void;
  getAvailableQuantity: (itemId: string) => number;
  isItemSelected: (itemId: string) => boolean;
  isCategoryLocked: (category: InventoryCategory, itemId: string) => boolean;
  getCategoryLockMessage: (category: InventoryCategory) => string;
}

export const InventorySidebar = ({
  onAddToCanvas,
  onUnselect,
  getAvailableQuantity,
  isItemSelected,
  isCategoryLocked,
  getCategoryLockMessage,
}: InventorySidebarProps) => {
  const [open, setOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Backdrops"])
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getItemsByCategory = (category: InventoryCategory) => {
    return inventoryData.filter((item) => item.category === category);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 h-32 w-8 rounded-r-lg rounded-l-none shadow-lg bg-primary text-primary-foreground border-0 hover:bg-primary/90 hover:text-primary-foreground flex items-center justify-center"
        >
          <span className="writing-mode-vertical text-sm font-semibold tracking-wider" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            Inventory
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Inventory</h2>
            <p className="text-sm text-muted-foreground">
              Select items to add to your canvas
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {categories.map((category) => {
                const items = getItemsByCategory(category);
                if (items.length === 0) return null;

                const isExpanded = expandedCategories.has(category);

                return (
                  <Collapsible
                    key={category}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-12 text-left font-semibold"
                      >
                        <span>{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-normal">
                            {items.length} items
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-2">
                      {items.map((item) => (
                        <InventorySidebarItem
                          key={item.id}
                          item={item}
                          availableQuantity={getAvailableQuantity(item.id)}
                          isCategoryLocked={isCategoryLocked(
                            item.category,
                            item.id
                          )}
                          isSelected={isItemSelected(item.id)}
                          lockMessage={getCategoryLockMessage(item.category)}
                          onAddToCanvas={onAddToCanvas}
                          onUnselect={onUnselect}
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
